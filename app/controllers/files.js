var fs = require("fs");
function render(req, res) {

    var files = fs.readdirSync("./data/files/");
    console.log(files);

    res.render('files', {
        h1  : "My Files",
        user: req.session.user,
        files: files
    });
}

function download(req, res) {
    console.log(req);
    req.internalCall = {
        resource: "files",
        method  : "download",
        params: {
            fileid: req.params.id
        }
    }
    req.api.loadResource(req, function(result){
        var file = result.data[0];
        var fileName = file.id + "_" + file.userid + "_" + file.name;
        var fileStream = fs.createReadStream("./data/files/" + fileName);
        fileStream.pipe(res);
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
        }
    }
}
