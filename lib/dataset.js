var _ = require('underscore'),
    config = require('../config.json');

function parseDataset(dataset_items, dataset_name) {
    var items = [];
    _.each(dataset_items, function(uri, name) {
        var uris = {
            reference: '',
            compare: ''
        };
        if (_.isString(uri)) {
            uris = {
                reference: uri,
                compare: uri
            }
        } else if (_.isObject(uri) && uri.reference && uri.compare) {
            uris = {
                reference: uri.reference,
                compare: uri.compare
            }
        }

        _.each(config.sizes, function(size, sizeName) {
            items.push({
                name: name,
                uri: uris,
                viewport: {name: sizeName, size: size},
                dataset: dataset_name
            });
        })
    });

    return items;
}

module.exports = {
    parseDataset: parseDataset
}
