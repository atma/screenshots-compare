var async = require('async');
var _ = require('underscore');
var config = require('./config.json');
var argv = require('optimist').argv;

var datasetName = argv.dataset,
    items = [];
if(datasetName && config.datasets[datasetName]) {
    parseDataset(config.datasets[datasetName], datasetName);
} else {
    _.each(config.datasets, function(s, datasetName) {
        parseDataset(s, datasetName);
    });
}

var chalk = require('chalk');
var logError = chalk.bold.red;
var logSuccess = chalk.bold.green;
var logInfo = chalk.bold.gray;

var t = Date.now();
var workingHost = argv.host || config.default_host;
var customViewport = argv.viewport;

if(workingHost.indexOf('http') !== 0) {
    workingHost = 'http://' + workingHost;
}
if(workingHost[workingHost.length-1] === '/') {
    workingHost = workingHost.substring(0, workingHost.length - 1);
}

async.each(items, saveReferenceImage, function(err) {
    if (err) {
        console.log(logError(err.message));
    } else {
        console.log(logSuccess('Done rendering reference images'));
    }
});

function saveReferenceImage(item, callback) {
    if(customViewport && item.viewport.name !== customViewport) {
        return callback(null);
    }

    var spawn = require('child_process').spawn,
        cmd    = spawn('phantomjs', [
            'render_page.js',
            '--url=' + workingHost + item.uri,
            '--out=' + ('images/reference/'+ item.dataset +'/' +item.name + '-' + item.viewport.name + '.png'),
            '--width=' + item.viewport.size.width,
            '--height=' + item.viewport.size.height
        ]);

    cmd.stdout.on('data', function (data) {
        console.log(logInfo(data));
    });
    cmd.stderr.on('data', function (data) {
        callback(data);
    });
    cmd.on('close', function (code) {
        callback(null);
    });
}

function parseDataset(dataset_items, dataset_name) {
    _.each(dataset_items, function(uri, name) {
        _.each(config.sizes, function(size, sizeName) {
            items.push({
                name: name,
                uri: uri,
                viewport: {name: sizeName, size: size},
                dataset: dataset_name
            });
        })
    });
}
