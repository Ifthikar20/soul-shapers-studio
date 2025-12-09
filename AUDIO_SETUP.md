# Audio File Setup Instructions

## Adding the Firewood Audio File

To enable audio playback on the meditation page, please follow these steps:

### 1. Copy the Audio File

Copy your audio file to the assets directory:
```bash
cp /Users/ifthikaraliseyed/Desktop/soul-shapers-studio/src/assets/firewood-burning-sound-179862.mp3 ./src/assets/
```

### 2. Update the MeditateAudioPage Component

Once the audio file is in place, uncomment the import line in `/src/pages/MeditateAudioPage.tsx`:

```typescript
// Change this line:
// import firewoodAudio from '@/assets/firewood-burning-sound-179862.mp3';

// To this:
import firewoodAudio from '@/assets/firewood-burning-sound-179862.mp3';
```

And uncomment the audioUrl in the meditation experience:

```typescript
// Change this:
// audioUrl: firewoodAudio,

// To this:
audioUrl: firewoodAudio,
```

### 3. Test the Audio

1. Navigate to the meditate page: `/meditate`
2. Click on any meditation card
3. The audio should auto-play in the background along with the video

### Current Status

✅ Audio player page created
✅ Routing configured for `/meditate/audio/:id`
✅ Cards updated to navigate to audio player
✅ Cards made bigger (w-80, h-48)
⏳ Audio file needs to be added to assets folder

### File Locations

- Audio player component: `src/pages/MeditateAudioPage.tsx`
- Meditate page: `src/pages/MeditatePage.tsx`
- Routing: `src/App.tsx`
