var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: global.tribeSettings.emailProviders.gmail.login,
        pass: global.tribeSettings.emailProviders.gmail.password
    }
});

// send mail with defined transport object
function send(mailOptions, callback){
    console.log(".....", mailOptions);
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log(error);
            callback({result:false, msg:error});
        }else{
            console.log('Message sent: ' + info.response);
            callback({result:true, data: info});
        }
    });
}

module.exports.send = send;
