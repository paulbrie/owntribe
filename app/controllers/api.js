var dictionary = {
    tasks_get: {
        model: 'tasks',
        method: 'getTasks'
    }
};

function loadResource(resource, method, callback) {
    if(dictionary[resource + "_" + method]) {
        var model = require('../models/' + dictionary[resource + "_" + method].model);
        model[dictionary[resource + "_" + method].method](callback);
        model = null;
    } else {
        callback({result: false, msg: 'resource not found'});
    }
}

module.exports = function(app) {
    return {
        index: function(req, res, next) {
            res.set('Content-Type', 'application/json');
            loadResource(
                req.params.resource,
                req.params.method,
                function(result) {
                    res.send(result);
                }
            );
        }
    };
};
