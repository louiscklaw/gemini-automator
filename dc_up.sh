#!/usr/bin/env bash

set -x

export PROJ_ROOT=`pwd`
export DOCKER_ROOT=$PROJ_ROOT/docker
export DOCKER_IMG_ROOT=$DOCKER_ROOT/images
export DOCKER_VOLUMES=$DOCKER_ROOT/volumes
export SRC_ROOT=$PROJ_ROOT/source

# pushd docker
#   docker compose -f _main.yml  kill 
#   docker compose -f _main.yml  down
#   docker compose -f _main.yml  ps -a
# popd
# exit 1

pushd docker
  docker compose -f _main.yml up -d gemini_agent_1
  docker compose -f _main.yml logs -f
popd

echo "done"
exit 0
