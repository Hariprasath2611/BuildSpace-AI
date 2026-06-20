#!/bin/bash
set -e

# Disaster Recovery Restore Script for MongoDB

if [ -z "$1" ]; then
  echo "Usage: $0 <timestamp>"
  echo "Example: $0 20260618_120000"
  exit 1
fi

TIMESTAMP=$1
S3_BUCKET="s3://buildspace-backups-prod"
RESTORE_DIR="/tmp/mongo_restore_$TIMESTAMP"

echo "Starting Disaster Recovery Restore for timestamp: $TIMESTAMP"

# Download from S3
aws s3 cp "$S3_BUCKET/mongo/$TIMESTAMP.tar.gz" "/tmp/$TIMESTAMP.tar.gz"

# Extract
mkdir -p "$RESTORE_DIR"
tar -xzf "/tmp/$TIMESTAMP.tar.gz" -C "$RESTORE_DIR"

# Run mongorestore
mongorestore --uri="$MONGODB_URI" --drop "$RESTORE_DIR"

# Cleanup
rm -rf "$RESTORE_DIR"
rm "/tmp/$TIMESTAMP.tar.gz"

echo "Restore completed successfully."
