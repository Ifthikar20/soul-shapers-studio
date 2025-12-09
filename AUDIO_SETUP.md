# Meditation Audio & Video Setup

## Quick Setup

Run this script to copy the media files:

```bash
chmod +x copy-media-files.sh
./copy-media-files.sh
```

## Manual Setup

If you prefer to copy the files manually:

### 1. Copy the Video File

```bash
cp /Users/ifthikaraliseyed/Desktop/soul-shapers-studio/src/assets/Static_Scene_With_Flying_Birds.mp4 ./src/assets/
```

### 2. Copy the Audio File

```bash
cp /Users/ifthikaraliseyed/Desktop/soul-shapers-studio/src/assets/bird-chipping-426107.mp3 ./src/assets/
```

### 3. Test the Experience

1. Start your development server: `npm run dev`
2. Navigate to `/meditate`
3. Click on **any meditation card**
4. You'll be taken to `/meditate/audio/{id}` where:
   - The peaceful bird scene video plays in the background
   - The bird chirping audio plays automatically
   - Volume controls are available
   - Meditation quotes rotate every 30 seconds

## What's Been Configured

✅ **Audio player page** created (`src/pages/MeditateAudioPage.tsx`)
✅ **All meditation cards** now navigate to audio player
✅ **Video background**: Static_Scene_With_Flying_Birds.mp4
✅ **Audio**: bird-chipping-426107.mp3
✅ **Auto-play** enabled for both video and audio
✅ **Cards enlarged** to w-80 (20rem) and h-48 (12rem)
✅ **All meditation experiences** mapped (70+ different meditations)
✅ **Routing** configured at `/meditate/audio/:id`

## Features

- 🎥 Fullscreen video background
- 🔊 Auto-playing meditation audio
- 🎨 Beautiful UI with controls that fade on inactivity
- 📝 Rotating meditation quotes
- 🎚️ Volume controls with mute toggle
- ✨ Smooth animations and transitions
- 📱 Responsive design

## File Locations

- **Audio player**: `src/pages/MeditateAudioPage.tsx`
- **Meditate page**: `src/pages/MeditatePage.tsx`
- **Routing**: `src/App.tsx`
- **Copy script**: `copy-media-files.sh`
