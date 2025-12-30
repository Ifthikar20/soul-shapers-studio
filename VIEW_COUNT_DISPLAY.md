# View Count Display System

## Table of Contents
- [Overview](#overview)
- [Where View Counts Are Shown](#where-view-counts-are-shown)
- [Data Flow](#data-flow)
- [View Count Formatting](#view-count-formatting)
- [Backend Integration](#backend-integration)
- [Implementation Details](#implementation-details)
- [Updating View Counts](#updating-view-counts)

---

## Overview

The Soul Shapers Studio displays view counts in **two primary locations**:

1. **Individual Video Cards** - Shows views per video (e.g., "1.2k views", "5.6M views")
2. **Hero Section** - Shows total platform views (e.g., "15,234+ Total video views")

View counts are:
- ✅ **Fetched from backend** - Real data from your database
- ✅ **Formatted for readability** - "1.2k" instead of "1200"
- ✅ **Updated in real-time** - Reflects actual view tracking
- ✅ **Fallback-friendly** - Shows default if backend unavailable

---

## Where View Counts Are Shown

### 1. Hero Section (Landing Page)

**Location**: Homepage hero banner

**What It Shows**: Total platform views across all content

**File**: `src/components/Hero.tsx:101-109`

```tsx
<div className="flex items-center justify-center gap-2 text-base text-white/90">
  <Eye className="w-5 h-5" />
  <span>
    <strong className="text-white font-semibold">
      {isLoadingViews ? '...' : formatNumber(totalViews)}+
    </strong>{' '}
    Total video views
  </span>
</div>
```

**Visual Example**:
```
┌─────────────────────────────────┐
│         Explore Content         │
│  Join our wellness community    │
│                                 │
│   [Explore Content Button]      │
│                                 │
│   👁 15,234+ Total video views  │
└─────────────────────────────────┘
```

**Also Shown Below Hero**:
```tsx
<div className="flex items-center gap-2 text-sm">
  <Eye className="w-5 h-5" />
  15,234+ Total views
  And growing every day
</div>
```

---

### 2. Video Cards (Browse/Search Pages)

**Location**: All video cards throughout the app

**What It Shows**: Individual video view count

**File**: `src/components/VideoCard.tsx:89-93`

```tsx
<div className="flex items-center gap-2 text-white/80 text-xs">
  <span className="font-medium">{video.expert}</span>
  <span className="text-white/50">•</span>
  <span>{video.views}</span> {/* ← View count displayed here */}
</div>
```

**Visual Example**:
```
┌──────────────────────────────┐
│  [Video Thumbnail]           │
│   NEW    TOP 10              │
│                              │
│  Meditation & Mindfulness    │
│  Introduction to Mindfulness │
│                              │
│  Dr. Sarah Chen  •  1.2k     │ ← View count
└──────────────────────────────┘
```

**Also in Compact View**:
```tsx
// Hover state shows more details
⭐ 4.8  •  1.2k views  •  Meditation
```

---

## Data Flow

### Complete View Count Journey

```
Backend Database (PostgreSQL/MySQL)
  └─ videos table
     └─ view_count column (INTEGER)
         ↓
┌───────────────────────────────────┐
│ Backend API Response              │
│ GET /content/browse               │
│ GET /content/detail/{uuid}        │
├───────────────────────────────────┤
│ {                                 │
│   "id": "123e4567...",            │
│   "title": "Mindfulness 101",     │
│   "view_count": 1234,  ← Raw number
│   ...                             │
│ }                                 │
└───────────────────────────────────┘
         ↓
┌───────────────────────────────────┐
│ Frontend Normalization            │
│ normalizeVideo() function         │
├───────────────────────────────────┤
│ views: formatViews(1234)          │
│   → "1.2k"          ← Formatted   │
└───────────────────────────────────┘
         ↓
┌───────────────────────────────────┐
│ Video Object in Component         │
├───────────────────────────────────┤
│ video.views = "1.2k"              │
│ video.view_count = 1234           │
└───────────────────────────────────┘
         ↓
┌───────────────────────────────────┐
│ Display in UI                     │
├───────────────────────────────────┤
│ <span>{video.views}</span>        │
│   → Shows "1.2k"                  │
└───────────────────────────────────┘
```

---

## View Count Formatting

### Format Function

**File**: `src/types/video.types.ts:101-108`

```typescript
export function formatViews(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`;
  }
  return count.toString();
}
```

### Formatting Examples

| Raw Count | Formatted | Display |
|-----------|-----------|---------|
| 0 | "0" | 0 |
| 42 | "42" | 42 |
| 999 | "999" | 999 |
| 1,000 | "1.0k" | 1.0k |
| 1,234 | "1.2k" | 1.2k |
| 12,847 | "12.8k" | 12.8k |
| 88,800 | "88.8k" | 88.8k |
| 156,789 | "156.8k" | 156.8k |
| 1,000,000 | "1.0M" | 1.0M |
| 5,678,901 | "5.7M" | 5.7M |

### Number Formatting for Total Views

**File**: `src/components/Hero.tsx:33-35`

```typescript
const formatNumber = (num: number): string => {
  return num.toLocaleString('en-US');
};
```

**Example**: `15234` → `"15,234"`

This uses comma separators for better readability in the hero section.

---

## Backend Integration

### 1. Fetching Total Platform Views

**File**: `src/components/Hero.tsx:16-30`

```typescript
useEffect(() => {
  const fetchTotalViews = async () => {
    try {
      // Call analytics service to get total views
      const views = await analyticsService.getTotalVideoViews();
      setTotalViews(views);
    } catch (error) {
      console.error('Failed to fetch total views:', error);
      // Keep default fallback value (15000)
    } finally {
      setIsLoadingViews(false);
    }
  };

  fetchTotalViews();
}, []);
```

**API Call**: `src/services/analytics.service.ts:443-462`

```typescript
async getTotalVideoViews(): Promise<number> {
  try {
    const response = await fetch(`${API_URL}/api/analytics/total-views`, {
      credentials: 'include'
    });

    if (!response.ok) {
      console.warn('Failed to get total views:', response.status);
      return 15000; // Fallback number
    }

    const data = await response.json();
    return data.total_views || 15000;
  } catch (error) {
    console.error('Failed to get total views:', error);
    return 15000; // Fallback on error
  }
}
```

**Backend Endpoint**: `GET /api/analytics/total-views`

**Expected Response**:
```json
{
  "total_views": 15234
}
```

**Backend Query** (Expected):
```sql
SELECT SUM(view_count) as total_views
FROM videos
WHERE status = 'published';
```

---

### 2. Fetching Individual Video View Counts

**File**: `src/services/content.service.ts:46-60`

```typescript
async getVideosForFrontend(category?: string): Promise<Video[]> {
  try {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    params.append('limit', '20');

    const response = await this.api.get(`/content/browse?${params.toString()}`);

    // Normalize each video (includes view count formatting)
    const videos = response.data.content.map((item: any) => normalizeVideo(item));

    return videos;
  } catch (error) {
    console.error('Failed to get videos for frontend:', error);
    return [];
  }
}
```

**Backend Endpoint**: `GET /content/browse?limit=20`

**Expected Response**:
```json
{
  "content": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "title": "Introduction to Mindfulness",
      "view_count": 1234,  ← Raw count from database
      "category_name": "Meditation",
      "expert_name": "Dr. Sarah Chen",
      "thumbnail_url": "...",
      ...
    }
  ],
  "total": 42
}
```

**Backend Query** (Expected):
```sql
SELECT
  id,
  title,
  view_count,
  category_name,
  expert_name,
  thumbnail_url,
  ...
FROM videos
WHERE status = 'published'
ORDER BY created_at DESC
LIMIT 20;
```

---

### 3. Normalizing Video Data

**File**: `src/types/video.types.ts:130-163`

```typescript
export function normalizeVideo(raw: any): Video {
  return {
    // ... other fields

    // Metrics
    rating: raw.rating || 4.8,
    views: raw.views || formatViews(raw.view_count || 0),  ← Formatting happens here
    view_count: raw.view_count,  ← Keep raw count too

    // ... other fields
  };
}
```

**What Happens**:
1. Backend sends `view_count: 1234` (raw number)
2. `normalizeVideo()` calls `formatViews(1234)` → `"1.2k"`
3. Video object has both:
   - `video.views = "1.2k"` (for display)
   - `video.view_count = 1234` (for sorting/calculations)

---

## Implementation Details

### Video Type Definition

**File**: `src/types/video.types.ts:42-45`

```typescript
export interface Video {
  // ... other fields

  // Metrics
  rating: number;
  views: string;          // Formatted (e.g., "1.2k")
  view_count?: number;    // Raw number from backend

  // ... other fields
}
```

### Where View Counts Are Used

| File | Component | What It Shows |
|------|-----------|---------------|
| `src/components/Hero.tsx` | Landing page hero | Total platform views |
| `src/components/VideoCard.tsx` | Video card (default) | Per-video views |
| `src/components/Browse/HybridVideoCard.tsx` | Video card (Amazon-style) | Per-video views |
| `src/components/VideoGrid.tsx` | Video grid normalizer | Formats view counts |

### States and Loading

**Hero Section Loading States**:
```tsx
// Loading state
{isLoadingViews ? '...' : formatNumber(totalViews)}

// Shows "..." while fetching, then "15,234" when loaded
```

**Fallback Values**:
- Total views: `15000` (if API fails)
- Individual videos: `0` (if no `view_count` provided)

---

## Updating View Counts

### How View Counts Increase

```
1. User watches video
   ↓
2. analyticsService.trackView() called
   → POST /api/analytics/track/view
   ↓
3. Backend increments view_count
   → UPDATE videos SET view_count = view_count + 1
   ↓
4. Next time videos are fetched
   → GET /content/browse
   ↓
5. Updated view_count returned
   → Frontend displays new count
```

### Real-Time vs Cached

**Current Implementation**: **Not real-time**
- View counts fetched when page loads
- Updates reflected on next page load/refresh

**To Make Real-Time**:
1. Use WebSockets or Server-Sent Events (SSE)
2. Periodically poll `/api/analytics/views/{id}` every 30 seconds
3. Use cache invalidation on view events

**Example Real-Time Implementation**:
```typescript
// Poll for updated view count every 30 seconds
useEffect(() => {
  const interval = setInterval(async () => {
    const newCount = await analyticsService.getViewCount(video.id);
    setViewCount(newCount);
  }, 30000);

  return () => clearInterval(interval);
}, [video.id]);
```

---

## Backend Requirements

### Database Schema

**Videos Table**:
```sql
CREATE TABLE videos (
  id UUID PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  view_count INTEGER DEFAULT 0,  -- View count column
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  ...
);

-- Index for sorting by views (trending)
CREATE INDEX idx_videos_view_count ON videos(view_count DESC);
```

**View Logs Table** (Optional, for detailed tracking):
```sql
CREATE TABLE view_logs (
  id SERIAL PRIMARY KEY,
  video_id UUID REFERENCES videos(id),
  user_id UUID REFERENCES users(id) NULLABLE,
  session_id UUID NOT NULL,
  watched_at TIMESTAMP DEFAULT NOW(),
  watch_duration INTEGER,  -- Seconds watched
  completed BOOLEAN DEFAULT FALSE
);

-- Index for aggregations
CREATE INDEX idx_view_logs_video_id ON view_logs(video_id);
CREATE INDEX idx_view_logs_watched_at ON view_logs(watched_at);
```

### API Endpoints

**Get Total Views**:
```
GET /api/analytics/total-views
Response: { "total_views": 15234 }
```

**Get Video with View Count**:
```
GET /content/browse?limit=20
Response: {
  "content": [
    { "id": "...", "view_count": 1234, ... }
  ]
}
```

**Track View**:
```
POST /api/analytics/track/view
Body: { "content_id": "123e4567...", "session_id": "..." }
Response: { "success": true }
```

### Backend Logic

**Incrementing View Count**:
```python
# Example Python/FastAPI
@app.post("/api/analytics/track/view")
async def track_view(data: TrackViewRequest):
    # Increment view count
    await db.execute(
        "UPDATE videos SET view_count = view_count + 1 WHERE id = $1",
        data.content_id
    )

    # Log the view
    await db.execute(
        """
        INSERT INTO view_logs (video_id, user_id, session_id, watched_at)
        VALUES ($1, $2, $3, NOW())
        """,
        data.content_id, user_id, data.session_id
    )

    return {"success": True}
```

**Getting Total Views**:
```python
@app.get("/api/analytics/total-views")
async def get_total_views():
    result = await db.fetch_one(
        "SELECT SUM(view_count) as total_views FROM videos WHERE status = 'published'"
    )
    return {"total_views": result["total_views"] or 0}
```

---

## Troubleshooting

### Issue: View counts show "0" or don't update

**Check**:
1. Backend is returning `view_count` field in API response
2. Database has `view_count` column populated
3. Analytics tracking is working (`POST /api/analytics/track/view`)

**Debug**:
```typescript
// Check raw API response
const response = await fetch('http://localhost:8000/content/browse');
const data = await response.json();
console.log('First video view_count:', data.content[0].view_count);
```

### Issue: Total views shows fallback "15,000"

**Check**:
1. Backend endpoint `/api/analytics/total-views` exists
2. Endpoint returns correct JSON format
3. No CORS errors in browser console

**Debug**:
```typescript
// Test total views API
const response = await fetch('http://localhost:8000/api/analytics/total-views');
const data = await response.json();
console.log('Total views from API:', data.total_views);
```

### Issue: View count formatting wrong

**Check**:
1. `formatViews()` function is imported correctly
2. Raw `view_count` is a number (not string)

**Debug**:
```typescript
import { formatViews } from '@/types/video.types';

console.log(formatViews(0));       // "0"
console.log(formatViews(999));     // "999"
console.log(formatViews(1234));    // "1.2k"
console.log(formatViews(5678901)); // "5.7M"
```

---

## Performance Considerations

### Caching Strategy

**Frontend**:
- View counts cached in component state
- Fetched once on mount
- Refetch on manual refresh

**Backend**:
- Cache total views in Redis (5-minute TTL)
- Invalidate cache on view increment
- Use database indexes for fast queries

**Example Redis Cache**:
```python
import redis

redis_client = redis.Redis(host='localhost', port=6379)

@app.get("/api/analytics/total-views")
async def get_total_views():
    # Check cache first
    cached = redis_client.get('total_views')
    if cached:
        return {"total_views": int(cached)}

    # Query database
    result = await db.fetch_one("SELECT SUM(view_count) as total_views FROM videos")
    total = result["total_views"] or 0

    # Cache for 5 minutes
    redis_client.setex('total_views', 300, total)

    return {"total_views": total}
```

### Database Optimization

**Indexes**:
```sql
-- For trending content (ORDER BY view_count DESC)
CREATE INDEX idx_videos_view_count ON videos(view_count DESC);

-- For total views aggregation
CREATE INDEX idx_videos_status_view_count ON videos(status, view_count);
```

**Materialized Views** (for large datasets):
```sql
CREATE MATERIALIZED VIEW mv_content_stats AS
SELECT
  COUNT(*) as total_videos,
  SUM(view_count) as total_views,
  AVG(view_count) as avg_views
FROM videos
WHERE status = 'published';

-- Refresh periodically (e.g., every 5 minutes via cron)
REFRESH MATERIALIZED VIEW mv_content_stats;
```

---

## Summary

### View Count Flow

```
User watches video
   ↓
Backend increments view_count
   ↓
Frontend fetches videos with view_count
   ↓
formatViews() formats the number
   ↓
Display in UI
```

### Key Components

| Component | Responsibility |
|-----------|---------------|
| `Hero.tsx` | Displays total platform views |
| `VideoCard.tsx` | Displays per-video views |
| `analyticsService.getTotalVideoViews()` | Fetches total views |
| `contentService.getVideosForFrontend()` | Fetches videos with view_count |
| `formatViews()` | Formats numbers (1234 → "1.2k") |
| `normalizeVideo()` | Transforms API data to Video type |

### Backend Endpoints

- `GET /api/analytics/total-views` → Total platform views
- `GET /content/browse` → Videos with `view_count`
- `POST /api/analytics/track/view` → Increment view count

### Display Locations

✅ Hero section (total views)
✅ Video cards (per-video views)
✅ Search results (per-video views)
✅ Browse pages (per-video views)

The system is designed to be **robust** (fallbacks if API fails), **performant** (caching), and **user-friendly** (formatted numbers).
