function intval(val) {
    return parseInt(val) > 0;
}

/**
 * defines the list of public and private methods of the api
 * for example tasks_get maps /api/tasks/get with the model tasks and the method getTasks
 */
var dictionary = {
    tasks_add: {
        expose: true,
        model: 'tasks',
        method: 'add',
        params: {
            title: {
                constraint: ".+",
                required: true
            },
            description: {
                constraint: ".*",
                required: true
            }
        },
        authenticated: true
    },
    tasks_get: {
        expose: true,
        model: 'tasks',
        method: 'getTasks',
        params: {
            type: {
                constraint: "[done|deleted]",
                required: false
            }
        },
        authenticated: true
    },
    tasks_set: {
        expose: true,
        model: 'tasks',
        method: 'setStatus',
        params: {
            id: {
                constraint: intval,
                required: true
            },
            status: {
                constraint: '[new|done]',
                required: true
            }
        },
        authenticated: true
    },
    // ----- USERS -----
    users_login: {
        expose: true,
        model: 'users',
        method: 'login',
        params: {
            email: {
                constraint: ".*",
                required: true
            },
            password: {
                constraint: ".*",
                required: true
            }
        },
        authenticated: false
    },
    // ----- TIMELINE -----
    timeline_add: {
        expose: true,
        model: 'timeline',
        method: 'add',
        params: ['param1'],
        paramsNames: {
            add: {
                constraint: ".*",
                required: true
            }
        },
        authenticated: true
    }
};

function loadResource(req, callback) {

    // is the call done by the program itself?
    if(req.internalCall) {
        var resource        = req.internalCall.resource;
        var method          = req.internalCall.method;
        var externalParams  = req.internalCall.params || {};

    // else it is a http call
    } else {
        var resource        = req.params.resource;
        var method          = req.params.method;
        var externalParams  = req.params || {};
    }

    var endpoint = dictionary[resource + "_" + method];
    if(!endpoint.expose) {
        callback({result: false, msg: 'This endpoint does not exist.'});
    } else {
        var params      = {};
        // if this endpoint is defined in the dictionary
        if(endpoint) {
            if(endpoint.authenticated && !req.session.user.logged) {
                callback({result: false, msg: 'you must be logged'});
            } else {
                // load the model
                var model = require('../models/' + endpoint.model);
                // if we have parameters, inject them
                var check = "";
                //console.log("endpoint.params", endpoint.params);
                if(endpoint.params) {
                    var i = 1;
                    for (var param in endpoint.params) {
                        var key = req.internalCall ? param : "param" + i;
                        /**
                         * TODO: is required mechanism at param level
                         */

                        // if the parameter exists, prepare it for the model
                        if(key in externalParams) {
                            // if constraint is of type regex
                            if(typeof endpoint.params[param].constraint == "string") {
                                var regEx = new RegExp(endpoint.params[param].constraint, 'gi');
                                if(externalParams[key].match(regEx) == null) {
                                    console.log("---- is null");
                                    check += "Parameter " + param + " is not accepted. ";
                                };
                                // else it is a function
                            } else {
                                if(!endpoint.params[param].constraint(externalParams[key])) {
                                    check += "Parameter " + param + " is not accepted. ";
                                }
                            }
                            params[param] = externalParams[key];
                        } else {
                            console.log("parameter " + param + " does not exist");
                        }

                        i++;
                    }
                }
                if(check !== "") {
                    callback({result: false, msg: check});
                } else {
                    // invoke the endpoint
                    model[dictionary[resource + "_" + method].method](callback, params, req);
                }
            }
        } else {
            callback({result: false, msg: 'resource not found'});
        }
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
        },
        loadResource: loadResource
    };
};
