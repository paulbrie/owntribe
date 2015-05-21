var fs = require("fs");

function render(req, res) {
    /*var files = fs.readdir("./data/files/", function(err, files){
        if (err) {
            console.log(err);
            return false;
        } else {
            return files;
        }
    });*/

    res.render('files', {
        h1  : "My Files",
        user: req.session.user
    });
}

function download(req, res) {
    req.internalCall = {
        resource: "files",
        method  : "download",
        params: {
            fileid: req.params.id
        }
    };

    req.api.loadResource(req, function(result){
        if (result.result) {
            var file = result.data[0];
            var fileName = file.id + "_" + file.userid + "_" + file.name;
            var fileStream = fs.createReadStream("./data/files/" + fileName);
            fileStream.pipe(res);
        } else {
            res.redirect('/files');
        }
    });
}

function downloadShared(req, res) {
    req.internalCall = {
        resource: "files",
        method  : "downloadShared",
        params: {
            hash: req.params.hash
        }
    };

    req.api.loadResource(req, function(result){
        if (result.result) {
            var file = result.data[0];
            var fileName = file.id + "_" + file.userid + "_" + file.name;
            var fileStream = fs.createReadStream("./data/files/" + fileName);
            res.setHeader('Content-disposition', 'attachment; filename=' + file.name);
            fileStream.pipe(res);
        } else {
            res.redirect('/');
        }
    });
}

module.exports = function(app) {
    return {
        index: function(req, res) {
            if(!req.session.user.logged) {
                res.redirect('/login');
            } else {
                render(req, res);
            }
        },
        download: function(req, res) {
            if(!req.session.user.logged) {
                res.redirect('/login');
            } else {
                download(req, res);
            }
        },
        downloadShared: function(req, res) {
            downloadShared(req, res);
        }
    }
}
