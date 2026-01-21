#!/usr/bin/env bash
#
# Run Jekyll server with live reload and JS watch mode

# Trap to kill all background processes when script exits
trap "trap - SIGTERM && kill -- -$$" SIGINT SIGTERM EXIT

# Start Jekyll server in background
echo "Starting Jekyll server..."
./tools/run.sh &

# Start JS watch mode
echo "Starting JS watch mode..."
npm run watch:js

# Wait for all background processes
wait
