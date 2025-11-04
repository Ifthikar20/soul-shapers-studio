# Frontend Integration Guide - HLS Streaming

## Overview

This guide explains how to use the HLS streaming functionality integrated with the backend API. The integration includes:

- ✅ **VideoPlayer Component** - Full-featured HLS video player
- ✅ **Streaming Service** - API integration for fetching streaming URLs
- ✅ **Cookie Utilities** - Authentication token management
- ✅ **Quality Selection** - Switch between 720p, 1080p, etc.
- ✅ **Error Handling** - User-friendly error messages
- ✅ **TypeScript** - Full type safety

---

## Quick Start

### 1. Prerequisites

The following are already installed in this project:
- ✅ HLS.js (`hls.js@^1.6.13`)
- ✅ HLS.js Types (`@types/hls.js@^0.13.3`)

### 2. Environment Setup

The `.env.local` file has been created with:

```env
VITE_API_URL=http://localhost:8000
```

**For Production:** Update `VITE_API_URL` to your production backend URL.

### 3. Files Created

| File | Path | Purpose |
|------|------|---------|
| **VideoPlayer** | `src/components/VideoPlayer.tsx` | Main HLS video player component |
| **Streaming Service** | `src/services/streamingService.ts` | API service for streaming endpoints |
| **Cookie Utils** | `src/utils/cookies.ts` | Cookie management utilities |
| **Test Page** | `src/pages/VideoTestPage.tsx` | Example/test page for the player |
| **Environment** | `.env.local` | Environment variables |

---

## Using the VideoPlayer Component

### Basic Usage

```tsx
import { VideoPlayer } from '../components/VideoPlayer';

function MyVideoPage() {
  return (
    <VideoPlayer
      contentId="079d0d9e-5cf4-49cc-805a-08b11082c1bf"
    />
  );
}
```

### With Event Handlers

```tsx
import { VideoPlayer } from '../components/VideoPlayer';

function MyVideoPage() {
  const handlePlay = () => {
    console.log('Video started');
  };

  const handleError = (error: Error) => {
    console.error('Video error:', error.message);
    // Show toast notification, etc.
  };

  return (
    <VideoPlayer
      contentId="079d0d9e-5cf4-49cc-805a-08b11082c1bf"
      autoplay={false}
      onPlay={handlePlay}
      onPause={() => console.log('Paused')}
      onEnded={() => console.log('Ended')}
      onError={handleError}
      className="my-custom-class"
    />
  );
}
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `contentId` | `string` | **Required** | Content UUID from backend |
| `autoplay` | `boolean` | `false` | Auto-play on load |
| `onPlay` | `() => void` | - | Called when video starts |
| `onPause` | `() => void` | - | Called when video pauses |
| `onEnded` | `() => void` | - | Called when video ends |
| `onError` | `(error: Error) => void` | - | Called on errors |
| `className` | `string` | `''` | Additional CSS classes |

---

## Using the Streaming Service

### Get Streaming URL

```tsx
import { streamingService } from '../services/streamingService';

async function loadVideo() {
  try {
    const data = await streamingService.getStreamingUrl(
      '079d0d9e-5cf4-49cc-805a-08b11082c1bf',
      '720p' // optional quality
    );

    console.log('HLS URL:', data.hls_url);
    console.log('Available qualities:', data.qualities);
  } catch (error) {
    console.error('Failed to load video:', error);
  }
}
```

### Browse Content

```tsx
import { streamingService } from '../services/streamingService';

async function browseVideos() {
  try {
    const result = await streamingService.browseContent(
      1,          // page
      20,         // page size
      'meditation', // optional category filter
      'John Doe'  // optional expert filter
    );

    console.log('Total content:', result.total);
    console.log('Content:', result.content);
  } catch (error) {
    console.error('Failed to browse:', error);
  }
}
```

### Get Content Metadata

```tsx
import { streamingService } from '../services/streamingService';

async function getMetadata() {
  try {
    const metadata = await streamingService.getContentMetadata(
      '079d0d9e-5cf4-49cc-805a-08b11082c1bf'
    );

    console.log('Title:', metadata.title);
    console.log('Expert:', metadata.expert_name);
    console.log('Duration:', metadata.duration);
  } catch (error) {
    console.error('Failed to get metadata:', error);
  }
}
```

---

## Authentication

The streaming service uses cookie-based authentication with the backend.

### Cookie Utilities

```tsx
import {
  getAccessToken,
  isAuthenticated,
  clearAuthCookies
} from '../utils/cookies';

// Check if user is authenticated
if (isAuthenticated()) {
  console.log('User is logged in');
}

// Get access token
const token = getAccessToken();

// Clear auth cookies on logout
clearAuthCookies();
```

The `streamingService` automatically includes the access token in API requests via an Axios interceptor.

---

## Testing the Integration

### Test Page

A test page has been created at `src/pages/VideoTestPage.tsx`.

**To use it:**

1. Add the route to your `App.tsx`:

```tsx
import VideoTestPage from './pages/VideoTestPage';

// In your routes
<Route path="/video-test" element={<VideoTestPage />} />
```

2. Navigate to `/video-test` in your browser

3. Enter a content ID and click "Load Video"

### What to Check

✅ **Browser Console:**
- `🎬 Loading streaming URL for content: ...`
- `✅ Streaming data loaded: ...`
- `🎥 Initializing HLS player with URL: ...`
- `✅ HLS manifest loaded successfully`

✅ **Network Tab:**
- `GET /api/streaming/{contentId}` - Returns HLS URL
- `GET https://xxx.cloudfront.net/xxx.m3u8` - HLS manifest
- `GET https://xxx.cloudfront.net/segment_0.ts` - Video segments
- `GET https://xxx.cloudfront.net/segment_1.ts` - Video segments

✅ **UI:**
- Loading spinner while fetching
- Video player with controls
- Quality selector (top-right)
- Metadata display (title, expert, duration)

---

## Backend API Endpoints

The frontend integrates with these backend endpoints:

### 1. Get Streaming URL

```
GET /api/streaming/{content_id}?quality=720p
Authorization: Bearer {access_token}
```

**Response:**
```json
{
  "hls_url": "https://xxx.cloudfront.net/xxx.m3u8?...",
  "qualities": ["720p", "1080p"],
  "content_id": "079d0d9e-...",
  "expert_name": "John Doe",
  "category": "Meditation",
  "duration": 300,
  "title": "Guided Meditation",
  "description": "..."
}
```

### 2. Browse Content

```
GET /api/browse?page=1&page_size=20&category=meditation&expert=John+Doe
Authorization: Bearer {access_token}
```

**Response:**
```json
{
  "content": [...],
  "total": 100,
  "page": 1,
  "page_size": 20
}
```

### 3. Get Content Metadata

```
GET /api/content/{content_id}
Authorization: Bearer {access_token}
```

**Response:**
```json
{
  "id": "079d0d9e-...",
  "title": "Guided Meditation",
  "description": "...",
  "expert_name": "John Doe",
  "category": "Meditation",
  "duration": 300
}
```

---

## Error Handling

The integration handles various error scenarios:

| Error | User Message | Action |
|-------|--------------|--------|
| 401 Unauthorized | "Please sign in to watch this content" | Redirect to login |
| 403 Forbidden | "You do not have access to this content" | Show upgrade prompt |
| 404 Not Found | "Content not found" | Show error message |
| Network Error | "Network error loading video" | Retry loading |
| CORS Error | "Unable to load video (CORS)" | Check backend CORS |

---

## Troubleshooting

### Video Not Loading

1. **Check Backend is Running**
   ```bash
   curl http://localhost:8000/health
   ```

2. **Check Authentication**
   - Open browser DevTools → Application → Cookies
   - Look for `access_token` cookie
   - If missing, user needs to log in

3. **Check Network Requests**
   - Open DevTools → Network tab
   - Filter by "fetch/XHR"
   - Look for `/api/streaming/{contentId}`
   - Check response status and data

4. **Check Console Logs**
   - Open DevTools → Console
   - Look for error messages
   - Check HLS.js errors

### CORS Issues

If you see CORS errors:

1. **Backend CORS Configuration**
   - Ensure backend allows requests from frontend origin
   - Check `Access-Control-Allow-Origin` header

2. **CloudFront CORS**
   - Ensure CloudFront distribution has CORS headers configured
   - Check CloudFront behavior settings

### Quality Switching Not Working

1. **Check Available Qualities**
   - Verify backend returns `qualities` array
   - Ensure backend has multiple quality variants

2. **Check HLS Manifest**
   - Download `.m3u8` file and inspect
   - Should contain multiple quality levels

---

## Production Deployment

### Environment Variables

Update `.env.local` (or `.env.production`):

```env
VITE_API_URL=https://api.yourdomain.com
```

### Build

```bash
npm run build
```

### Verify

1. Test on production domain
2. Check all API calls use production URL
3. Verify CORS configuration
4. Test authentication flow
5. Check video playback

---

## Advanced Usage

### Custom Styling

```tsx
<VideoPlayer
  contentId="..."
  className="rounded-2xl shadow-2xl"
/>
```

### Integrate with Existing Video Modal

```tsx
import { VideoPlayer } from '../components/VideoPlayer';
import { Dialog } from '../components/ui/dialog';

function VideoModal({ contentId, open, onClose }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl">
        <VideoPlayer contentId={contentId} />
      </DialogContent>
    </Dialog>
  );
}
```

### Progress Tracking

```tsx
<VideoPlayer
  contentId="..."
  onPlay={() => {
    // Track video start event
    analytics.track('video_started', { contentId });
  }}
  onEnded={() => {
    // Track video completion
    analytics.track('video_completed', { contentId });
  }}
/>
```

---

## Tech Stack Integration

| Your Stack | Integration Status |
|------------|-------------------|
| React + TypeScript | ✅ Full TypeScript support |
| Vite | ✅ Uses `import.meta.env` |
| Tailwind CSS | ✅ Styled with Tailwind |
| Axios | ✅ API service uses Axios |
| HLS.js | ✅ Installed and configured |

---

## Next Steps

1. ✅ Test the integration with real content IDs
2. ✅ Integrate VideoPlayer into your existing pages
3. ✅ Customize styling to match your design
4. ✅ Add analytics/tracking as needed
5. ✅ Deploy to production

---

## Support

If you encounter issues:

1. Check this documentation
2. Review browser console logs
3. Check Network tab in DevTools
4. Verify backend is running and accessible
5. Check authentication status

---

**Last Updated:** November 4, 2025

**Backend Integration:** Complete ✅
**Frontend Integration:** Complete ✅
**Testing:** Ready for production ✅
