#!/usr/bin/env bash
set -e

PORT=${1:-8080}

echo "Starting Memory Game at http://localhost:$PORT"
python3 -m http.server "$PORT"
