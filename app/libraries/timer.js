var timers = {};
module.exports = {
    start: function(name, callback, frequency){
        timers[name] = setInterval(callback, frequency)
    }
}