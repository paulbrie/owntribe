var fs = require('fs');
var files = {
    add: function(callback, params, req) {
        console.log("model --------- files")
        console.log(req.files);
        console.log(req.body);
        /**fs.writeFile("./data/files/", "Hey there!", function(err) {
            if(err) {
                return console.log(err);
            }

            console.log("The file was saved!");
        });*/
        try {
            for(var id in req.files["filesselect[]"]) {
                var file = req.files["filesselect[]"][id];
                fs.renameSync(file.path, "./data/files/" + file.originalname);
            }
        } catch (err) {
            console.log(err);
        }

        callback({result: true});
    }
}
module.exports = files;