#!/bin/bash
# init_env.sh , 
# usage : ./init_env.sh param, param can be test/development/production
# make sure chmod 755 this file to be able to run
if [ -f ".env" ]; then
    . .env
    if [ -z $MONGODB_URL ]; then echo "MONGODB_URL is unset " && exit 1; fi
    if [ -z $HOST ]; then echo "HOST is unset" && exit 1; fi
    if [ -z $PORT ]; then echo "PORT is unset" && exit 1; fi
    export HOST=$HOST

    if [ "development" == "$1" ];then
        export NODE_ENV=development
        export MONGODB_URL=$MONGODB_URL
        export PORT=$PORT
        nodemon app.js
    elif [ "test" == "$1" ]; then
        export NODE_ENV=test
        if [ -z $PORT_TEST ]; then
            export PORT=$PORT
        else
            export PORT=$PORT_TEST
        fi
        if [ -z $MONGODB_URL_TEST ]; then
            export MONGODB_URL=$MONGODB_URL
        else
            export MONGODB_URL=$MONGODB_URL_TEST
        fi
        node --experimental-vm-modules node_modules/jest/bin/jest.js --coverage
    elif [ "production" == "$1" ]; then
        echo "setup the prodution case env in init_env" 
    else
        echo "missing NODE_ENV in .env"
    fi
else
    printf '%s\n' \
        "missing .env file"\
        "Example for .env file:"\
        "**********************"\
        "MONGODB_URL=mongodb://localhost/foo"\
        "HOST=localhost"\
        "PORT=8626"\
        "MONGODB_URL_TEST=mongodb://localhost/foo_test (optional for testing)"\
        "PORT_TEST=8626 (optional for testing)"
fi




