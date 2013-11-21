var gm = require('gm');
var async = require('async');
var _ = require('underscore');
var config = require('./config.json');
var argv = require('optimist').argv;
var wrench = require('wrench');
var fs = require('fs');

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

var startDate = new Date();
var t = startDate.getTime();

var workingHost = argv.host || config.default_host;
var customImage = argv.image;
var customViewport = argv.viewport;

async.eachSeries(items, CompareImage, function(err) {
    if (err) {
        console.log(logError(err.message));
    } else {
        console.log(logSuccess('Comparison completed in ' + (Date.now() - t) + 'ms'));
        console.log(logInfo('The results was written to images/diff/(...)/' + getTimeStamp(startDate) + '/'));
    }
});

function CompareImage(item, callback) {
    if(customImage && item.name !== customImage) {
        return callback(null);
    }
    if(customViewport && item.viewport.name !== customViewport) {
        return callback(null);
    }

    var ref_img = 'images/reference/'+ item.dataset +'/' +item.name + '-' + item.viewport.name + '.png',
        res_img = 'images/results/'+ item.dataset +'/' +item.name + '-' + item.viewport.name + '.png';

    var spawn = require('child_process').spawn,
        cmd    = spawn('phantomjs', [
            'render_page.js',
            '--url=' + workingHost + item.uri,
            '--out=' + (res_img),
            '--width=' + item.viewport.size.width,
            '--height=' + item.viewport.size.height
        ]);

    cmd.stdout.on('data', function (data) {
        console.log(logInfo(data));
    });
    cmd.stderr.on('data', function (data) {
         return callback(data);
    });
    cmd.on('close', function (code) {
        var out_dir = 'images/diff/'+ item.dataset +'/' + getTimeStamp(startDate) + '/';
        if(!fs.existsSync(out_dir)) {
            wrench.mkdirSyncRecursive(out_dir, 0777);
        }
        var gm_options = {
            highlightColor: 'red',
            file:  out_dir + item.name + '-' + item.viewport.name + '.png'
        };
        gm.compare(ref_img, res_img, gm_options, function (err) {
            callback(err);
        });
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

function getTimeStamp(d) {
    var stamp = '' + d.getFullYear() + (d.getMonth() + 1) + zeroPad(d.getDate()) +
        '-' +
        zeroPad(d.getHours()) + zeroPad(d.getMinutes()) + zeroPad(d.getSeconds());

    return stamp;
}

function zeroPad(x) {
    return x > 9 ? ''+x : '0'+x;
}
