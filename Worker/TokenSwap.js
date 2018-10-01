/**
 * Created by vmkde on 6/5/2018.
 */

const AuthMetaDataService = require('./AuthMetaDataservice');
const request = require('request');
const jwkToPem = require('jwk-to-pem');
const jwt = require('jsonwebtoken');
const messageFormatter = require('dvp-common-lite/CommonMessageGenerator/ClientMessageJsonFormatter.js');
const logger = require('dvp-common-lite/LogHandler/CommonLogHandler.js').logger;
const config = require('config');
const validator = require('validator');

var Client = require('node-rest-client').Client;


module.exports.getNewToken = function(req, res){

    let client = new Client();

    logger.debug("DBF-Services.getNewToken Internal method ");

    let companyName = req.body.companyName;
    let token = req.headers.federated_token;
    let scope = req.body.scope;
    let Console = req.body.console;
    let clientID = req.body.clientID;



    let url = `${config.Services.userServiceProtocol}://${config.Services.userServiceHost}/DVP/API/v1/Organisation/Id/1/${companyName}`;

    if (validator.isIP(config.Services.userServiceHost))
        url = `${config.Services.userServiceProtocol}://${config.Services.userServiceHost}:${config.Services.userServicePort}` + `/DBF/API/${config.Services.userServiceVersion}/UserByEmail/${response.email}`;

    let args = {
        headers: {
            "Content-Type": "application/json"
        }
    };

    client.get(url, args, (found, response) => {

        //let responseFromUserService = data;

        let responseFromUserService = JSON.parse(found.toString('utf8'));

        console.log(responseFromUserService.Result.id);

        let company = parseInt(responseFromUserService.Result.id);
        let tenant = 1;

        let data =  {
            "user" : {
                "company" : company,
                "tenant" : tenant
            }
        };

        AuthMetaDataService.GetAuthMetaDataAll(data, function (response) {


            //console.log(JSON.parse(response).Result[0]);
            if(JSON.parse(response).Result.length !== 0){
                let AuthMetaData = JSON.parse(response).Result[0];
                let jsonString;

                switch(AuthMetaData.authType) {
                    case 'cognito':
                        ValidateToken(token,AuthMetaData.config.cognito, function(response){

                            //console.log(response);

                            if(response){
                                let url = `${config.Services.botServiceProtocol}://${config.Services.botServiceHost}/DBF/API/${config.Services.botServiceVersion}/UserByEmail/${response.email}`;

                                if (validator.isIP(config.Services.botServiceHost))
                                    url = `${config.Services.botServiceProtocol}://${config.Services.botServiceHost}:${config.Services.botServicePort}` + `/DBF/API/${config.Services.botServiceVersion}/UserByEmail/${response.email}`;

                                let authtoken = config.Services.accessToken;
                                let args = {
                                    headers: {
                                        "Content-Type": "application/json",
                                        "authorization": "Bearer " + authtoken,
                                        "companyInfo": `${tenant}:${company}`
                                    }
                                };



                                client.get(url, args, (data, response) => {


                                    console.log(data.toString('utf8'));
                                    let dataConverted = JSON.parse(data.toString('utf8'));
                                    console.log(dataConverted);

                                    if((dataConverted.IsSuccess === true  && dataConverted.Result !== null)){

                                        /*console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
                                        console.log(dataConverted);
                                        console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');*/

                                        let url = `${config.Services.userServiceProtocol}://${config.Services.userServiceHost}/auth/fedarate/login`;

                                        if (validator.isIP(config.Services.userServiceHost))
                                            url = `${config.Services.userServiceProtocol}://${config.Services.userServiceHost}:${config.Services.botServicePort}` + `/auth/fedarate/login`;

                                        let authtoken = config.Services.accessToken;
                                        let args = {
                                            headers: {
                                                "Content-Type": "application/json"
                                            },
                                            data :{
                                                "userName": dataConverted.email,
                                                "scope": scope,
                                                "console": Console,
                                                "tenant": tenant,
                                                "companyId": company,
                                                "companyName": companyName,
                                                "clientID": clientID,
                                                "userScopes": [
                                                    {
                                                        "resource": "myNavigation",
                                                        "actions": [
                                                            "read"
                                                        ]
                                                    },
                                                    {
                                                        "resource": "myUserProfile",
                                                        "actions": [
                                                            "read"
                                                        ]
                                                    },
                                                    {
                                                        "resource": "wallet",
                                                        "actions": [
                                                            "read",
                                                            "write",
                                                            "delete"
                                                        ]
                                                    },
                                                    {
                                                        "resource": "sipuser",
                                                        "actions": [
                                                            "read",
                                                            "write",
                                                            "delete"
                                                        ]
                                                    },
                                                    {
                                                        "resource": "attribute",
                                                        "actions": [
                                                            "read",
                                                            "write",
                                                            "delete"
                                                        ]
                                                    },
                                                    {
                                                        "resource": "group",
                                                        "actions": [
                                                            "read",
                                                            "write",
                                                            "delete"
                                                        ]
                                                    },
                                                    {
                                                        "resource": "resourcetaskattribute",
                                                        "actions": [
                                                            "read",
                                                            "write",
                                                            "delete"
                                                        ]
                                                    },
                                                    {
                                                        "resource": "task",
                                                        "actions": [
                                                            "read",
                                                            "write",
                                                            "delete"
                                                        ]
                                                    },
                                                    {
                                                        "resource": "productivity",
                                                        "actions": [
                                                            "read",
                                                            "write",
                                                            "delete"
                                                        ]
                                                    },
                                                    {
                                                        "resource": "Shared",
                                                        "actions": [
                                                            "read",
                                                            "write",
                                                            "delete"
                                                        ]
                                                    },
                                                    {
                                                        "resource": "taskinfo",
                                                        "actions": [
                                                            "read",
                                                            "write",
                                                            "delete"
                                                        ]
                                                    },
                                                    {
                                                        "resource": "ardsresource",
                                                        "actions": [
                                                            "read",
                                                            "write",
                                                            "delete"
                                                        ]
                                                    },
                                                    {
                                                        "resource": "ardsrequest",
                                                        "actions": [
                                                            "read",
                                                            "write",
                                                            "delete"
                                                        ]
                                                    },
                                                    {
                                                        "resource": "requestmeta",
                                                        "actions": [
                                                            "read",
                                                            "write",
                                                            "delete"
                                                        ]
                                                    },
                                                    {
                                                        "resource": "queue",
                                                        "actions": [
                                                            "read",
                                                            "write",
                                                            "delete"
                                                        ]
                                                    },
                                                    {
                                                        "resource": "requestserver",
                                                        "actions": [
                                                            "read",
                                                            "write",
                                                            "delete"
                                                        ]
                                                    },
                                                    {
                                                        "resource": "user",
                                                        "actions": [
                                                            "read",
                                                            "write",
                                                            "delete"
                                                        ]
                                                    },
                                                    {
                                                        "resource": "userProfile",
                                                        "actions": [
                                                            "read",
                                                            "write",
                                                            "delete"
                                                        ]
                                                    },
                                                    {
                                                        "resource": "organisation",
                                                        "actions": [
                                                            "read",
                                                            "write"
                                                        ]
                                                    },
                                                    {
                                                        "resource": "resource",
                                                        "actions": [
                                                            "read"
                                                        ]
                                                    },
                                                    {
                                                        "resource": "package",
                                                        "actions": [
                                                            "read"
                                                        ]
                                                    },
                                                    {
                                                        "resource": "console",
                                                        "actions": [
                                                            "read"
                                                        ]
                                                    },
                                                    {
                                                        "resource": "userScope",
                                                        "actions": [
                                                            "read",
                                                            "write",
                                                            "delete"
                                                        ]
                                                    },
                                                    {
                                                        "resource": "userAppScope",
                                                        "actions": [
                                                            "read",
                                                            "write",
                                                            "delete"
                                                        ]
                                                    },
                                                    {
                                                        "resource": "userMeta",
                                                        "actions": [
                                                            "read",
                                                            "write",
                                                            "delete"
                                                        ]
                                                    },
                                                    {
                                                        "resource": "userAppMeta",
                                                        "actions": [
                                                            "read",
                                                            "write",
                                                            "delete"
                                                        ]
                                                    },
                                                    {
                                                        "resource": "client",
                                                        "actions": [
                                                            "read",
                                                            "write",
                                                            "delete"
                                                        ]
                                                    },
                                                    {
                                                        "resource": "clientScope",
                                                        "actions": [
                                                            "read",
                                                            "write",
                                                            "delete"
                                                        ]
                                                    }
                                                ]
                                            }

                                        };


                                        client.post(url, args, (data, response) => {

                                            jsonString=messageFormatter.FormatMessage(undefined, "Valid Session", true, data);
                                            res.end(jsonString)


                                        });



                                    }
                                    else{
                                        jsonString=messageFormatter.FormatMessage("Error", "User does not exist, please contact your Administrator", false, undefined);
                                        res.end(jsonString)
                                    }




                                });
                            }
                            else{
                                jsonString=messageFormatter.FormatMessage("Error", "Invalid Session", false, undefined);
                                res.end(jsonString)
                            }




                        } );
                        break;

                    default:
                        jsonString=messageFormatter.FormatMessage(err, "getNewToken failed", false, undefined);
                        res.end(jsonString)
                }
            }
            else{
                let jsonString;
                jsonString=messageFormatter.FormatMessage(err, "getNewToken failed", false, undefined);
                res.end(jsonString);
            }






        })

    });





};


function ValidateToken(token, config, res) {
    request({
        url: `https://cognito-idp.${config.poolRegion}.amazonaws.com/${config.userPoolId}/.well-known/jwks.json`,
        json: true
    }, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            pems = {};
            let keys = body['keys'];
            for(let i = 0; i < keys.length; i++) {
                //Convert each key to PEM
                let key_id = keys[i].kid;
                let modulus = keys[i].n;
                let exponent = keys[i].e;
                let key_type = keys[i].kty;
                let jwk = { kty: key_type, n: modulus, e: exponent};
                let pem = jwkToPem(jwk);
                pems[key_id] = pem;
            }
            //validate the token
            let decodedJwt = jwt.decode(token, {complete: true});
            if (!decodedJwt) {
                console.log("Not a valid JWT token");
                res(false);
            }

            let kid = decodedJwt.header.kid;
            let pem = pems[kid];
            if (!pem) {
                console.log('Invalid token');
                res(false);
            }

            jwt.verify(token, pem, function(err, payload) {
                if(err) {
                    console.log("Invalid Token.");
                    res(false);
                } else {
                    console.log("Valid Token.");
                    res(payload);
                }
            });
        } else {
            console.log("Error! Unable to download JWKs");
            res(false);
        }
    });
}


