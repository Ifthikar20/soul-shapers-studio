# Frontend Video Streaming Architecture

## Table of Contents
- [Overview](#overview)
- [Video Playback Flow](#video-playback-flow)
- [HLS Streaming Implementation](#hls-streaming-implementation)
- [Backend API Integration](#backend-api-integration)
- [Authentication & Security](#authentication--security)
- [Error Handling & Fallbacks](#error-handling--fallbacks)
- [Quality Selection](#quality-selection)
- [Analytics Tracking](#analytics-tracking)
- [Key Files](#key-files)

---

## Overview

The Soul Shapers Studio frontend uses **HLS (HTTP Live Streaming)** to deliver video content. The architecture is built with:

- **Video Player**: Custom HLS video player component with controls
- **HLS.js Library**: For browsers without native HLS support
- **Multiple Services**: Content service, video service, analytics service
- **Fallback Mechanisms**: Multiple endpoint attempts with graceful degradation
- **Cookie-Based Auth**: Secure authentication with httpOnly cookies

### Technology Stack
- **Streaming Protocol**: HLS (HTTP Live Streaming)
- **Player Library**: HLS.js v1.x
- **Video Element**: HTML5 `<video>` with custom controls
- **HTTP Client**: Axios with interceptors
- **State Management**: React hooks

---

## Video Playback Flow

### Step-by-Step Process

```
1. User navigates to /watch/:id
   ↓
2. WatchPage component loads
   ↓
3. Fetch video metadata (contentService.getVideoByUUID)
   → GET /content/detail/{uuid}
   ↓
4. Fetch streaming URL (contentService.getVideoStreamData)
   → Try multiple endpoints:
     - GET /api/streaming/content/{uuid}/stream
     - GET /content/{uuid}/stream
     - GET /api/videos/{uuid}/stream
     - Fallback: Use video_url from metadata
   ↓
5. Initialize HLS player with stream URL
   ↓
6. Load HLS manifest (.m3u8)
   ↓
7. Stream video segments (.ts files)
   ↓
8. Track analytics (view, progress, completion)
```

### Component Hierarchy

```
WatchPage.tsx
├── State: video, streamUrl, loading, error
├── fetchVideo() - Loads video metadata and stream
├── trackVideoView() - Logs analytics
│
└── HLSVideoPlayer.tsx
    ├── Video element with ref
    ├── HLS.js instance
    ├── Custom controls (play, pause, seek, volume, fullscreen)
    └── Error handling
```

---

## HLS Streaming Implementation

### HLS.js Initialization

Location: `src/components/VideoModal/HLSVideoPlayer.tsx:108-134`

```typescript
if (Hls.isSupported()) {
  const hls = new Hls({
    debug: false,
    enableWorker: true,           // Use Web Workers for performance
    lowLatencyMode: true,          // Reduce latency
    backBufferLength: 90,          // Keep 90s of buffer
    xhrSetup: (xhr) => {
      xhr.withCredentials = false; // CloudFront doesn't need credentials
    }
  });

  hls.loadSource(streamUrl);       // Load HLS manifest
  hls.attachMedia(videoElement);   // Attach to <video>

  hls.on(Hls.Events.MANIFEST_PARSED, () => {
    console.log('✅ HLS manifest loaded');
    if (autoPlay) video.play();
  });
}
```

### Browser Compatibility

| Browser | Implementation |
|---------|---------------|
| Chrome, Firefox, Edge | HLS.js library |
| Safari (iOS/macOS) | Native HLS support (`video.canPlayType('application/vnd.apple.mpegurl')`) |
| Unsupported browsers | Shows error message |

**Native HLS Support (Safari)**:
```typescript
if (video.canPlayType('application/vnd.apple.mpegurl')) {
  video.src = streamUrl;  // Direct assignment, no HLS.js needed
  video.play();
}
```

### HLS Manifest Structure

```
stream.m3u8 (Master Playlist)
├── 1080p/stream.m3u8 (Variant Playlist)
│   ├── segment0.ts
│   ├── segment1.ts
│   └── segment2.ts
├── 720p/stream.m3u8
└── 480p/stream.m3u8
```

---

## Backend API Integration

### 1. Fetch Video Metadata

**File**: `src/services/content.service.ts:110-132`

```typescript
async getVideoByUUID(uuid: string): Promise<Video> {
  const response = await this.api.get(`/content/detail/${uuid}`);
  return normalizeVideo(response.data);
}
```

**Endpoint**: `GET /content/detail/{uuid}`

**Response**:
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "title": "Meditation Basics",
  "description": "Learn the fundamentals...",
  "expert_name": "Dr. Jane Smith",
  "category_name": "Meditation",
  "duration_seconds": 1800,
  "access_tier": "free",
  "thumbnail_url": "https://cdn.example.com/thumb.jpg",
  "video_url": "https://d1234.cloudfront.net/videos/stream.m3u8"
}
```

### 2. Fetch Streaming URL

**File**: `src/services/content.service.ts:157-234`

```typescript
async getVideoStreamData(uuid: string): Promise<{
  streamUrl: string;
  qualities: string[];
  thumbnailUrl?: string;
}> {
  // Try multiple streaming endpoints
  const endpoints = [
    `/api/streaming/content/${uuid}/stream`,
    `/content/${uuid}/stream`,
    `/api/videos/${uuid}/stream`,
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await this.api.get(endpoint);
      const streamUrl =
        response.data.streaming_urls?.['720p'] ||
        response.data.hls_playlist_url ||
        response.data.stream_url ||
        response.data.video_url;

      if (streamUrl) return { streamUrl, qualities: ['auto'] };
    } catch (error) {
      // Try next endpoint
    }
  }

  // Fallback: Get video_url from metadata
  const video = await this.getVideoByUUID(uuid);
  return {
    streamUrl: video.videoUrl,
    qualities: ['auto'],
    thumbnailUrl: video.thumbnail
  };
}
```

**Primary Endpoint**: `GET /api/streaming/content/{uuid}/stream`

**Response**:
```json
{
  "hls_playlist_url": "https://d1234.cloudfront.net/videos/master.m3u8",
  "streaming_urls": {
    "1080p": "https://d1234.cloudfront.net/1080p/stream.m3u8",
    "720p": "https://d1234.cloudfront.net/720p/stream.m3u8",
    "480p": "https://d1234.cloudfront.net/480p/stream.m3u8"
  },
  "available_qualities": ["1080p", "720p", "480p", "auto"],
  "thumbnail_url": "https://cdn.example.com/thumb.jpg"
}
```

### 3. Track Analytics

**File**: `src/pages/WatchPage.tsx:124-161`

```typescript
await analyticsService.trackView({
  content_id: videoData.id,
  video_title: videoData.title,
  category: videoData.category,
  expert: videoData.expert,
  duration_seconds: videoData.duration_seconds,
  session_id: sessionStorage.getItem('sessionId')
});
```

---

## Authentication & Security

### Cookie-Based Authentication

**Cookies Set by Backend**:
- `access_token` (httpOnly) - Main auth token
- `refresh_token` (httpOnly) - Token renewal
- `csrf_token` - CSRF protection

### Request Flow with Auth

```typescript
// src/services/content.service.ts:40-44
const api = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: true,  // ← Sends cookies automatically
  timeout: 10000
});
```

**Headers Added by Interceptor** (`api.security.ts`):
```http
Authorization: Bearer {access_token}
X-CSRF-Token: {csrf_token}
X-Request-ID: {unique-id}
```

### Access Control

**Free vs Premium Content**:
```typescript
// Check video access tier
if (video.access_tier === 'premium') {
  // Requires active subscription
  // Backend returns 403 if user doesn't have access
}
```

**Error Responses**:
- `401 Unauthorized` → Redirect to login
- `403 Forbidden` → Show upgrade prompt
- `404 Not Found` → Video doesn't exist

---

## Error Handling & Fallbacks

### Multi-Endpoint Fallback Strategy

**File**: `src/services/content.service.ts:165-199`

The system tries multiple endpoints in order:

1. **Primary**: `/api/streaming/content/{uuid}/stream` (dedicated streaming service)
2. **Secondary**: `/content/{uuid}/stream` (content service with streaming)
3. **Tertiary**: `/api/videos/{uuid}/stream` (video service)
4. **Fallback**: Use `video_url` from video metadata directly

```typescript
// Fallback mechanism
for (const endpoint of streamingEndpoints) {
  try {
    const response = await api.get(endpoint);
    if (response.data.streamUrl) return response.data;
  } catch (error) {
    // Don't try other endpoints on auth errors
    if (error.response?.status === 401 || error.response?.status === 403) {
      throw error;
    }
    continue; // Try next endpoint
  }
}

// Last resort: Use direct video_url
const video = await getVideoByUUID(uuid);
return { streamUrl: video.video_url };
```

### HLS.js Error Recovery

**File**: `src/components/VideoModal/HLSVideoPlayer.tsx:136-172`

```typescript
hls.on(Hls.Events.ERROR, (event, data) => {
  if (data.fatal) {
    switch (data.type) {
      case Hls.ErrorTypes.NETWORK_ERROR:
        console.error('Network error, attempting recovery...');
        hls.startLoad(); // Retry loading
        break;

      case Hls.ErrorTypes.MEDIA_ERROR:
        console.error('Media error, attempting recovery...');
        hls.recoverMediaError(); // Try to recover
        break;

      default:
        console.error('Fatal error, cannot recover');
        hls.destroy();
        setError('Video playback failed');
    }
  }
});
```

### CORS Error Detection

**File**: `src/components/VideoModal/HLSVideoPlayer.tsx:87-105`

```typescript
// Test CORS before streaming
const testCORS = async () => {
  try {
    const response = await fetch(streamUrl, { mode: 'cors' });
    const corsHeader = response.headers.get('access-control-allow-origin');
    console.log('✅ CORS Header:', corsHeader);
  } catch (err) {
    console.error('❌ CORS test failed:', err);
  }
};
```

**Required CORS Headers on CloudFront/CDN**:
```http
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, HEAD
Access-Control-Allow-Headers: Range
```

### Error UI States

| State | UI Display |
|-------|-----------|
| Loading | Spinner + "Loading video..." |
| No stream URL | Error icon + "No stream available" |
| Network error | Error box + "Network error" + Retry button |
| Auth error (401) | Redirect to login |
| Premium content (403) | "Upgrade required" prompt |
| Fatal error | Error box + "Back to Browse" button |

---

## Quality Selection

### Available Qualities

Typical HLS quality ladder:
- **1080p**: 1920x1080, ~5 Mbps
- **720p**: 1280x720, ~2.5 Mbps  ← Default
- **480p**: 854x480, ~1 Mbps
- **360p**: 640x360, ~500 Kbps
- **Auto**: Adaptive bitrate (HLS.js decides)

### Quality Switching

**File**: `src/components/VideoPlayer.tsx:218-222`

```typescript
const handleQualityChange = (quality: string) => {
  setCurrentQuality(quality);
  // Re-fetch streaming URL with new quality
  loadStreamingUrl(contentId, quality);
};
```

**UI Component**:
```tsx
<select onChange={(e) => handleQualityChange(e.target.value)}>
  <option value="auto">Auto</option>
  <option value="1080p">1080p</option>
  <option value="720p">720p</option>
  <option value="480p">480p</option>
</select>
```

### Adaptive Bitrate Streaming (ABR)

When quality is set to "Auto", HLS.js monitors:
- **Network bandwidth** (download speed)
- **Buffer health** (how much video is buffered)
- **Dropped frames** (playback performance)

HLS.js automatically switches between quality levels to maintain smooth playback.

---

## Analytics Tracking

### Events Tracked

**File**: `src/pages/WatchPage.tsx:124-161`

| Event | Trigger | Data Sent |
|-------|---------|-----------|
| **View** | Video starts loading | content_id, title, category, expert, session_id |
| **Progress** | Every 10 seconds | content_id, current_time, duration |
| **Complete** | Video ends (95%+) | content_id, completion_time, total_watch_time |
| **Pause** | User pauses | content_id, pause_time |
| **Seek** | User skips | content_id, from_position, to_position |
| **Error** | Playback error | content_id, error_code, error_message |

### View Tracking

```typescript
// Tracked once when video loads
await analyticsService.trackView({
  content_id: video.id,
  video_title: video.title,
  category: video.category,
  expert: video.expert,
  duration_seconds: video.duration_seconds,
  session_id: crypto.randomUUID()
});
```

**Endpoint**: `POST /api/videos/{videoId}/analytics`

### Progress Tracking (Gamification)

```typescript
// Track for user badges and progress
await progressService.trackActivity({
  activityType: 'video_watched',
  contentId: video.id,
  contentTitle: video.title,
  durationMinutes: Math.round(video.duration_seconds / 60)
});
```

This contributes to:
- User's total watch time
- Videos completed count
- Category-specific progress
- Badge achievements

---

## Key Files

### Core Components

| File | Purpose | Lines of Code |
|------|---------|---------------|
| `src/pages/WatchPage.tsx` | Main video page component | 567 |
| `src/components/VideoModal/HLSVideoPlayer.tsx` | Custom HLS player with controls | 575 |
| `src/components/VideoPlayer.tsx` | Alternative HLS player (backend integration) | 337 |

### Services

| File | Purpose | Key Methods |
|------|---------|-------------|
| `src/services/content.service.ts` | Video metadata and streaming URLs | `getVideoByUUID()`, `getVideoStreamData()` |
| `src/services/video.service.ts` | Secure video streaming | `getSecureStreamUrl()`, `trackVideoEvent()` |
| `src/services/analytics.service.ts` | Event tracking | `trackView()`, `trackProgress()` |
| `src/services/streamingService.ts` | Streaming API client | `getStreamingUrl()`, `getContentMetadata()` |

### Utilities

| File | Purpose |
|------|---------|
| `src/utils/api.security.ts` | Request/response interceptors, auth headers |
| `src/utils/api.encryption.ts` | Payload encryption for sensitive data |
| `src/utils/auth.security.ts` | Cookie management, CSRF tokens |
| `src/types/video.types.ts` | TypeScript interfaces for Video, StreamData |

---

## Performance Optimizations

### 1. **HLS.js Configuration**
```typescript
{
  enableWorker: true,        // Offload parsing to Web Worker
  lowLatencyMode: true,      // Reduce buffering delay
  backBufferLength: 90,      // Keep 90s of watched content
}
```

### 2. **Lazy Loading**
- Video player only loads when navigating to `/watch/:id`
- HLS.js library is code-split (separate chunk)

### 3. **Preloading**
```typescript
<link rel="preconnect" href="https://d1234.cloudfront.net">
```

### 4. **CDN Caching**
- Video segments cached at CloudFront edge locations
- Manifests have short TTL (10-60 seconds)
- Video segments have long TTL (1 year)

### 5. **Adaptive Bitrate**
- Automatically adjusts quality based on network
- Prevents buffering on slow connections
- Maximizes quality on fast connections

---

## Debugging

### Browser Console Logs

The video player outputs detailed logs:

```
🎬 WatchPage - Fetching Video
📍 Video ID: 123e4567-e89b-12d3-a456-426614174000
🌐 API URL: http://localhost:8000
📥 Step 1: Fetching video metadata...
✅ Video metadata loaded: { id, title, accessTier }
📥 Step 2: Fetching stream data...
✅ Stream data loaded: { streamUrl: 'Present', qualities: [...] }
🎬 Initializing HLS Player
✅ HLS.js is supported
✅ HLS Manifest loaded successfully
✅ Video view tracked: Meditation Basics
```

### Development Tools

**Access in Browser Console**:
```javascript
// Test backend connectivity
contentService.debugBackendHealth()

// Check available videos
contentService.getVideosForFrontend()

// Check specific video
contentService.getVideoByUUID('uuid-here')
```

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| Black screen | CORS error | Add CORS headers to CloudFront |
| Infinite loading | 404 on manifest | Check stream URL is valid |
| "Upgrade required" | Premium content | User needs subscription |
| Choppy playback | Low bandwidth | Lower quality or enable ABR |
| No sound | Browser autoplay policy | User must interact first |

---

## Future Enhancements

### Planned Features
1. **Picture-in-Picture (PiP)** - Watch while browsing
2. **Chromecast Support** - Cast to TV
3. **Download for Offline** - Premium feature
4. **Chapters/Timestamps** - Skip to sections
5. **Subtitles/Captions** - WebVTT support
6. **Watch Party** - Synchronized viewing
7. **Resume Playback** - Continue from last position

### Advanced Features
- **DRM Protection**: Widevine/FairPlay for premium content
- **Server-Side Ad Insertion (SSAI)**: Pre-roll/mid-roll ads
- **AI-Generated Thumbnails**: Smart preview images
- **Quality Recommendations**: ML-based initial quality selection

---

## Summary

The Soul Shapers Studio video streaming architecture is a **robust, production-ready system** that:

✅ Uses industry-standard **HLS streaming** for broad compatibility
✅ Implements **multiple fallback mechanisms** for reliability
✅ Securely authenticates users with **cookie-based auth**
✅ Tracks detailed **analytics** for user engagement
✅ Handles **errors gracefully** with user-friendly messages
✅ Supports **adaptive bitrate streaming** for optimal quality
✅ Uses **HLS.js** for browsers without native HLS support
✅ Integrates with **CloudFront CDN** for global delivery

The architecture balances **performance**, **security**, and **user experience** while remaining maintainable and scalable.
