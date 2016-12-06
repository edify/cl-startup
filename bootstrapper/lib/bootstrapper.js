/**
 * Created by diugalde on 30/08/16.
 */


// Imports.
const _ = require('lodash');
const args = require('args');
const bluebird = require('bluebird');
const redis = require('redis');

const accounts = require('../accounts.json');
const config = require('./config');
const clAuthUtils = require('../node_modules/cl-auth-js/lib/utils');
const utils = require('./utils');


// Init redisClient.
bluebird.promisifyAll(redis.RedisClient.prototype);
var redisClient = redis.createClient(config.redis.port, config.redis.host);


// Generate a list of entities that will be saved in redis. Each entity has its friendlyKey, apiKey and secret.
function getBootstrapData(friendlyKeys) {
    let apiKeyId, apiSecretKey;
    return _.map(friendlyKeys, function(friendlyKey) {
        apiKeyId = utils.generateKeyId();
        apiSecretKey = utils.generateSecret();
        return {
            friendlyKey: friendlyKey,
            apiKeyId: apiKeyId,
            apiSecretKey: apiSecretKey
        }
    })
}

// Saves all entities inside bootstrapData list.
function saveBootstrapData(bootstrapData) {
    return Promise.all(_.map(bootstrapData, function(entity) {
        return saveEntity(entity)
    })).then(function(results) {
        printBootstrapResults(results, bootstrapData);
        Promise.resolve(true)
    }).catch(function(err) {
        throw err
    })
}

// Saves entity in redis. Entity: {apiKeyId: {friendlyKey: , apiSecretKey: }}
function saveEntity(entity) {
    return clAuthUtils.encrypt(entity.apiSecretKey, config.passphrase).then(function(encryptedSecret) {
        return redisClient.hmsetAsync(entity.apiKeyId, 'friendlyKey', entity.friendlyKey, 'apiSecretKey', encryptedSecret)
    }).catch(function(err) {
        throw err
    })
}

// Print all the entities that were saved successfully.
function printBootstrapResults(results, bootstrapData) {

    let successfulResults = _.filter(bootstrapData, function(acc, i) {
        return results[i] === 'OK'
    });

    _.map(successfulResults, function(acc) {
        console.log('-------------------------------');
        console.log('Entity was Successfully saved: ');
        console.log(acc)
    });
}

// Starts the bootstrap process.
function bootstrap() {
    let friendlyKeys = accounts;
    let bootstrapData = getBootstrapData(friendlyKeys);
    return saveBootstrapData(bootstrapData).then(function(res) {
        Promise.resolve(res)
    }).catch(function(err) {
       throw err
    });
}

// Remove all keys in redis.
function _removeAllKeys() {
    return redisClient.send_commandAsync('flushall').then(function() {
        console.log('Successfully removed all keys.');
        return Promise.resolve(true);
    }).catch(function(err) {
        console.log('There was an error while trying to flush all keys: ' +  err);
        return Promise.reject(err);
    });
}


function main() {
    args.option('flushall', 'All redis keys will be deleted before saving the bootstrap data');
    const flags = args.parse(process.argv);

    try {
        if(flags.flushall) {
            _removeAllKeys().then(function() {
                bootstrap()
            }).catch(function(err) {
                throw err
            })
        }else {
            bootstrap().then(function() {
                process.exit(0)
            }).catch(function(err) {
                throw err
            })
        }
    } catch(err) {
        console.log(err);
        process.exit(-1)
    }
}

module.exports = {
    main: main
};


