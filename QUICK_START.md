# Quick Start - HLS Video Streaming Integration

## ✅ What Was Done

The frontend has been fully integrated with the HLS streaming backend. Here's what was added:

### Files Created

1. **`src/components/VideoPlayer.tsx`** - Full-featured HLS video player
2. **`src/services/streamingService.ts`** - Backend API integration service
3. **`src/utils/cookies.ts`** - Cookie management utilities
4. **`src/pages/VideoTestPage.tsx`** - Test/demo page
5. **`.env.local`** - Environment variables
6. **`FRONTEND_INTEGRATION.md`** - Complete documentation

### Files Modified

- **`src/App.tsx`** - Added `/video-test` route

---

## 🚀 How to Use

### 1. Start the Backend

Make sure your backend server is running:

```bash
# In your backend directory
uvicorn app.main:app --reload --port 8000
```

### 2. Start the Frontend

```bash
# In soul-shapers-studio directory
npm install
npm run dev
```

### 3. Test the Integration

1. **Log in** to your account (required for streaming)
2. Navigate to **`/video-test`** in your browser
3. You should see the video test page
4. The default content ID is: `079d0d9e-5cf4-49cc-805a-08b11082c1bf`
5. Click **"Load Video"** to test streaming

---

## 📺 Using VideoPlayer in Your Pages

### Basic Example

```tsx
import { VideoPlayer } from '../components/VideoPlayer';

function MyPage() {
  return (
    <div className="container mx-auto p-8">
      <VideoPlayer contentId="079d0d9e-5cf4-49cc-805a-08b11082c1bf" />
    </div>
  );
}
```

### With Callbacks

```tsx
<VideoPlayer
  contentId="079d0d9e-5cf4-49cc-805a-08b11082c1bf"
  autoplay={false}
  onPlay={() => console.log('Playing')}
  onPause={() => console.log('Paused')}
  onEnded={() => console.log('Ended')}
  onError={(error) => console.error('Error:', error)}
/>
```

---

## 🔍 What to Look For

### Browser Console

When the video loads, you should see:

```
🎬 Loading streaming URL for content: 079d0d9e-...
✅ Streaming data loaded: {...}
🎥 Initializing HLS player with URL: https://...
✅ HLS manifest loaded successfully
```

### Network Tab

Open DevTools → Network tab and look for:

1. **`GET /api/streaming/{contentId}`** - Fetches HLS URL from backend
2. **`GET https://xxx.cloudfront.net/xxx.m3u8`** - HLS manifest file
3. **`GET https://xxx.cloudfront.net/segment_0.ts`** - Video segments
4. **`GET https://xxx.cloudfront.net/segment_1.ts`** - Video segments

### Features

- ✅ **Video Playback** - HLS streaming with quality selection
- ✅ **Quality Selector** - Switch between 720p, 1080p (top-right button)
- ✅ **Loading States** - Spinner while loading
- ✅ **Error Handling** - User-friendly error messages
- ✅ **Metadata Display** - Title, expert, category, duration
- ✅ **Secure Streaming** - CloudFront signed URLs with authentication

---

## 🛠️ Troubleshooting

### Video Not Loading?

1. **Check Backend is Running**
   ```bash
   curl http://localhost:8000/health
   ```

2. **Check Authentication**
   - Open DevTools → Application → Cookies
   - Look for `access_token` cookie
   - If missing, log in again

3. **Check Console for Errors**
   - Open DevTools → Console
   - Look for red error messages
   - Check what endpoint failed

### CORS Errors?

- Ensure backend CORS allows your frontend origin
- Check backend CORS configuration

### 403 Forbidden?

- User doesn't have access to this content
- Check user subscription tier
- Check content permissions

---

## 📁 File Structure

```
soul-shapers-studio/
├── src/
│   ├── components/
│   │   └── VideoPlayer.tsx           ← Main video player component
│   ├── services/
│   │   └── streamingService.ts       ← API service
│   ├── utils/
│   │   └── cookies.ts                ← Cookie utilities
│   ├── pages/
│   │   └── VideoTestPage.tsx         ← Test page
│   └── App.tsx                       ← Updated with /video-test route
├── .env.local                        ← Environment variables
├── FRONTEND_INTEGRATION.md           ← Full documentation
└── QUICK_START.md                    ← This file
```

---

## 🔗 API Endpoints

The VideoPlayer uses these backend endpoints:

| Endpoint | Purpose |
|----------|---------|
| `GET /api/streaming/{contentId}` | Get HLS streaming URL |
| `GET /api/browse` | Browse available content |
| `GET /api/content/{contentId}` | Get content metadata |

All endpoints require authentication via `access_token` cookie.

---

## 🎯 Next Steps

1. ✅ **Test** - Try the `/video-test` page
2. ✅ **Integrate** - Add `<VideoPlayer>` to your existing pages
3. ✅ **Customize** - Style the player to match your design
4. ✅ **Deploy** - Update `VITE_API_URL` for production

---

## 📚 Full Documentation

For complete documentation, see:
- **`FRONTEND_INTEGRATION.md`** - Detailed integration guide
- **`src/components/VideoPlayer.tsx`** - Component source code (with comments)
- **`src/services/streamingService.ts`** - Service source code (with comments)

---

## ✨ Features

| Feature | Status |
|---------|--------|
| HLS Streaming | ✅ Working |
| Quality Selection | ✅ 720p, 1080p |
| Authentication | ✅ Cookie-based |
| Error Handling | ✅ User-friendly |
| Loading States | ✅ Spinner |
| Metadata Display | ✅ Title, expert, etc. |
| Safari Support | ✅ Native HLS |
| Chrome/Firefox | ✅ HLS.js |
| TypeScript | ✅ Full support |
| Tailwind CSS | ✅ Styled |

---

**Ready to stream! 🎬**

Navigate to `/video-test` and start watching!
