#!/usr/bin/env bash

set -ex

# npx nodemon --exec "npm run start"
# npx nodemon --exec "node ./server.js"

cd /app/server/_POC
    timeout 120 node helloworld-3.1-flash-liste-extend.js 2>&1 
    timeout 120 node helloworld-3.1-flash-liste-standard.js 2>&1 
    timeout 120 node helloworld-3.1-pro-extend.js 2>&1 
    timeout 120 node helloworld-3.1-pro-standard.js 2>&1 
    timeout 120 node helloworld-3.5-flash-extend.js 2>&1 
    timeout 120 node helloworld-3.5-flash-standard.js 2>&1 
    timeout 120 node helloworld.js 2>&1 
    timeout 120 node helloworld_post_request.js 2>&1 
    timeout 120 node helloworld_q_n_a.js 2>&1 
cd -

echo "done"