#!/usr/bin/env bash
cd $(dirname "$0")

set -x

# NOTE: safe to assume docker compose is available
# NOTE: safe to assume Ensure external networks exist


# /home/logic/_workspace/task-list/servers/logic-NUC8i5BEH/gemini-automator-tryout-ws/master/002_docker/volumes/browser_data_dir
export DOCKER_HOME=/home/logic/_workspace/task-list/servers/logic-NUC8i5BEH/gemini-automator-tryout-ws/master/002_docker

# NOTE: clear log
echo "" > dc_up.log

# Start the container
# timeout 120 sudo docker compose -f _main.yml build | tee -a dc_up.log
timeout 120 sudo docker compose -f _main.yml kill | tee -a dc_up.log
timeout 120 sudo docker compose -f _main.yml down | tee -a dc_up.log
timeout 120 sudo docker compose -f _main.yml up -d | tee -a dc_up.log

# Wait for container to initialize
sleep 5

# Show recent startup logs
sudo docker compose -f _main.yml logs --tail=100 gemini_agent_1 | tee -a dc_up.log

echo "done"
exit 0
