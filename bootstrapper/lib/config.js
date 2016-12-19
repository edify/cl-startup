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
 * Created by diugalde on 02/09/16.
 */

// Config object
const config = {
    redis: {
    	host: (process.env.CLB_REDIS_HOST || 'localhost'),
        port: (process.env.CLB_REDIS_PORT || 6379)
    },
    passphrase: (process.env.CL_AUTH_PASSPHRASE || 'passphrase')
};

module.exports = config;
