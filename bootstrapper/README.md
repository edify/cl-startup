# cl-auth-bootstrapper

Common Library Authentication Bootstrapper. This cli is used to insert some initial entities to redis. Those entities are like 'accounts' that every client of Common Library must use in order to make requests to any micro service.


Every entity has the following structure:
```javascript
{
    apiKeyId: {
        friendlyKey: 'Human readable string describing the client',
        apiSecretKey: 'Secret string used to sign requests'
    }
}
```
---

## Build and Run

1.  First, you need to install nodejs v6.9.1. You can follow the instructions here [NodeJS](https://nodejs.org).

2.  Install all the dependencies:
```bash
$ curl -u$ARTIFACTORY_USERNAME:$ARTIFACTORY_PASSWORD https://edify.jfrog.io/edify/api/npm/auth > ~/.npmrc
$ echo registry=http://edify.jfrog.io/edify/api/npm/npm-edify >> ~/.npmrc
$ npm install
```

3.  Before executing the main file, you need to make sure that your redis instance is running (check docker-compose).

4.  Export the redis environment variables

```bash
$ export CL_REDIS_HOST=localhost
$ export CL_REDIS_PORT=6379
$ export CL_REDIS_PW=root
```

5.  This script encrypts the apiSecretKey before saving it. You must set an environment variable with the passphrase that will be used in that process.

```bash
$ export CL_AUTH_PASSPHRASE='passphrase'
```

Note: Make sure you use the same passphrase in all the Common Library micro services, because they will have to decrypt the pw.

6.  Execute the script.
```bash
$ chmod +x bin/bootstrapper
$ ./bin/bootstrapper 
```

Note: If the previous script gives you trouble, you can always run the js file directly with `$ nodejs lib/bootstrapper.js`

For more usage options:
```bash
$ ./bin/bootstrapper -h

  Usage: bootstrapper [options] [command]

  Commands:

    help  Display help

  Options:

    -f, --flushall  All redis keys will be deleted before saving the bootstrap data
    -h, --help      Output usage information
    -v, --version   Output the version number
```
