#!/usr/bin/env bash

set -ex

# npx nodemon --exec "npm run start"
# npx nodemon --exec "node ./server.js"

echo "" > dc_test.log

sudo docker compose -f /workspace/feature/jsonc-selectors/002_docker/_main.yml exec -it -u 1000:1000 gemini_agent_1 \
    sh -c /app/server/test.sh 2>&1 | tee -a dc_test.log
# sudo docker compose -f master/002_docker/_main.yml exec -it  gemini_agent_1 sh -c /app/server/test.sh

echo "done"
