/**
 * Created by diugalde on 02/09/16.
 */

// Config object
const config = {
    redis: {
    	host: (process.env.CLB_REDIS_HOST || 'localhost'),
        port: (process.env.CLB_REDIS_PORT || 6379)
    },
    passphrase: (process.env.CL_AUTH_PASSPHRASE || '')
};

module.exports = config;
