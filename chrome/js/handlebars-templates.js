(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['genericInfo'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "  <b>Instance of</b> "
    + alias4(((helper = (helper = helpers.instance_ofLabel || (depth0 != null ? depth0.instance_ofLabel : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"instance_ofLabel","hash":{},"data":data}) : helper)))
    + "<br/>\r\n  <b>Desc</b> "
    + alias4(((helper = (helper = helpers.desc || (depth0 != null ? depth0.desc : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"desc","hash":{},"data":data}) : helper)))
    + "\r\n  <li><a href=\""
    + alias4(((helper = (helper = helpers.wikidata || (depth0 != null ? depth0.wikidata : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"wikidata","hash":{},"data":data}) : helper)))
    + "\">Wikidata</a> </li>\r\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.official_website : depth0),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\r\n  <li><a href=\""
    + alias4(((helper = (helper = helpers.wikipedia || (depth0 != null ? depth0.wikipedia : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"wikipedia","hash":{},"data":data}) : helper)))
    + "\">Wikipedia</a></li>\r\n";
},"2":function(container,depth0,helpers,partials,data) {
    var helper;

  return "    <li><a href=\""
    + container.escapeExpression(((helper = (helper = helpers.official_website || (depth0 != null ? depth0.official_website : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"official_website","hash":{},"data":data}) : helper)))
    + "\">Official website</a></li>\r\n";
},"4":function(container,depth0,helpers,partials,data) {
    return "  No <a href=\"https://www.wikidata.org/\">Wikidata</a> entry found for this key,\r\n  maybe you should enter it.\r\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers["if"].call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.wikidata : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(4, data, 0),"data":data})) != null ? stack1 : "");
},"useData":true});
templates['rule'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "  From the URL it looks like this is a wikidata type\r\n  <b><a href=\""
    + alias4(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"type","hash":{},"data":data}) : helper)))
    + "\">"
    + alias4(((helper = (helper = helpers.label || (depth0 != null ? depth0.label : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"label","hash":{},"data":data}) : helper)))
    + "</a></b> with a key of <b>"
    + alias4(((helper = (helper = helpers.key || (depth0 != null ? depth0.key : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"key","hash":{},"data":data}) : helper)))
    + "</b>.\r\n";
},"useData":true});
templates['youtube'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "  <li>\r\n    <a href=\"https://youtube.com/watch?v="
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.id : depth0)) != null ? stack1.videoId : stack1), depth0))
    + "\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.snippet : depth0)) != null ? stack1.title : stack1), depth0))
    + "</a>\r\n    <a href=\"https://youtube.com/watch?v="
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.id : depth0)) != null ? stack1.videoId : stack1), depth0))
    + "\">\r\n      <img src=\""
    + alias2(alias1(((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.snippet : depth0)) != null ? stack1.thumbnails : stack1)) != null ? stack1["default"] : stack1)) != null ? stack1.url : stack1), depth0))
    + "\"\r\n        height=\""
    + alias2(alias1(((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.snippet : depth0)) != null ? stack1.thumbnails : stack1)) != null ? stack1["default"] : stack1)) != null ? stack1.height : stack1), depth0))
    + "\"\r\n        width=\""
    + alias2(alias1(((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.snippet : depth0)) != null ? stack1.thumbnails : stack1)) != null ? stack1["default"] : stack1)) != null ? stack1.width : stack1), depth0))
    + "\">\r\n    </a>\r\n  </li>\r\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<h3>Youtube videos</h3>\r\n\r\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.items : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"useData":true});
})();