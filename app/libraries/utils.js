module.exports = {
    /**
     * returns a mysql date
     * @returns {string}
     */
    getMysqlDate: function() {
        var date    = new Date();
        var month   = this.getTwoDigits(date.getMonth() + 1);
        var day     = this.getTwoDigits(date.getDate());
        var hour    = this.getTwoDigits(date.getHours());
        var min     = this.getTwoDigits(date.getMinutes());
        var sec     = this.getTwoDigits(date.getSeconds());
        return date.getFullYear() + "-" + month + "-" + day + " " + hour + "-" + min + "-" + sec;
    },
    /**
     * returns a 2 digits string from an integer
     * @param val int
     * @returns {string}
     */
    getTwoDigits: function (val) {
        return val > 9 ? "" + val : "0" + val;
    },
    ucfirst: function(val) {
        if(typeof val == "string") {
            return val.charAt(0).toUpperCase() + val.substr(1);
        } else {
            return val;
        }

    }
}

