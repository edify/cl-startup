/*
 * Copyright 2016 Edify Software Consulting.
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * A copy of the License is located at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


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
