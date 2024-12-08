#!/bin/bash

# Exit on any error
set -e

# Configuration
BUCKET="s3://justacouplequestions.com"
BUILD_DIR="build"

# Check if build directory exists
if [ ! -d "$BUILD_DIR" ]; then
    echo "Error: Build directory not found!"
    exit 1
fi

echo "Deploying to $BUCKET..."

# Sync build directory to S3 bucket
# --delete removes files in the bucket that aren't in the local build
# --cache-control sets caching headers for better performance
aws s3 sync $BUILD_DIR $BUCKET \
    --delete \
    --cache-control "max-age=31536000" \
    --exclude "*.html" \
    --exclude "*.js.map"

# Upload HTML files and service worker with no-cache
aws s3 sync $BUILD_DIR $BUCKET \
    --exclude "*" \
    --include "*.html" \
    --cache-control "no-cache" \
    --exclude "*.js.map"

echo "Deployment complete!" 