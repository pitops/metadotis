#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

npm install
cd ${DIR}/client

npm install

cd -
