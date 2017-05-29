# cl-startup

Common Library Startup

This repository centralizes the startup process for all the Common Library components. It uses docker-compose to download and execute all the required images (databases, indexer, message broker and micro services).

In order to make this work, you need to install docker and docker-compose. The current versions are 1.12.3 and 1.8.0 respectively.

## Environment

Before running the docker-compose file, you need to set the following environment variables:

```bash
export AWS_ACCESS_KEY=
export AWS_SECRET_KEY=
export AWS_S3_BUCKET_NAME=cl-develop
export CERT_KEY_STORE_PATH=./ssl-key
export CERT_KEY_STORE_PW=changeit
export CERT_KEY_PW=changeit
export CL_REDIS_HOST=cl-redis
export CL_REDIS_PORT=6379
export CL_REDIS_PW=root
export CL_AUTH_PASSPHRASE=passphrase
export CL_LO_HTTPS_PORT=8043
export CL_LO_HTTP_PORT=8080
export CL_MONGO_URI=mongodb://cl-mongodb/cl_dev
export CL_IT_MONGO_URI=mongodb://cl-mongodb/cl_integration_tests
export CL_ES_URL=cl-elasticsearch:9200
export CL_ES_HOST=cl-elasticsearch
export CL_ES_PORT=9300
export CL_RMQ_URL=amqp://cl-rabbitmq
export ORIENTDB_ROOT_PASSWORD=
export CL_CURRICULA_PORT=8081
export CL_CURRICULA_AUDIT=true
export CL_ODB_NAME=cl-curr-dev
export CL_ODB_HOST=cl-orientdb
export CL_ODB_PORT=2424
export CL_ODB_ROOT_USR=root
export CL_ODB_ROOT_PWD=
export CL_ODB_USR=cl_orient_user
export CL_ODB_PWD=
export CL_LO_API_ID=
export CL_LO_API_SECRET=
export CL_LO_BASE_URL=http://cl-lo:8080
export CL_LO_API_URL=/api/v1
export CL_MONGODB_VERSION=3.2.8
export CL_ODB_VERSION=2.2.13
export CL_RMQ_VERSION=3-management
export CL_REDIS_VERSION=3.0
export CL_LO_VERSION=0.0.1
export CL_CURRICULA_VERSION=0.0.1
export CL_INDEX_VERSION=0.0.1
```

### Obtaining CL_LO_API Credentias

You can get the CL_LO_API_ID and CL_LO_API_SECRET by running the bootstrapper (requires NodeJS 6.9.1). 

1.  First, you should run the redis server where the key-value pairs will be stored:

```bash
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


## Run

1.  Login with your artifactory credentials

```bash
$ docker login edify-dkr.jfrog.io

```

2.  Execute docker-compose:

```bash
$ docker-compose up

```

Note: If you experience problems while downloading or executing the docker images, you could try removing old images and the docker-compose:

```bash
$ docker rmi image
$ docker-compose rm

```