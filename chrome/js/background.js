// from http://jsperf.com/url-parsing
var urlParseRE = /^(((([^:\/#\?]+:)?(?:(\/\/)((?:(([^:@\/#\?]+)(?:\:([^:@\/#\?]+))?)@)?(([^:\/#\?\]\[]+|\[[^\/\]@#?]+\])(?:\:([0-9]+))?))?)?)?((\/?(?:[^\/\?#]+\/+)*)([^\?#]*)))?(\?[^#]+)?)(#.*)?/;

var locale = navigator.language.slice(0,2) || 'en',
  rulesTimeS = localStorage.getItem('rulesTime'),
  rulesTime = rulesTimeS ? new Date(rulesTimeS) : null,
  ruleMap,
  sparqlEndpoint = 'https://query.wikidata.org/bigdata/namespace/wdq/sparql';

// check if we have rules

if(! rulesTime || ( Date.now - rulesTime > 3600 * 24 * 7)){
  fetchRules(function(){ ruleMap = processRules(); });
} else {
  ruleMap = processRules();
}

/*chrome.webNavigation.onHistoryStateUpdated.addListener(function(details) {
  console.log('Page uses History API and we heard a pushSate/replaceState.',details);
});*/

// declaritive content is more efficient but less flexible, consider it for later
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
  var turl,thost,rules,rule,j,key, tps;
  if(changeInfo.status === 'loading'){
    chrome.pageAction.hide(tabId);
    turl = parseUrl(tab.url);
    thost = turl.host;
    tps = turl.path ? turl.path : '';
    tps = tps + (turl.search ? turl.search : '');
    if(rules = ruleMap[thost]){
      for(var i in rules){
        key = applyRule(rules[i],tps);
        console.log(key,tps);
        if(key){
          j = rules[i];
          j.key = key;
          j = encodeURI(JSON.stringify(j));
          chrome.pageAction.setPopup({tabId: tabId, popup: 'html/popup.html?' + j});
          chrome.pageAction.show(tabId);
          break;
        }
      }
    }
  }
});

function applyRule(rule,ps){
  var m;
  if(rule && rule.re && (m = rule.re.exec(ps))){
    return m[1].replace(/\/$/,''); // remove a trailing /
  }
}

function fetchRules(cb){

  var authSparql = "PREFIX bd: <http://www.bigdata.com/rdf#> PREFIX wdt: <http://www.wikidata.org/prop/direct/> PREFIX wikibase: <http://wikiba.se/ontology#> PREFIX wds: <http://www.wikidata.org/entity/statement/> SELECT ?proptypeLabel ?proptype ?propstat ?propre WHERE {   ?proptype wdt:P1630 ?propstat .   optional { ?proptype wdt:P1793 ?propre }    SERVICE wikibase:label {     bd:serviceParam wikibase:language \"en\" .    } }  ";

  $.getJSON(sparqlEndpoint, {query: authSparql}, function(res,err){
    if(res && res.results && res.results.bindings){
      localStorage.setItem('rules',JSON.stringify(res.results.bindings));
      localStorage.setItem('rulesTime',(new Date()).toJSON());
      if(cb){
        cb();
      }
    }
  });
}

function escapeReUrl(str){
  if(str){
    return str.replace(/([\.\/\+])/g,"\\$1");
  }
}

function getRules(){
  return JSON.parse(localStorage.getItem('rules'));
}

function processRules(){
  // Hash the rules on domain

  var rules = getRules();
  var ruleHash = {};
  if(!rules){ return; }

  rules.forEach(function(x){
    var url = x.propstat.value,
      re = '.+', finRE,
      purl = parseUrl(url);

    if(! purl.host){ return; }

    finRE = purl.path ? purl.path : purl.search;
    if( purl.path ){
      finRE = escapeReUrl(purl.path);
    }
    if( purl.search){
      finRE = finRE ? finRE + '\\' + escapeReUrl(purl.search) : escapeReUrl(purl.search);
    }
    if(! finRE || ! finRE.includes('$1')){ return; }

    finRE = finRE.replace('$1','(' + re + ')' );
    try {
      finRE = new RegExp( finRE );
    } catch(e){
      console.log("failed",finRE,x,e);
      return;
    }
    if(ruleHash[purl.host]){
      ruleHash[purl.host].push({ re: finRE, label: x.proptypeLabel.value, type: x.proptype.value});
    } else {
      ruleHash[purl.host] = [{ re: finRE, label: x.proptypeLabel.value, type: x.proptype.value}];
    }

  });
  return ruleHash;
}

function parseUrl(url){
  var matches = urlParseRE.exec(url);
  return {
    host: matches[11] ? matches[11].replace(/^www\./,'') : null,
    path: matches[13],
    search: matches[16]
  };
}
