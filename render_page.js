var args = require('system').args,
    _ = require('underscore');

var items = [], params = {};
_.each(args, function(arg){
    var param;
    var eqPosition = arg.indexOf('=');
    if (arg.indexOf('--') === 0 && eqPosition !== -1) {
        params[ arg.substring(2, eqPosition) ] = arg.substring(eqPosition+1);
    }
});

if(!params.out) {
    console.error('Omitted required parameter "out"');
    phantom.exit();
}
if(!params.url) {
    console.error('Omitted required parameter "url"');
    phantom.exit();
}
params.width = params.width || 1024;
params.height = params.height || 768;

var t = Date.now();
var page = require('webpage').create();
page.viewportSize = {
    width: params.width,
    height: params.height
};

page.open(params.url, function (status) {
    if (status !== 'success') {
        console.log('FAIL to load "' + params.url + '"');
    } else {
        console.log('"'+params.url+'" loaded in ' + (Date.now() - t) + ' msec. Viewport: ' + params.width + 'x' + params.height);
    }
    page.render(params.out);
    page.close();

    phantom.exit();
});
