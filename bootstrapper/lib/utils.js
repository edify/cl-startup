/**
 * Created by diugalde on 30/08/16.
 */

const crypto = require('crypto');
const denodeify = require('denodeify');
const uuid = require('node-uuid');

const config = require('./config');


/**
 * Generates a key id (20 length)
 *
 * @returns unique identifier.
 * @private
 */
function generateKeyId() {
    let keyId = crypto.createHash('md5')
                .update(uuid.v4());
    return keyId.digest('hex')
}

/**
 * Generates a secret key (40 length).
 *
 * @returns secret key
 * @private
 */
function generateSecret() {
    let secret = crypto.createHash('sha256')
                .update(uuid.v4())
                .update(crypto.randomBytes(128))
                .digest('hex');
    return secret.substring(0, 40)
}


module.exports = {
    generateSecret: generateSecret,
    generateKeyId: generateKeyId
};
