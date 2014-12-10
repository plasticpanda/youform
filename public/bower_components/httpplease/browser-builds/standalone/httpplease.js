!function(a){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=a();else if("function"==typeof define&&define.amd)define([],a);else{var b;"undefined"!=typeof window?b=window:"undefined"!=typeof global?b=global:"undefined"!=typeof self&&(b=self),b.httpplease=a()}}(function(){return function a(b,c,d){function e(g,h){if(!c[g]){if(!b[g]){var i="function"==typeof require&&require;if(!h&&i)return i(g,!0);if(f)return f(g,!0);var j=new Error("Cannot find module '"+g+"'");throw j.code="MODULE_NOT_FOUND",j}var k=c[g]={exports:{}};b[g][0].call(k.exports,function(a){var c=b[g][1][a];return e(c?c:a)},k,k.exports,a,b,c,d)}return c[g].exports}for(var f="function"==typeof require&&require,g=0;g<d.length;g++)e(d[g]);return e}({1:[function(a,b){"use strict";function c(a,b){var c=new Error(a);c.name="RequestError",this.name=c.name,this.message=c.message,c.stack&&(this.stack=c.stack),this.toString=function(){return this.message};for(var d in b)b.hasOwnProperty(d)&&(this[d]=b[d])}var d=a("./response");c.prototype=Error.prototype,c.create=function(a,b,e){var f=new c(a,e);return d.call(f,b),f},b.exports=c},{"./response":4}],2:[function(a,b){"use strict";function c(a,b){function e(c,e){var m,n,o,p,q;for(c=new j(k(a,c)),d=0;d<b.length;d++)n=b[d],n.processRequest&&n.processRequest(c);for(d=0;d<b.length;d++)if(n=b[d],n.createXHR){m=n.createXHR(c);break}m=m||new f,c.xhr=m,o=l(g(function(a){clearTimeout(q),m.onload=m.onerror=m.onreadystatechange=m.ontimeout=m.onprogress=null;var f=a&&a.isHttpError?a:new i(c);for(d=0;d<b.length;d++)n=b[d],n.processResponse&&n.processResponse(f);a?c.onerror&&c.onerror(a):c.onload&&c.onload(f),e&&e(a,f)})),m.onreadystatechange=function(){if(!c.timedOut)if(c.aborted)o(h("Request aborted",c,{name:"Abort"}));else if(4===m.readyState){var a=Math.floor(m.status/100);if(2===a)o();else if(404!==m.status||c.errorOn404){var b;switch(a){case 4:b="Client";break;case 5:b="Server";break;default:b="HTTP"}var d=b+" Error: The server returned a status of "+m.status+' for the request "'+c.method.toUpperCase()+" "+c.url+'"';o(h(d,c))}else o()}},m.onload=function(){o()},m.onerror=function(){o(h("Internal XHR Error",c))},m.ontimeout=function(){},m.onprogress=function(){},m.open(c.method,c.url),c.timeout&&(q=setTimeout(function(){c.timedOut=!0,o(h("Request timeout",c,{name:"Timeout"}));try{m.abort()}catch(a){}},c.timeout));for(p in c.headers)c.headers.hasOwnProperty(p)&&m.setRequestHeader(p,c.headers[p]);return m.send(c.body),c}a=a||{},b=b||[];var m,n=["get","post","put","head","patch","delete"],o=function(a){return function(b,c){return b=new j(b),b.method=a,e(b,c)}};for(d=0;d<n.length;d++)m=n[d],e[m]=o(m);return e.plugins=function(){return b},e.defaults=function(d){return d?c(k(a,d),b):a},e.use=function(){var d=Array.prototype.slice.call(arguments,0);return c(a,b.concat(d))},e.bare=function(){return c()},e.Request=j,e.Response=i,e}var d,e=a("../plugins/cleanurl"),f=a("./xhr"),g=a("./utils/delay"),h=a("./error").create,i=a("./response"),j=a("./request"),k=a("xtend"),l=a("./utils/once");b.exports=c({},[e])},{"../plugins/cleanurl":9,"./error":1,"./request":3,"./response":4,"./utils/delay":5,"./utils/once":6,"./xhr":7,xtend:8}],3:[function(a,b){"use strict";function c(a){var b="string"==typeof a?{url:a}:a||{};this.method=b.method?b.method.toUpperCase():"GET",this.url=b.url,this.headers=b.headers||{},this.body=b.body,this.timeout=b.timeout||0,this.errorOn404=null!=b.errorOn404?b.errorOn404:!0,this.onload=b.onload,this.onerror=b.onerror}c.prototype.abort=function(){return this.aborted?void 0:(this.aborted=!0,this.xhr.abort(),this)},c.prototype.header=function(a,b){var c;for(c in this.headers)if(this.headers.hasOwnProperty(c)&&a.toLowerCase()===c.toLowerCase()){if(1===arguments.length)return this.headers[c];delete this.headers[c];break}return null!=b?(this.headers[a]=b,b):void 0},b.exports=c},{}],4:[function(a,b){"use strict";function c(a){var b,c,d,e=a.xhr;if(this.request=a,this.xhr=e,this.headers={},!a.aborted&&!a.timedOut){if(this.status=e.status||0,this.text=e.responseText,this.body=e.response||e.responseText,this.contentType=e.contentType||e.getResponseHeader&&e.getResponseHeader("Content-Type"),e.getAllResponseHeaders)for(c=e.getAllResponseHeaders().split("\n"),b=0;b<c.length;b++)(d=c[b].match(/\s*([^\s]+):\s+([^\s]+)/))&&(this.headers[d[1]]=d[2]);this.isHttpError=this.status>=400}}var d=a("./request");c.prototype.header=d.prototype.header,b.exports=c},{"./request":3}],5:[function(a,b){"use strict";b.exports=function(a){return function(){var b=Array.prototype.slice.call(arguments,0),c=function(){return a.apply(null,b)};setTimeout(c,0)}}},{}],6:[function(a,b){"use strict";b.exports=function(a){var b,c=!1;return function(){return c||(c=!0,b=a.apply(this,arguments)),b}}},{}],7:[function(a,b){b.exports=window.XMLHttpRequest},{}],8:[function(a,b){function c(){for(var a={},b=0;b<arguments.length;b++){var c=arguments[b];for(var d in c)c.hasOwnProperty(d)&&(a[d]=c[d])}return a}b.exports=c},{}],9:[function(a,b){"use strict";b.exports={processRequest:function(a){a.url=a.url.replace(/[^%]+/g,function(a){return encodeURI(a)})}}},{}]},{},[2])(2)});