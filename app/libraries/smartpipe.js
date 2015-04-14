module.exports = function() {
    return {
        /**
         * list of all the steps of the execution smart pipe
         */
        steps: {},
        /**
         * store all the names of the execution steps
         */
        stepsNames: [],
        /**
         * the step to be executed in a sequential mode
         * default is step 0
         */
        currentStep: 0,
        /**
         * adds a new step into the execution smart pipe
         * @param a (expects string or function)
         * @param b (expects function - optional)
         */
        add: function (a, b) {
        if(typeof arguments[0] === 'string' && typeof arguments[1] === 'function') {
            this.stepsNames.push(arguments[0]);
            this.steps[arguments[0]] = {
                fx: arguments[1],
                id: this.stepsNames.length - 1
            };
        } else if(typeof arguments[0] === 'function') {
            for (var item in arguments) {
                var stepName = "_anonymous_" + this.stepsNames.length;
                var fx = arguments[item];
                if(typeof fx === 'function') {
                    var stepName = "_anonymous_" + this.stepsNames.length;
                    this.stepsNames.push(stepName);
                    this.steps[stepName] = {
                        fx: fx,
                        id: this.stepsNames.length - 1
                    };
                } else {
                    throw "Smartpipe Exception: '" + fx + "' parameter is not a function";
                }
            }
        } else {
            throw "Smartpipe Exception: the step '" + stepName + "' does not exist";
        }
        },
        /**
         * triggers next execution step if any
         * if the first parameter is of type string it will attempt to execute the step with
         * this specific name.
         */
        next: function () {
            var fx;
            //console.log("arguments (before)", arguments);
            if (typeof arguments["0"] === 'string') {
                console.log("this.steps", this.steps);
                fx = this.steps[arguments[0]].fx;
                //console.log("fx.fx", fx.fx);
                // pop the function name out of the arguments object
                for (var item in arguments) {
                    if(parseInt(item) > 0) {
                        arguments[parseInt(item) - 1] = arguments[item];
                    }
                }
            } else {
                fx = this.steps[this.stepsNames[this.currentStep]].fx;
            }



            //console.log("arguments (after)", arguments);

            if (this.currentStep < this.stepsNames.length) {
                this.currentStep++;
                fx.apply(null, arguments);
                //delete this.steps[this.stepsNames[executeStep]];
            } else {
                console.log('no more steps, bye!');
            }

            /**    if (this.steps[stepName]) {
                    // take off the function name before passing the arguments

                    this.steps[stepName].fx.apply(null, arguments);
                    this.currentStep = this.steps[stepName].id;
                } else {
                    throw "Smartpipe Exception: the step '" + stepName + "' does not exist";
                }
             } else {*/


        }
    }
};