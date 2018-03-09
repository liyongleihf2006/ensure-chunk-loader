# ensure-chunk-loader

Get the corresponding page resource and the corresponding script resource under the folders, and return the router

**do what? and why?**

In my project, the subpages are loaded by the router, but the subpages are added or reduced at any time. I don't want to manually configure a router every time I write a sub page. The router configuration I use is dynamically acquired. When I call a router, I can access corresponding sub pages. Yes, that's right. That's why I wrote this loader.

**Install**

```
npm install --save-dev ensure-chunk-loader
```  

**Usage**

Project structure

```
app
 |-modules
 |    |-first
 |    |   |-first.html
 |    |   |-first.js
 |    |-second
 |        |-second.html
 |        |-second.js
 |-index.html
 |-index.js
```  
webpack.config.js
```
var path = require("path");
var HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports={
    context:path.join(__dirname,"app"),
    entry:"./index.js",
    output:{
        path:path.join(__dirname,"dist"),
        filename:"[name].js",
        chunkFilename:"[name].js"
    },
    module: {
        rules: [
            {
                test: /\.(html)$/,
                use: {
                  loader: 'html-loader'
                }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template:path.join(__dirname,"app","index.html"),
            filename: '[name].html',
        })
    ]
}
```  

index.js
```
var router = require("ensure-chunk-loader?pattern=./modules/*/&page-extname=html&script-extname=js!");
router["./modules/first"]().then(function(chunk){
    console.log(chunk["page"]());
    console.log(chunk["script"]());
});
```  
**notes**

Although this is a'loader', it does not need to be passed in the source, so the parameters introduced in the'require' end with "!".

To use this'loader', you must ensure that the name of folders are the same as the file name of the page file and the script file (excluding the suffix). For example, the folder name is called'demo', so the page name must be called' demo.suffix '(suffix is html, jade and so on). The name of the script must be called'demo.suffix' (suffix is js, jsx, ts and so on).

**Options**

|name|type|default|description  
|:--:|:--:|:-----:|:----------| 
|pattern|string|undefined|Resource path|
|options|object|undefined|glob options|
|page-extname|string|"html"|Page suffix|
|script-extname|string|"js"|Script suffix|

pattern:Using glob pattern，it is the relative path to the value of context in webpack.Pattern is the glob of the path of the resource folder, so it ends with "/"

**the router**

when use this loader，the return value I call 'router'.
the 'router' is a Object,and its structure is like this:
```
{
  "./modules/first":fn,
  "./modules/second":fn,
  "other key(The path of a folder relative to the context)":fn
}
``` 
the `fn`'s return value is a instance of Promise,its resolve's parameter is `{page:page,script:script}` whitch equivalent to a similar as like `{page:function(){return require("./modules/first/first.html")},script:function(){return require("./modules/first/first.js")}}`
