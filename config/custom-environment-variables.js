module.exports = {

    "Mongo":
    {
        "ip":"SYS_MONGO_HOST",
        "port":"SYS_MONGO_PORT",
        "dbname":"SYS_MONGO_DB",
        "password":"SYS_MONGO_PASSWORD",
        "user":"SYS_MONGO_USER",
        "replicaset" :"SYS_MONGO_REPLICASETNAME",
        "cloudAtlas": "SYS_MONGO_CLOUDATLAS"
    },


    "Host":
    {
        "vdomain": "LB_FRONTEND",
        "domain": "HOST_NAME",
        "port": "HOST_PORT",
        "version": "HOST_VERSION",
        "HashKey":"HOST_HASHKEY"
    },

    "Services" : {
        "accessToken":"GLOBAL_TOKEN",

        "botServiceProtocol": "BOT_SERVICE_PROTOCOL",
        "botServiceHost": "BOT_SERVICE_HOST",
        "platformServiceHost": "PLATFORM_SERVICE_HOST",

        "userServiceProtocol": "USER_SERVICE_PROTOCOL",
        "userServiceHost": "USER_SERVICE_HOST",
    }


};

//NODE_CONFIG_DIR
