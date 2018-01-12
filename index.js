var path = require("path");
var glob = require("glob");
var loaderUtils = require("loader-utils");
module.exports = function() {
    var options = Object.assign({
        "page-suffix":"html",
        "script-suffix":"js"
    },loaderUtils.getOptions(this));
    var pattern = options.pattern;
    var globOptions = options.options;
    var pageSuffix = options["page-suffix"];
    var scriptSuffix = options["script-suffix"];
    var context = this.options.context;
    var result = `var routers = {};`;
    glob.sync(path.join(context,pattern),globOptions).forEach(function(dir){
        var chunk = loaderUtils.urlToRequest(path.relative(context,dir));
        var page = loaderUtils.urlToRequest(path.join(chunk,path.basename(dir)+"."+pageSuffix));
        var script = loaderUtils.urlToRequest(path.join(chunk,path.basename(dir)+"."+scriptSuffix));
        result+= 
        `
        require.ensure(["${page}","${script}"],function(require){
            routers["${chunk}"]=require;
        },"${chunk}");
        `
    });
    result+=`module.exports = routers;`;
    return result.replace(/\\/g,"/");
};