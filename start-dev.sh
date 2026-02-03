#!/bin/bash

# Script to start the development environment for Realtime Elo Ranker
# Usage: ./start-dev.sh [--simulate]

set -e

SIMULATE=false
if [[ "$1" == "--simulate" ]]; then
  SIMULATE=true
fi

echo "Starting Realtime Elo Ranker development environment..."

# Build libs/ui
echo "Building libs/ui..."
pnpm run libs:ui:build

# Start server and client in parallel
if [ "$SIMULATE" = true ]; then
  echo "Starting server with simulator..."
  pnpm run apps:server:dev:simulate &
  SERVER_PID=$!
else
  echo "Starting server..."
  pnpm run apps:server:dev &
  SERVER_PID=$!
fi

# Give server time to start
sleep 3

# Start client
echo "Starting client..."
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080 pnpm run apps:client:dev &
CLIENT_PID=$!

# Wait for both processes
wait $SERVER_PID $CLIENT_PID
