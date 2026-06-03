#!/usr/bin/env bash

set -ex

# test if vnc can accessed
timeout 120 curl -k https://192.168.11.41:23001

echo "done"
