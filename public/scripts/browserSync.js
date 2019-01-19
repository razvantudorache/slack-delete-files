'use strict';
//<![CDATA[
var localhost = 'localhost';
var enableBrowserSync = localhost.indexOf(location.hostname) !== -1;

if (enableBrowserSync) {
  document.write("<script async src='http://HOST:3001/browser-sync/browser-sync-client.js?v=2.23.5'><\/script>".replace("HOST", location.hostname).replace("PROTOCOL", location.protocol));
}
//]]>
