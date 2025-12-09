#!/bin/bash

# Script to copy meditation audio and video files to the assets folder

echo "🐦 Copying meditation media files to assets..."

SOURCE_DIR="/Users/ifthikaraliseyed/Desktop/soul-shapers-studio/src/assets"
DEST_DIR="./src/assets"

# Create destination directory if it doesn't exist
mkdir -p "$DEST_DIR"

# Copy the bird scene video
if [ -f "$SOURCE_DIR/Static_Scene_With_Flying_Birds.mp4" ]; then
    echo "✓ Copying Static_Scene_With_Flying_Birds.mp4..."
    cp "$SOURCE_DIR/Static_Scene_With_Flying_Birds.mp4" "$DEST_DIR/"
    echo "✓ Video file copied successfully!"
else
    echo "✗ Warning: Static_Scene_With_Flying_Birds.mp4 not found at $SOURCE_DIR"
fi

# Copy the bird chirping audio
if [ -f "$SOURCE_DIR/bird-chipping-426107.mp3" ]; then
    echo "✓ Copying bird-chipping-426107.mp3..."
    cp "$SOURCE_DIR/bird-chipping-426107.mp3" "$DEST_DIR/"
    echo "✓ Audio file copied successfully!"
else
    echo "✗ Warning: bird-chipping-426107.mp3 not found at $SOURCE_DIR"
fi

echo ""
echo "📁 Files in assets directory:"
ls -lh "$DEST_DIR"/*.mp4 "$DEST_DIR"/*.mp3 2>/dev/null || echo "No media files found"

echo ""
echo "✅ Done! Your meditation page is ready to use."
echo "🔗 Navigate to /meditate and click any card to test the audio player."
