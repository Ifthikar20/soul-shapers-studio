# Streaming Endpoint Fix - UUID Integration

## Issue Summary

The audio streaming functionality was returning 404 errors due to:
1. ❌ Incorrect endpoint path: `/api/audio/streaming/{id}`
2. ❌ Wrong ID format: Expected UUID but was using integer IDs

## Solution

### Updated Endpoint
**Old (Incorrect):**
```
/api/audio/streaming/1
```

**New (Correct):**
```
/api/streaming/content/{UUID}/stream
```

### Changes Made

#### 1. Frontend Service Update
**File:** `src/services/audio.service.ts`

**Change:** Updated line 80 to use the correct endpoint:
```typescript
// Before:
const response = await this.api.get<AudioStreamingUrlResponse>(
  `/api/audio/streaming/${contentId}`
);

// After:
const response = await this.api.get<AudioStreamingUrlResponse>(
  `/api/streaming/content/${contentId}/stream`
);
```

#### 2. Database UUID Script
**File:** `get_content_uuids.py`

Created a Python script to retrieve valid content UUIDs from the database:
```bash
python3 get_content_uuids.py
```

This script will:
- Connect to your PostgreSQL database
- List all content with their UUIDs
- Show audio content with proper streaming URLs
- Display in a formatted table

## Usage

### 1. Get Valid Content UUIDs

Run the script to find UUIDs:
```bash
python3 get_content_uuids.py
```

Or query directly:
```sql
SELECT id, title, content_type FROM content WHERE content_type = 'audio';
```

### 2. Frontend Usage

The frontend now automatically uses UUIDs when accessing content:

```typescript
import { audioStreamingService } from './services/audio.service';

// Use UUID format (e.g., from URL params or API)
const contentUuid = '0b8df95c-4a61-4446-b3a9-431091477455';

// Get streaming URL
const streamData = await audioStreamingService.getAudioStreamingUrl(contentUuid);
```

### 3. URL Structure

Access audio content via:
```
http://localhost:3000/audio/{UUID}
```

Example:
```
http://localhost:3000/audio/0b8df95c-4a61-4446-b3a9-431091477455
```

## API Requirements

### Authentication
All streaming requests require JWT authentication:
```typescript
headers: {
  'Authorization': `Bearer ${jwtToken}`
}
```

### Response Format
```typescript
interface AudioStreamingUrlResponse {
  hls_url: string;          // HLS playlist URL (.m3u8)
  content_id: string;       // UUID of the content
  expert_name?: string;     // Expert/creator name
  category?: string;        // Content category
  duration?: number;        // Duration in seconds
  title?: string;           // Content title
  description?: string;     // Content description
  thumbnail_url?: string;   // Thumbnail image URL
}
```

## Testing

### 1. Using curl
```bash
curl -X GET "http://localhost:8000/api/streaming/content/{YOUR-UUID}/stream" \
  -H "Authorization: Bearer YOUR-JWT-TOKEN"
```

### 2. Browser Testing
1. Get a valid UUID using `get_content_uuids.py`
2. Navigate to: `http://localhost:3000/audio/{UUID}`
3. Check browser console for streaming logs
4. Check Network tab for HLS manifest (.m3u8) and segments

### 3. Expected Behavior
- ✅ Returns HLS streaming URL with metadata
- ✅ Supports authentication
- ✅ Returns 401 if not authenticated
- ✅ Returns 403 if access denied
- ✅ Returns 404 if content not found

## Error Messages

Updated error messages for better debugging:

| Status | Error Message |
|--------|---------------|
| 401 | "Please sign in to listen to this audio" |
| 403 | "You do not have access to this audio content" |
| 404 | "Audio content not found. Ensure you are using a valid UUID." |
| Other | Error details from backend |

## Database Setup

Ensure your database has content with UUIDs:

```sql
-- Check content structure
SELECT id, title, content_type, access_tier
FROM content
WHERE content_type = 'audio'
LIMIT 5;
```

If IDs are integers, you may need to:
1. Add a UUID column
2. Generate UUIDs for existing content
3. Update backend to use UUID-based routing

## Environment Variables

For the UUID script:
```bash
DB_HOST=localhost
DB_PORT=5432
DB_NAME=soul_shapers
DB_USER=postgres
DB_PASSWORD=your_password
```

## Troubleshooting

### Issue: "Audio content not found"
- ✅ Verify you're using a valid UUID (not an integer)
- ✅ Check the UUID exists in the database
- ✅ Ensure the content_type is 'audio'

### Issue: 401 Unauthorized
- ✅ Check JWT token is present in localStorage
- ✅ Verify token hasn't expired
- ✅ Ensure token is included in Authorization header

### Issue: 404 Not Found (Wrong endpoint)
- ✅ Verify endpoint is `/api/streaming/content/{UUID}/stream`
- ✅ Not `/api/audio/streaming/{id}`

### Issue: CORS errors
- ✅ Backend should allow requests from frontend origin
- ✅ Check `withCredentials` setting in axios config

## Files Modified

### Phase 1: Fix Streaming Endpoint
1. `src/services/audio.service.ts` - Updated streaming endpoint
2. `get_content_uuids.py` - New utility script
3. `STREAMING_ENDPOINT_FIX.md` - This documentation

### Phase 2: Fix UUID Navigation
4. `src/pages/SingleAudioPage.tsx` - Added UUID validation with helpful error UI
5. `src/components/Audio/AudioCard.tsx` - Updated interface to use string UUIDs
6. `src/components/Audio/AudioRow.tsx` - Updated interface to use string UUIDs

### Phase 3: Integrate Real Backend Data
7. `src/services/content.service.ts` - Added getAudioContent() and getAudioByUUID()
8. `src/pages/AudioBrowsePage.tsx` - New page for browsing real audio content
9. `src/App.tsx` - Updated routing to use AudioBrowsePage

## Related Components

These components use the updated streaming service:
- `src/pages/SingleAudioPage.tsx` - Main audio playback page with UUID validation
- `src/pages/AudioBrowsePage.tsx` - Browse real audio content from backend
- `src/components/StreamingAudioPlayer.tsx` - HLS audio player component
- `src/components/HLSAudioPlayer.tsx` - Alternative player implementation
- `src/components/Audio/AudioCard.tsx` - Audio card component
- `src/components/Audio/AudioRow.tsx` - Audio row component

## Complete Solution

### The Problem
1. ❌ Frontend used mock data with integer IDs (1, 2, 3, etc.)
2. ❌ Links navigated to `/audio/5` instead of `/audio/{UUID}`
3. ❌ Audio service expected `/api/streaming/content/{UUID}/stream`
4. ❌ Result: All audio playback failed with 404 errors

### The Fix
1. ✅ Updated audio.service.ts to use correct endpoint path
2. ✅ Added UUID validation in SingleAudioPage with helpful error messages
3. ✅ Created AudioBrowsePage to fetch real content from backend
4. ✅ Added getAudioContent() to contentService
5. ✅ Updated routing so /audio shows real backend data

### New Data Flow
```
User visits /audio
    ↓
AudioBrowsePage loads
    ↓
Fetches from: /content/browse?content_type=audio
    ↓
Gets audio items with UUIDs from database
    ↓
Displays audio cards
    ↓
User clicks card
    ↓
Navigates to: /audio/{UUID}
    ↓
SingleAudioPage validates UUID format ✅
    ↓
StreamingAudioPlayer calls: /api/streaming/content/{UUID}/stream ✅
    ↓
HLS streaming works! 🎵
```

## Commit Information

**Branch:** `claude/fix-streaming-endpoint-uuid-011CUn4zyr8oEiqDLwnCkiTG`

**Commits:**
1. Fix audio streaming endpoint to use UUID-based routing
2. Add UUID validation with helpful error UI for audio streaming
3. Add AudioBrowsePage to fetch real audio content with UUIDs from backend

---

**Date:** 2025-11-04
**Issue:** Streaming 404 errors due to incorrect endpoint and ID format
**Resolution:** Updated to UUID-based `/api/streaming/content/{UUID}/stream` endpoint and integrated real backend data
