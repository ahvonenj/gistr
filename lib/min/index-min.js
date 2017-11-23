global.columnify=require("columnify"),global.Client=require("node-rest-client").Client,global.asyncLoop=require("node-async-loop"),global.fs=require("fs"),global.Storage=require("node-storage"),global.fuzzy=require("fuzzy"),global.util=require("util"),global.download=require("download"),global.Private={version:"1.1.1",catchphrases:["because you're worth it","power to the gists","snippety-snap","gistiful!"]},global.Github={url:"https://api.github.com",default_headers:function(e){var t={"User-Agent":"Gistr v"+Private.version};return void 0!==store.get("access-token")?(consoleLog("Gisting with a saved token",e),t.Authorization="token "+store.get("access-token")):consoleLog("Gisting without saved token",e),t}},global.client=new Client,global.store=new Storage(__dirname+"/.gistr_storage"),require("./util-min.js").wrap(global),require("./token-min.js").wrap(global),require("./gist-min.js").wrap(global);var main=function(){return console.log("Usage: gistr -h")},version=function(){return console.log("gistr v"+Private.version)},help=function(){var e="gistr - "+Private.catchphrases[Math.floor(Math.random()*Private.catchphrases.length)]+"\n\n"+columnify({execdir:"Output current executing directory",moduledir:"Output current module directory"},{columns:["CMD","DESC"]});return console.log(e)};exports.main=main,exports.help=help,exports.creategist=createGist,exports.add=createGist,exports.create=createGist,exports.version=version,exports.list=listGists,exports.gists=listGists,exports.find=findGist,exports.search=findGist,exports.show=showGist,exports.details=showGist,exports.pull=pullGist,exports.get=pullGist,exports["save-token"]=saveToken,exports["add-token"]=saveToken,exports["remove-token"]=removeToken,exports["delete-token"]=removeToken,exports["show-token"]=showToken,exports["display-token"]=showToken;