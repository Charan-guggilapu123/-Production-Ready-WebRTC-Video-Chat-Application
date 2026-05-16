#!/bin/bash

# Start Next.js in the background
npm start &

# Wait a moment for Next.js to start
sleep 5

# Start the compiled Socket.IO server in the foreground
node server.js
