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
SELECT ?wikidata ?desc ?wikipedia ?official_website ?instance_of ?instance_ofLabel ?freebase WHERE {             \
  ?wikidata wdt:' + proptype + ' "' + key + '".                   \
  optional { ?wikidata schema:description ?desc filter (lang(?desc) = "'+locale + '") . } \
  optional { ?wikidata wdt:P856 ?official_website . }             \
  optional { ?wikidata wdt:P31 ?instance_of . }                   \
  optional { ?wikidata wdt:P646 ?freebase . }                     \
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

function fetchYoutube(mid){
  $.getJSON('https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&topicId=' + encodeURI(mid) +'&key=' + GKEY,
    function(data){
      console.log('yt',data);
      var html;
      if(data.items && data.items.length > 0){
        html = Handlebars.templates.youtube(data);
        console.log(html);
        $("#youtube").append(html);
      }
    });
}

function ready(){
  var html = Handlebars.templates.rule(params);
  $("#rule").append(html);
}

fetchWikidata(params.key,
    params.type,
    function(data){
      console.log('fetchWikidata callback',data);
      var html = Handlebars.templates.genericInfo(data);
      $("#wikidataGeneric").append(html);
      $('body').on('click', 'a', function(){
        chrome.tabs.create({url: $(this).attr('href')});
        return false;
      });
      // third party
      if(data.freebase){
        fetchYoutube(data.freebase);
      }
    }
);
document.addEventListener( "DOMContentLoaded", ready, false );


/*
  var ytGetTopics = function(vid,cb){
    // couldn't get YT npm package to work in browserify
    $.getJSON('https://www.googleapis.com/youtube/v3/videos?part=topicDetails&id=' + vid +' &key=' + GKEY,
      function(data){
        if(data.items && data.items[0] && data.items[0].topicDetails){
          cb(_.compact(_.flatten(_.values(data.items[0].topicDetails))));
        }
	  });
  };

  var imdb2Wikidata = function(imdb,cb){
    console.log('imdb2Wikidata',imdb);
    var bindings, wids;
    -- jshint multistr: true
    var q = 'prefix wdt: <http://www.wikidata.org/prop/direct/> \
      prefix entity: <http://www.wikidata.org/entity/>          \
      SELECT ?item WHERE {                                      \
        VALUES (?value) { ("' +  imdb + '") }                       \
        ?item wdt:P345 ?value .                             \
      }';
    console.log(q);
    sparqlClient.query(q).execute(function(err,res){
      if(res && res.results && (bindings = res.results.bindings)){
        wids = _.map(bindings,function(x){
          return x.item.value.replace('http://www.wikidata.org/entity/','');
        });
        $.getJSON(Wdk.getEntities(wids,locale),function(res){
          console.log(res);
          if(res && res.entities){
            for(var i in res.entities){
              res.entities[i].claims = Wdk.simplifyClaims(res.entities[i].claims);
            }
            cb(res.entities);
          }
        });
      }
    });
  };

  var freebase2Wikidata = function(topics, cb){
    console.log('topics',topics);
    if(topics){
      var fbTopics = _.map(topics,function(x){ return '("' + x + '")'; }).join(' '),
        bindings, wids;
      -- jshint multistr: true
      var q = 'prefix wdt: <http://www.wikidata.org/prop/direct/> \
        prefix entity: <http://www.wikidata.org/entity/>          \
        SELECT ?item WHERE {                                      \
          VALUES (?value) { ' +  fbTopics + ' }      \
          ?item wdt:P646 ?value .                                 \
        }';
      console.log(q);
      sparqlClient.query(q).execute(function(err,res){
        if(res && res.results && (bindings = res.results.bindings)){
          wids = _.map(bindings,function(x){
            return x.item.value.replace('http://www.wikidata.org/entity/','');
          });
          $.getJSON(Wdk.getEntities(wids,locale),function(res){
            console.log(res);
            if(res && res.entities){
              for(var i in res.entities){
                res.entities[i].claims = Wdk.simplifyClaims(res.entities[i].claims);
              }
              cb(res.entities);
            }
          });
        }
      });
    }
  };

  var freebaseResolve = function(topics,entities,cb){
    // recursive
    // topics - [ freebase mid, ... ]
    // entities - [ entity, ... ]
    // cb - at the end call cb w/ entities as the argument
    console.log('fbResolve begin',topics,entities);
    if(topics.length === 0){
      cb(entities);
    } else {
      var tew, i,
        furl = 'https://www.googleapis.com/freebase/v1/topic',
        topic = topics.pop(),
        ret = {freebase:topic};
      $.getJSON(furl + topic,{
            key:GKEY,
            filter:'commons',
            limit:0
        },
        function(x){
          if(x.property){
            x = x.property;
            if(x['/type/object/name']){
              ret.label = x['/type/object/name'].values[0].value;
            } else {
              return;
            }
            if(x['/common/topic/topic_equivalent_webpage']){
              tew = x['/common/topic/topic_equivalent_webpage'].values;
              for(i=0; i < tew.length; i++){
                if(tew[i].value.match(/en\.wikipedia\.org\/wiki\//) && !tew[i].value.match(/en\.wikipedia\.org\/wiki\/index\.html/)){
                  ret.wiki = tew[i].value;
                  break;
                }
              }
              if(!ret.wiki){
                return;
              }
            } else {
              return;
            }
            if(x['/common/topic/official_website']){
              ret.website = x['/common/topic/official_website'].values[0].value;
            }
            entities.push(ret);
            console.log('fbResolve done',topics,entities);
            freebaseResolve(topics, entities,cb);
          }
        });
      }
    };

  var renderWiki = function(entities){
    console.log('renderWiki',entities);
    var ractive = new Ractive({
      el: '#wiki',
      template: '#wikiTemplate',
      data: {entities: entities, locale: locale}
    });
  };

  var renderFreebase = function(entities){
    console.log('renderFreebase',entities);
    var ractive = new Ractive({
      el: '#freebase',
      template: '#freebaseTemplate',
      data: {entities: entities, locale: locale}
    });
  };

chrome.tabs.getSelected(
  function(tab){
    var m,mid;
    console.log(tab.url);
    if((m = tab.url.match(/https?:\/\/www\.youtube\.com\/watch\?v=([\w\-]+)/)) && (mid = m[1])){
      console.log('vid',mid);
      ytGetTopics(mid,function(x){
        freebase2Wikidata(x,renderWiki);
        freebaseResolve(x,[],renderFreebase);
      });
    } else if((m = tab.url.match(/https?:\/\/www\.imdb\.com\/(name|title)\/(\w+)\/\??/)) && (mid = m[2])){
      console.log('imdb',mid);
      imdb2Wikidata(mid,renderWiki);
    }
  }
);
*/


/*;(function() {
  console.log('POPUP SCRIPT WORKS!');

  // here we use SHARED message handlers, so all the contexts support the same
  // commands. but this is NOT typical messaging system usage, since you usually
  // want each context to handle different commands. for this you don't need
  // handlers factory as used below. simply create individual `handlers` object
  // for each context and pass it to msg.init() call. in case you don't need the
  // context to support any commands, but want the context to cooperate with the
  // rest of the extension via messaging system (you want to know when new
  // instance of given context is created / destroyed, or you want to be able to
  // issue command requests from this context), you may simply omit the
  // `hadnlers` parameter for good when invoking msg.init()
  var handlers = require('./modules/handlers').create('popup');
  var msg = require('./modules/msg').init('popup', handlers);
  var form = require('./modules/form');
  var runner = require('./modules/runner');

  form.init(runner.go.bind(runner, msg));
})();*/
