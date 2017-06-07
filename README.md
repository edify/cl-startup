# cl-startup

Common Library Startup

This repository centralizes the startup process for all the Common Library components. It uses docker-compose to download and execute all the required images (databases, indexer, message broker and micro services).

In order to make this work, you need to install docker and docker-compose. The current versions are 1.12.3 and 1.8.0 respectively.

## Environment

Before running the docker-compose file, you need to set the following environment variables:

```bash
export AWS_ACCESS_KEY=
export AWS_SECRET_KEY=
export AWS_S3_BUCKET_NAME=
export CERT_KEY_STORE_PATH=./ssl-key
export CERT_KEY_STORE_PW=changeit
export CERT_KEY_PW=changeit
export CL_API_CLIENT_ID=
export CL_API_CLIENT_SECRET=
export CL_REDIS_HOST=cl-redis
export CL_REDIS_PORT=6379
export CL_REDIS_PW=root
export CL_AUTH_PASSPHRASE=passphrase
export CL_LO_HTTPS_PORT=443
export CL_LO_HTTP_PORT=80
export CL_MONGO_URI=mongodb://cl-mongodb/cl_dev
export CL_IT_MONGO_URI=mongodb://cl-mongodb/cl_integration_tests
export CL_ES_URL=cl-elasticsearch:9200
export CL_ES_HOST=cl-elasticsearch
export CL_ES_PORT=9300
export CL_RMQ_URL=amqp://cl-rabbitmq
export ORIENTDB_ROOT_PASSWORD=root
export CL_CURRICULA_PORT=8081
export CL_CURRICULA_AUDIT=false
export CL_ODB_NAME=cl-curr-dev
export CL_ODB_HOST=cl-orientdb
export CL_ODB_PORT=2424
export CL_ODB_ROOT_USR=root
export CL_ODB_ROOT_PWD=root
export CL_ODB_USR=cl_orient_user
export CL_ODB_PWD=cl_orient_pwd
export CL_LO_API_ID=
export CL_LO_API_SECRET=
export CL_LO_BASE_URL=http://cl-lo:8080
export CL_LO_API_URL=/api/v1
export CL_CURRICULA_BASE_URL=http://cl-curricula:8081
export CL_CURRICULA_API_URL=/api/v1
export CL_CURRICULA_API_ID=
export CL_CURRICULA_API_SECRET=

export CL_MONGODB_VERSION=3.2.8
export CL_ODB_VERSION=2.2.13
export CL_RMQ_VERSION=3-management
export CL_REDIS_VERSION=3.0
export CL_LO_VERSION=0.0.1
export CL_CURRICULA_VERSION=0.0.1
export CL_INDEX_VERSION=0.0.1
```

Note: The variables ORIENTDB_ROOT_PASSWORD and CL_ODB_ROOT_PWD must have the same value.

### Obtaining API_ID and API_SECRET Credentials.

You can use just one keyId ~ secretKey pair for all the environment variables (CL_CURRICULA_API_ID / CL_CURRICULA_API_SECRET, CL_LO_API_ID / CL_LO_API_SECRET, CL_API_CLIENT_ID / CL_API_CLIENT_SECRET). You can obtain those credentials by running the bootstrapper (requires NodeJS 6.9.1).

1.  First, you should run the redis server where the key-value pairs will be stored:

    ```bash
    $ export CL_REDIS_VERSION=3.0
    $ export CL_REDIS_PW=root
    $ docker-compose up cl-redis
    ```

2. Install bootstrapper dependencies:

    ```bash
    $ cd bootstrapper
    $ export ARTIFACTORY_USERNAME=
    $ export ARTIFACTORY_PASSWORD=
    $ curl -u$ARTIFACTORY_USERNAME:$ARTIFACTORY_PASSWORD https://edify.jfrog.io/edify/api/npm/auth > ./.npmrc
    $ echo registry=http://edify.jfrog.io/edify/api/npm/npm-edify >> ./.npmrc
    $ npm install
    ```

3.  This script encrypts the apiSecretKey before saving it. You must set an environment variable with the passphrase that will be used in that process. This variable must be the same as described in the previous Environment section.

    ```bash
    $ export CL_AUTH_PASSPHRASE=passphrase
    ```

4. You should set the following environment variables for the redis configuration.

    ```bash
    $ export CL_REDIS_HOST=localhost
    $ export CL_REDIS_PORT=6379
    $ export CL_REDIS_PW=root
    ```


5.  Execute the script and copy the printed values.

    ```bash
    $ chmod +x bin/bootstrapper
    $ ./bin/bootstrapper
    ```

6. You can stop the running redis instance with ctrl + c . In the next section you will run all the images together.

Notes:

  -  If you run ./bin/bootstrapper --flushall, it will erase the redis storage first.
  -  Check the accounts.json file to add more accounts.

### Creating a Keystore for SSL

The Content Library LearningObject image comes with a default SSL certificate useful in development scenarios; however, a different valid SSL cert may be required to serve on a public domain.

1. Obtain a certificate, chain, and key from Let's Encrypt (recommended)

2. Generate a .p12 keystore from these, and supply a preferred password when prompted:
  ```
  openssl pkcs12 -export -in fullchain.pem -inkey privkey.pem -out fullchain_and_key.p12
  ```

3. Generate the finished keystore with `keytool`, named `ssl-key` (or whatever you configure as its name with environment variable CERT_KEY_STORE_PATH):
  ```
  keytool -importkeystore -deststorepass [password for destination keystore] -destkeypass [password for destination key] -destkeystore ssl-key -srckeystore fullchain_and_key.p12 -srcstoretype PKCS12 -srcstorepass [password you supplied in the previous step]
  ```
4. Make sure the file is at the location where docker-compose expects it per CERT_KEY_STORE_PATH -- by default, this is the project's root directory.
  ```
  mv ssl-key [/path/to/cl-startup]
  ```

## Run

1.  Login with your artifactory credentials

    ```bash
    $ docker login edify-dkr.jfrog.io
    ```

2.  Execute docker-compose:

    ```bash
    $ docker-compose up
    ```

3.  If you want to check the logs, you can run the following command:

    ```bash
    $ docker-compose up
    docker exec -it cl-lo-container /bin/bash
    tail logs/cl-log.log
    ```


Notes:

-  If you experience problems while downloading or executing the docker images, you could try removing old images and the docker-compose:

    ```bash
    $ docker rmi image-name --force
    $ docker-compose rm
    ```

-  You have to take into account that if you remove the redis image, you will have to start the bootstrapper again.

-  If you are having troubles with the OrientDB authentication in cl-curricula, you should recreate the orientdb image with the proper environment variables (ORIENTDB_ROOT_PASSWORD, CL_ODB_NAME, CL_ODB_HOST, CL_ODB_PORT, CL_ODB_ROOT_USR, CL_ODB_ROOT_PWD, CL_ODB_USR, CL_ODB_PWD)
