var parseGistResponse=function(e,s){s=s||!1;try{t=JSON.parse(e)}catch(s){var t=e}var i={};for(var r in t.files)if(t.files.hasOwnProperty(r)){var o=t.files[r];i[r]={filename:o.filename,type:o.type,language:o.language,raw_url:o.raw_url,size:o.size}}var n={id:t.id,url:t.url,html_url:t.html_url,created_at:t.created_at,description:t.description,authenticated:void 0!==t.owner,files:i};return s?JSON.stringify(n):n},isRateLimited=function(e){if(Array.isArray(e)){for(var s=0;s<e.length;s++){var t=e[s];if(0===Object.keys(t.files).length)return!0}return!1}return 0===Object.keys(e.files).length},consoleLog=function(e,s){verbose=s.v||s.verbose||!1,verbose&&console.log(e)},storeGists=function(e){if(void 0===store.get("gists"))Array.isArray(e)?store.put("gists",e):store.put("gists",[e]);else{var s=store.get("gists");if(Array.isArray(e))for(var t=0;t<e.length;t++)s.push(e[t]);else s.push(e);store.put("gists",s)}},getGistOrDie=function(e){if(void 0===e||void 0===e._[1]||""===e._[1])if(void 0===e.id||""===e.id)console.log("Gist # not supplied"),process.exit(1);else s=parseInt(e.id);else var s=parseInt(e._[1]);isNaN(s)&&(console.log("Gist # is not a number"),process.exit(1)),void 0===store.get("gists")&&(console.log("No gists stored"),process.exit(1));var t=store.get("gists");return void 0===t[s]&&(console.log("Gist "+s+" does not exist"),process.exit(1)),t[s]};exports.wrap=function(e){e.parseGistResponse=parseGistResponse,e.isRateLimited=isRateLimited,e.consoleLog=consoleLog,e.storeGists=storeGists,e.getGistOrDie=getGistOrDie};