#!/bin/bash

# Script to copy meditation audio and video files to the assets folder

echo "🔥 Copying meditation media files to assets..."

SOURCE_DIR="/Users/ifthikaraliseyed/Desktop/soul-shapers-studio/src/assets"
DEST_DIR="./src/assets"

# Create destination directory if it doesn't exist
mkdir -p "$DEST_DIR"

# Copy the burning fire video
if [ -f "$SOURCE_DIR/burning_fire.mp4" ]; then
    echo "✓ Copying burning_fire.mp4..."
    cp "$SOURCE_DIR/burning_fire.mp4" "$DEST_DIR/"
    echo "✓ Video file copied successfully!"
else
    echo "✗ Warning: burning_fire.mp4 not found at $SOURCE_DIR"
fi

# Copy the firewood audio
if [ -f "$SOURCE_DIR/firewood-burning-sound-179862.mp3" ]; then
    echo "✓ Copying firewood-burning-sound-179862.mp3..."
    cp "$SOURCE_DIR/firewood-burning-sound-179862.mp3" "$DEST_DIR/"
    echo "✓ Audio file copied successfully!"
else
    echo "✗ Warning: firewood-burning-sound-179862.mp3 not found at $SOURCE_DIR"
fi

echo ""
echo "📁 Files in assets directory:"
ls -lh "$DEST_DIR"/*.mp4 "$DEST_DIR"/*.mp3 2>/dev/null || echo "No media files found"

echo ""
echo "✅ Done! Your meditation page is ready to use."
echo "🔗 Navigate to /meditate and click any card to test the audio player."
