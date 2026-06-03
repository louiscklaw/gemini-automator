#!/bin/bash

# Standardized entry point script for Docker environment startup
echo "[$(date +'%Y-%m-%dT%H:%M:%S')] Starting system startup sequence..."

# Ensure we are in the 002_docker directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"
echo "[$(date +'%Y-%m-%dT%H:%M:%S')] Working directory: $(pwd)"

# Call the startup script
if [ -f "./dc_up.sh" ]; then
    echo "[$(date +'%Y-%m-%dT%H:%M:%S')] Executing dc_up.sh..."
    bash ./dc_up.sh
else
    echo "[$(date +'%Y-%m-%dT%H:%M:%S')] ERROR: dc_up.sh not found in $SCRIPT_DIR"
    exit 1
fi

echo "[$(date +'%Y-%m-%dT%H:%M:%S')] System startup sequence completed."
