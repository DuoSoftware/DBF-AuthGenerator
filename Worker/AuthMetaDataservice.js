
const mongoose = require("mongoose");
const messageFormatter = require('dvp-common-lite/CommonMessageGenerator/ClientMessageJsonFormatter.js');
const logger = require('dvp-common-lite/LogHandler/CommonLogHandler.js').logger;
const AuthMetaData = require('dbf-dbmodels/Models/DevPortalAuthCon').AuthMetaData;

//AuthMetaData
module.exports.CreateAuthMetaData = function(req, res){

    logger.debug("DBF-Services.AuthMetaData Internal method ");

    let company = parseInt(req.user.company);
    let tenant = parseInt(req.user.tenant);

    let jsonString;
    let PersistMenu = AuthMetaData(req.body);

    PersistMenu.company = company;
    PersistMenu.tenant = tenant;

    AuthMetaData.save(function (err, _card) {
        if(err)
        {
            jsonString=messageFormatter.FormatMessage(err, "AuthMetaData creation failed", false, undefined);
        }
        else
        {
            jsonString=messageFormatter.FormatMessage(undefined, "AuthMetaData creation succeeded", true, _card);
        }
        res.end(jsonString);
    });

};

module.exports.GetAuthMetaData = function(req, res){

    console.log("DBF-Services.AuthMetaData Internal method ");

    let Schema = mongoose.Schema;
    let ObjectId = Schema.ObjectId;

    let company = parseInt(req.user.company);
    let tenant = parseInt(req.user.tenant);
    let jsonString;

    AuthMetaData.findOne({_id:req.params.iid, company:company,tenant:tenant},function (err, _bot) {
        if(err)
        {
            jsonString=messageFormatter.FormatMessage(err, "AuthMetaData get failed", false, undefined);
        }
        else
        {
            jsonString=messageFormatter.FormatMessage(undefined, "AuthMetaData get succeeded", true, _bot);
        }
        res.end(jsonString);
    });

};


module.exports.GetAuthMetaDataAll = function(req, res){

    logger.info("DBF-Services.AuthMetaData Internal method ");

    console.log(req)

    let company = parseInt(req.user.company);
    let tenant = parseInt(req.user.tenant);
    let jsonString;

    AuthMetaData.find({company:company,tenant:tenant},function (err, _bot) {

        if(err)
        {
            jsonString=messageFormatter.FormatMessage(err, "AuthMetaData get failed", false, undefined);
        }
        else
        {
            jsonString=messageFormatter.FormatMessage(undefined, "AuthMetaData get succeeded", true, _bot);
        }

        console.log(jsonString)

        res(jsonString);
    });

};


module.exports.UpdateAuthMetaData = function(req, res){

    logger.debug("DBF-Services.AuthMetaData Internal method ");


    //console.log(req.user)

    let company = parseInt(req.user.company);
    let tenant = parseInt(req.user.tenant);
    let jsonString;

    let PersistMenu = req.body;
    PersistMenu.company = company;
    PersistMenu.tenant = tenant;

    AuthMetaData.findOneAndUpdate({_id:req.params.iid,company:company,tenant:tenant}, PersistMenu ,function (err, _bot) {
        if(err)
        {
            console.log(err);
            jsonString=messageFormatter.FormatMessage(err, "AuthMetaData update failed", false, undefined);
        }
        else
        {

            jsonString=messageFormatter.FormatMessage(undefined, "AuthMetaData update succeeded", true, _bot);
        }
        res.end(jsonString);
    });


};


module.exports.DeleteAuthMetaData = function(req, res){

    logger.debug("DBF-Services.AuthMetaData Internal method ");

    let company = parseInt(req.user.company);
    let tenant = parseInt(req.user.tenant);
    let jsonString;

    AuthMetaData.findOneAndRemove({_id:req.params.iid,company:company,tenant:tenant},function (err, _app) {
        if(err)
        {
            jsonString=messageFormatter.FormatMessage(err, "AuthMetaData delete failed", false, undefined);
        }
        else
        {
            jsonString=messageFormatter.FormatMessage(undefined, "AuthMetaData delete succeeded", true, _app);
        }
        res.end(jsonString);
    });
};