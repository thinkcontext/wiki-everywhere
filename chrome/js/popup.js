console.log("popup");
var _ = locale = navigator.language.slice(0,2) || 'en',
    sparqlEndpoint = 'https://query.wikidata.org/bigdata/namespace/wdq/sparql',
    wikiTemplate;

var params = JSON.parse(decodeURI( document.location.search ).slice(1));

function fetchWikidata(key,type,cb){
    var proptype = type.match(/wikidata\.org\/entity\/(P\d+)/);
    if(proptype){
	proptype = proptype[1];
    } else {
	return;
    }
    
    // jshint multistr: true
    var q = 'prefix wdt: <http://www.wikidata.org/prop/direct/> \
prefix entity: <http://www.wikidata.org/entity/>              \
PREFIX schema: <http://schema.org/>                           \
PREFIX bd: <http://www.bigdata.com/rdf#>                      \
PREFIX wikibase: <http://wikiba.se/ontology#>                 \
                                                              \
SELECT ?wikidata ?desc ?wikipedia ?official_website ?instance_of ?instance_ofLabel ?facebook ?twitter ?politifact ?nyt ?instagram ?freebase ?gkg WHERE {             \
  ?wikidata wdt:' + proptype + ' "' + key + '".                   \
  optional { ?wikidata schema:description ?desc filter (lang(?desc) = "'+locale + '") . } \
  optional { ?wikidata wdt:P856 ?official_website . }             \
  optional { ?wikidata wdt:P31 ?instance_of . }                   \
  optional { ?wikidata wdt:P2267 ?politifact . }                     \
  optional { ?wikidata wdt:P3221 ?nyt . }                     \
  optional { ?wikidata wdt:P2002 ?twitter . }                     \
  optional { ?wikidata wdt:P2013 ?facebook . }                     \
  optional { ?wikidata wdt:P646 ?freebase . }                     \
  optional { ?wikidata wdt:P2671 ?gkg . }                     \                \
  ?wikipedia schema:about ?wikidata . ?wikipedia schema:inLanguage "en".    \
  SERVICE wikibase:label {                                        \
    bd:serviceParam wikibase:language "' + locale + '" .          \
  }                                                               \
  filter regex(str(?wikipedia), "wikipedia.org")                  \
 }';

  console.log(q);
  $.getJSON(sparqlEndpoint, {query: q}, function(res,err){
    var ret = {};
    console.log('sp',res,err);
    if(res && res.results && res.results.bindings){
      for(var i in res.results.bindings[0]){
        ret[i] = res.results.bindings[0][i].value;
      }
      cb(ret);
    }
  });
}

function doRSS(url,title){
    var parser = new RSSParser();
    parser.parseURL(url,function(err,rss){
	rss.items = rss.items.slice(0,4);
	rss.title = title;
	console.log('rss',rss);
	var html = Handlebars.templates.rss(rss);
	$("#politifact").append(html);
    });
}

function fetchGTrends(mid){
    var html = Handlebars.templates.gtrends({mid:mid,mid_enc: encodeURIComponent(mid)});
    $("#gtrends").append(html);
}

function fetchPolitifact(pid){
    doRSS('https://www.politifact.com/feeds/statementsby/'+pid+'/', 'Politifact - P2267');
}

function fetchNYT(nyt){
    doRSS('https://www.nytimes.com/svc/collections/v1/publish/http://www.nytimes.com/topic/' + nyt + '/rss.xml', 'NYTimes Topic - P3221');
}

function ready(){
    var html = Handlebars.templates.rule(params);
    $("#rule").append(html);
}

fetchWikidata(
    params.key,
    params.type,
    function(data){
	console.log('fetchWikidata callback',data);
	var html = Handlebars.templates.genericInfo(data);
	$("#wikidataGeneric").append(html);
	$('body').on('click', 'a', function(){
	    chrome.tabs.create({url: $(this).attr('href')});
	    return false;
	});
	if(data.politifact){
	    fetchPolitifact(data.politifact);
	}
	if(data.nyt){
	    fetchNYT(data.nyt);
	}
	// if(data.freebase || data.gkg){
	//     fetchGTrends(data.freebase || data.gkg);
	// }
    }
);
document.addEventListener( "DOMContentLoaded", ready, false );


