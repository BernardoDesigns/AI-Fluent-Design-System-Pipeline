#!/bin/bash

# Kill any process on port 3000
lsof -ti :3000 | xargs kill -9 2>/dev/null

# Clear Next.js build cache
rm -rf .next

# Run the dev server in this tab (foreground) so Ctrl+C or closing the tab stops it
echo "Starting dev server on localhost:3000 (Ctrl+C to stop)"
exec npx next dev
