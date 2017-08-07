#!/bin/bash

TEMP_DIR=`mktemp -d`

GIT_HASH='HEAD' # `git rev-parse HEAD`
BUILD_TIME=`date +'%y%m%d%H%M%S'`
RELEASE_NAME=$GIT_HASH-$BUILD_TIME

tar -czf dots.tar.gz *
