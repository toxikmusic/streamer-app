#!/bin/bash

# Build the client
echo "Building client..."
npm run build

# Make the script executable
chmod +x deploy.sh

# Start the production server
echo "Starting production server..."
NODE_ENV=production node dist/index.js