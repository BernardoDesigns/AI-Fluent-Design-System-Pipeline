#!/bin/bash

# Kill any process on port 3000
lsof -ti :3000 | xargs kill -9 2>/dev/null

# Clear Next.js build cache
rm -rf .next

# Start dev server in background
npx next dev &

echo "Server restarting on localhost:3000"
