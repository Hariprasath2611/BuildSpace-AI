#!/bin/bash
set -e

# MongoDB Backup Script
# Requires mongodump and aws-cli installed

TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="/tmp/mongo_backup_$TIMESTAMP"
S3_BUCKET="s3://buildspace-backups-prod"

echo "Starting MongoDB Backup at $TIMESTAMP"

# Create temp dir
mkdir -p $BACKUP_DIR

# Run mongodump
mongodump --uri="$MONGODB_URI" --out="$BACKUP_DIR"

# Compress backup
tar -czf "$BACKUP_DIR.tar.gz" -C "$BACKUP_DIR" .

# Upload to S3
aws s3 cp "$BACKUP_DIR.tar.gz" "$S3_BUCKET/mongo/$TIMESTAMP.tar.gz"

# Cleanup
rm -rf "$BACKUP_DIR"
rm "$BACKUP_DIR.tar.gz"

echo "Backup completed and uploaded to $S3_BUCKET/mongo/$TIMESTAMP.tar.gz"
