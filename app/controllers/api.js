/**
 * defines the list of public methods of the api
 * for example tasks_get maps /api/tasks/get with the model tasks and the method getTasks
 */
var dictionary = {
    tasks_get: {
        model: 'tasks',
        method: 'getTasks',
        authenticated: true
    },
    tasks_set: {
        model: 'tasks',
        method: 'setStatus',
        params: ['param1', 'param2'],
        authenticated: true
    }

};

function loadResource(req, callback) {
    var resource    = req.params.resource;
    var method      = req.params.method;
    var endpoint    = dictionary[resource + "_" + method];
    var paramArray  = [];
    // if this endpoint is defined in the dictionary
    if(endpoint) {
        // load the model
        var model = require('../models/' + endpoint.model);
        // if we have parameters, inject them
        if(endpoint.params) {
            for(var index in endpoint.params) {
                console.log(endpoint.params[index]);
                paramArray.push(req.params[endpoint.params[index]]);
            }
        }
        // invoke the endpoint
        model[dictionary[resource + "_" + method].method](callback, paramArray);
    } else {
        callback({result: false, msg: 'resource not found'});
    }
}

module.exports = function(app) {
    return {
        index: function(req, res, next) {
            res.set('Content-Type', 'application/json');
            loadResource(
                req,
                function(result) {
                    res.send(result);
                }
            );
        }
    };
};
