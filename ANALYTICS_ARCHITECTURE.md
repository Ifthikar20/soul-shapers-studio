# Analytics Architecture

## Table of Contents
- [Overview](#overview)
- [Dual Analytics System](#dual-analytics-system)
- [How Analytics Are Recorded](#how-analytics-are-recorded)
- [Data Flow Diagrams](#data-flow-diagrams)
- [Google Analytics 4 (GA4)](#google-analytics-4-ga4)
- [Backend Analytics](#backend-analytics)
- [Progress Tracking System](#progress-tracking-system)
- [Event Types](#event-types)
- [Data Privacy & Security](#data-privacy--security)
- [Configuration](#configuration)
- [Key Files](#key-files)

---

## Overview

Soul Shapers Studio implements a **dual analytics system** that tracks user behavior and engagement through two parallel channels:

1. **Google Analytics 4 (GA4)** - For web analytics, funnel analysis, and business insights
2. **Backend Analytics API** - For view counts, user progress tracking, and gamification

### Why Two Systems?

| System | Purpose | Data Storage |
|--------|---------|--------------|
| **Google Analytics 4** | Marketing analytics, user behavior, conversion funnels | Google's servers |
| **Backend API** | View counts, user progress, badges, streaks | Your database |

This approach allows:
- ✅ Business intelligence without building custom analytics dashboards
- ✅ Accurate view counts and trending content
- ✅ User-specific progress tracking and gamification
- ✅ Compliance with data privacy regulations (users can opt-out of GA4 but still get progress tracking)

---

## Dual Analytics System

### Architecture Diagram

```
User Action (e.g., plays video)
         |
         ↓
    Component
    (WatchPage)
         |
         ├──────────────────┬──────────────────┐
         ↓                  ↓                  ↓
  analyticsService   analyticsService    progressService
   .trackVideoView     .trackView        .trackActivity
         |                  |                  |
         ↓                  ↓                  ↓
   Google Analytics    Backend API       Backend API
   (GA4 Servers)     (View Tracking)  (Gamification)
         |                  |                  |
         ↓                  ↓                  ↓
   GA4 Dashboard     PostgreSQL/MySQL   PostgreSQL/MySQL
   (Business Intel)  (View Counts)      (User Progress)
```

### Data Destinations

**1. Google Analytics 4** → `https://www.google-analytics.com/g/collect`
- Real-time user behavior
- Page views, events, conversions
- Demographic data (age, location, device)
- Session recordings (via GA4 debugger)

**2. Backend View Tracking API** → `POST /api/analytics/track/view`
- Content view counts
- Watch duration
- User engagement metrics
- Trending content calculation

**3. Backend Progress API** → `POST /api/progress/activity`
- User achievements
- Badges and streaks
- Activity history
- Gamification stats

---

## How Analytics Are Recorded

### 1. Initialization (App Startup)

**File**: `src/main.tsx:6-7`

```typescript
import { analyticsService } from './services/analytics.service'
analyticsService.initialize();
```

**What Happens**:
```typescript
// src/services/analytics.service.ts:40-72
initialize() {
  // Check if GA4 is enabled
  if (!GA_CONFIG.enabled) return;

  // Initialize with measurement ID
  ReactGA.initialize(GA_CONFIG.measurementId, {
    gaOptions: {
      send_page_view: true,
      anonymize_ip: true,
      cookie_flags: 'SameSite=None;Secure'
    }
  });

  console.log('✅ Google Analytics initialized');
}
```

### 2. Tracking a Video View (Complete Example)

**File**: `src/pages/WatchPage.tsx:124-161`

```typescript
// Step 1: User lands on /watch/:id
const WatchPage = () => {
  const { id } = useParams();

  useEffect(() => {
    fetchVideo(); // Load video metadata
  }, [id]);

  const fetchVideo = async () => {
    // Load video data
    const videoData = await contentService.getVideoByUUID(id);

    // Track the view
    await trackVideoView(videoData);
  };

  const trackVideoView = async (videoData: Video) => {
    // Generate or get session ID
    const sessionId = sessionStorage.getItem('sessionId') ||
      crypto.randomUUID();

    // ═══════════════════════════════════════════════════
    // ANALYTICS PATH 1: Google Analytics 4
    // ═══════════════════════════════════════════════════
    await analyticsService.trackVideoView({
      id: videoData.id,
      title: videoData.title,
      category: videoData.category,
      expert: videoData.expert,
      duration: videoData.duration_seconds
    });
    // → Sends to: https://www.google-analytics.com/g/collect
    // → Event: 'video_view' with all metadata

    // ═══════════════════════════════════════════════════
    // ANALYTICS PATH 2: Backend View Tracking
    // ═══════════════════════════════════════════════════
    await analyticsService.trackView({
      content_id: videoData.id,
      video_title: videoData.title,
      category: videoData.category_name,
      expert: videoData.expert,
      duration_seconds: videoData.duration_seconds,
      session_id: sessionId
    });
    // → Sends to: POST http://localhost:8000/api/analytics/track/view
    // → Increments view count in database

    // ═══════════════════════════════════════════════════
    // ANALYTICS PATH 3: Progress Tracking (Gamification)
    // ═══════════════════════════════════════════════════
    await progressService.trackActivity({
      activityType: 'video_watched',
      contentId: videoData.id,
      contentTitle: videoData.title,
      durationMinutes: Math.round(videoData.duration_seconds / 60)
    });
    // → Sends to: POST http://localhost:8000/api/progress/activity
    // → Updates user progress, badges, streaks
  };
};
```

### 3. What Gets Sent to Each System

**Google Analytics 4**:
```javascript
// ReactGA.event() sends to GA4
{
  event: 'video_view',
  content_id: '123e4567-e89b-12d3-a456-426614174000',
  video_title: 'Introduction to Mindfulness',
  category: 'Meditation & Mindfulness',
  expert: 'Dr. Sarah Chen',
  duration_seconds: 900,
  access_tier: 'free',
  content_type: 'video',
  timestamp: '2024-01-15T10:30:00Z',
  // GA4 automatically adds:
  user_id: 'anonymous_12345',
  session_id: 'ga_session_67890',
  page_location: 'https://app.soulshapers.com/watch/123e4567',
  device_category: 'desktop',
  browser: 'Chrome',
  country: 'United States',
  // ... more GA4 metadata
}
```

**Backend View Tracking API**:
```http
POST /api/analytics/track/view
Content-Type: application/json
Cookie: access_token=...; csrf_token=...

{
  "content_id": "123e4567-e89b-12d3-a456-426614174000",
  "video_title": "Introduction to Mindfulness",
  "category": "Meditation & Mindfulness",
  "expert": "Dr. Sarah Chen",
  "duration_seconds": 900,
  "session_id": "550e8400-e29b-41d4-a716-446655440000",
  "user_id": "user_12345" // If logged in
}
```

**Backend Progress API**:
```http
POST /api/progress/activity
Content-Type: application/json
Cookie: access_token=...; csrf_token=...

{
  "activityType": "video_watched",
  "contentId": "123e4567-e89b-12d3-a456-426614174000",
  "contentTitle": "Introduction to Mindfulness",
  "durationMinutes": 15
}
```

---

## Data Flow Diagrams

### Video View Event Flow

```
1. User clicks "Play" on video
   ↓
2. WatchPage.tsx loads video
   ↓
3. fetchVideo() → getVideoByUUID()
   ← Returns video metadata
   ↓
4. trackVideoView() is called
   ↓
   ├─→ analyticsService.trackVideoView()
   │   ├─→ getContentMetadata() (enriches data)
   │   └─→ ReactGA.event('video_view', {...})
   │       └─→ Google Analytics 4 Servers
   │           └─→ Stored in GA4 (real-time processing)
   │
   ├─→ analyticsService.trackView()
   │   └─→ fetch('POST /api/analytics/track/view')
   │       └─→ Backend API
   │           ├─→ Increment view_count in videos table
   │           ├─→ Create view_log entry (timestamp, user_id)
   │           └─→ Update trending_content cache
   │
   └─→ progressService.trackActivity()
       └─→ fetch('POST /api/progress/activity')
           └─→ Backend API
               ├─→ Create activity_log entry
               ├─→ Update user_stats (total_videos_watched++)
               ├─→ Check badge requirements
               ├─→ Update streak (if applicable)
               └─→ Award XP points
```

### Page Navigation Event Flow

```
User navigates to /browse
   ↓
Router change detected
   ↓
useNavigationTracking() hook
   ↓
trackPageView('/browse', 'Browse Videos')
   ↓
ReactGA.send({ hitType: 'pageview', page: '/browse' })
   ↓
Google Analytics 4
   ↓
GA4 Dashboard shows page view
```

---

## Google Analytics 4 (GA4)

### Configuration

**File**: `src/config/analytics.config.ts`

```typescript
export const GA_CONFIG = {
  measurementId: import.meta.env.VITE_GA_MEASUREMENT_ID || '',
  options: {
    send_page_view: true,      // Auto-track page views
    anonymize_ip: true,         // GDPR compliance
    cookie_flags: 'SameSite=None;Secure',
  },
  enabled: import.meta.env.VITE_GA_ENABLED === 'true' || import.meta.env.PROD,
};

export const GA_DEBUG = import.meta.env.DEV; // Debug logs in development
```

### Environment Variables

```bash
# .env
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX  # Your GA4 measurement ID
VITE_GA_ENABLED=true                  # Enable/disable GA4
```

### GA4 Events Tracked

**File**: `src/services/analytics.service.ts`

| Event Name | Trigger | Data Sent | Use Case |
|------------|---------|-----------|----------|
| `pageview` | Route change | page, title | Page visit tracking |
| `video_view` | Video loads | content_id, title, category, expert | Content popularity |
| `video_play` | User clicks play | content_id, video_title | Engagement |
| `video_pause` | User pauses | content_id, current_time, progress_percent | Drop-off analysis |
| `video_complete` | Video ends (95%+) | content_id, watch_time_seconds | Completion rate |
| `video_progress` | 25%, 50%, 75%, 90% milestones | content_id, progress_percent | Engagement depth |
| `add_to_favorites` | User favorites content | content_id, content_title | Interest signals |
| `remove_from_favorites` | User unfavorites | content_id | Interest signals |
| `share` | User shares content | content_id, method (link/social) | Virality tracking |
| `sign_up` | User registers | method (email/google/apple) | Acquisition channels |
| `login` | User logs in | method | Retention |
| `purchase` | Subscription purchased | tier, price, transaction_id | Revenue tracking |
| `search` | User searches | search_term, result_count | Search quality |
| `view_category` | User views category | category_name, category_slug | Discovery patterns |
| `view_expert` | User views expert | expert_name, expert_slug | Expert popularity |

### GA4 Custom Events

**File**: `src/services/analytics.service.ts:405-413`

```typescript
// Track custom events
analyticsService.trackEvent('custom_event_name', {
  parameter_1: 'value1',
  parameter_2: 'value2',
});
```

### Viewing GA4 Data

1. **GA4 Dashboard**: https://analytics.google.com
2. **Real-time Reports**: Live user activity
3. **Engagement Reports**: Content performance
4. **Conversion Funnels**: Sign-up → Subscribe → Purchase
5. **User Properties**: Set in `setUserProperties()`

---

## Backend Analytics

### View Tracking API

**Endpoint**: `POST /api/analytics/track/view`

**Purpose**: Increment view counts for trending content and statistics

**Request**:
```typescript
interface TrackViewParams {
  content_id: string;        // Video UUID
  video_title?: string;      // For analytics dashboard
  category?: string;         // Content category
  expert?: string;           // Expert name
  duration_seconds?: number; // Video length
  user_id?: string;          // Logged-in user (optional)
  session_id?: string;       // Anonymous tracking
  watch_duration?: number;   // How long they watched
}
```

**Implementation**: `src/services/analytics.service.ts:419-438`

```typescript
async trackView(params: TrackViewParams): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/api/analytics/track/view`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // Send cookies for auth
      body: JSON.stringify(params)
    });

    if (!response.ok) {
      console.warn('Failed to track view on backend:', response.status);
      return;
    }

    console.log('✅ Backend view tracked:', params.content_id);
  } catch (error) {
    console.error('Failed to track view on backend:', error);
    // Don't throw - tracking failures shouldn't break the app
  }
}
```

**Backend Processing** (Expected):
```sql
-- Increment view count
UPDATE videos
SET view_count = view_count + 1
WHERE id = :content_id;

-- Create view log entry
INSERT INTO view_logs (
  video_id, user_id, session_id,
  watched_at, watch_duration
) VALUES (
  :content_id, :user_id, :session_id,
  NOW(), :watch_duration
);

-- Update trending cache (Redis)
ZINCRBY trending:7days :content_id 1
```

### Retrieving Analytics Data

**Total Views**:
```typescript
const totalViews = await analyticsService.getTotalVideoViews();
// → GET /api/analytics/total-views
// → Returns: { total_views: 15234 }
```

**Content-Specific Views**:
```typescript
const viewCount = await analyticsService.getViewCount(videoId);
// → GET /api/analytics/views/{videoId}
// → Returns: { view_count: 127 }
```

**Trending Content**:
```typescript
const trending = await analyticsService.getTrending(10, 7);
// → GET /api/analytics/trending?limit=10&days=7
// → Returns: [{ content_id, title, view_count, rank }, ...]
```

### Backend API Endpoints

| Endpoint | Method | Purpose | Response |
|----------|--------|---------|----------|
| `/api/analytics/track/view` | POST | Record view | `{ success: true }` |
| `/api/analytics/total-views` | GET | Total view count | `{ total_views: 15000 }` |
| `/api/analytics/views/:id` | GET | View count for content | `{ view_count: 127 }` |
| `/api/analytics/trending` | GET | Trending content | `{ trending_content: [...] }` |
| `/api/analytics/content/:id/metadata` | GET | Enriched metadata | `{ title, category, expert, ... }` |

---

## Progress Tracking System

### Overview

The progress tracking system is **separate from view analytics** and focuses on **user gamification**:

- 🎯 User goals and streaks
- 🏆 Badges and achievements
- 📊 Progress dashboards
- 🔥 Daily streaks

**Status**: Currently uses **mock data** (`USE_MOCK_DATA = true`)

### Progress API Endpoints

**File**: `src/services/progress.service.ts`

| Endpoint | Method | Purpose | Data Returned |
|----------|--------|---------|---------------|
| `/api/progress/summary` | GET | Complete dashboard | stats, badges, goals, activity |
| `/api/progress/stats` | GET | User statistics | XP, level, minutes, courses |
| `/api/progress/badges` | GET | User badges | earned badges, progress |
| `/api/progress/streak` | GET | Streak data | current, longest, isActive |
| `/api/progress/goals` | GET | User goals | goals list |
| `/api/progress/goals` | POST | Create goal | new goal |
| `/api/progress/goals/:id` | PATCH | Update goal | updated goal |
| `/api/progress/goals/:id` | DELETE | Delete goal | success |
| `/api/progress/activity` | POST | Track activity | success |
| `/api/progress/weekly` | GET | Weekly progress | days, totalMinutes, sessions |
| `/api/progress/categories` | GET | Category stats | minutesWatched by category |
| `/api/progress/experts` | GET | Expert stats | minutesWatched by expert |

### Tracking Activity

**File**: `src/services/progress.service.ts:200-214`

```typescript
async trackActivity(activityData: TrackActivityRequest): Promise<void> {
  // Currently using mock data
  if (USE_MOCK_DATA) {
    console.log('📊 [Mock Mode] Activity tracked:', activityData.activityType);
    return;
  }

  try {
    await this.api.post('/api/progress/activity', activityData);
    console.log('✅ Activity tracked:', activityData.activityType);
  } catch (error) {
    console.error('Failed to track activity:', error);
    // Don't throw - tracking failures shouldn't break the app
  }
}
```

**Activity Types**:
```typescript
type ActivityType =
  | 'video_watched'        // Completed a video
  | 'meditation_session'   // Completed a meditation
  | 'audio_completed'      // Completed audio content
  | 'course_completed'     // Finished a course
  | 'breathing_session'    // Breathing exercise
  | 'badge_earned'         // Achievement unlocked
  | 'goal_completed';      // Goal achieved
```

**Request Example**:
```typescript
await progressService.trackActivity({
  activityType: 'video_watched',
  contentId: '123e4567-e89b-12d3-a456-426614174000',
  contentTitle: 'Introduction to Mindfulness',
  durationMinutes: 15,
  metadata: {
    category: 'Meditation',
    expert: 'Dr. Sarah Chen'
  }
});
```

### Gamification Features

**XP (Experience Points)**:
```typescript
// XP calculation (from mock data)
const sessionsXP = sessions * 10;      // 10 XP per session
const minutesXP = minutes * 2;          // 2 XP per minute watched
const coursesXP = coursesCompleted * 50; // 50 XP per course
const totalXP = sessionsXP + minutesXP + coursesXP;

// Level calculation (every 500 XP = 1 level)
const level = Math.floor(totalXP / 500) + 1;
const xpToNextLevel = 500 - (totalXP % 500);
```

**Badges**:
```typescript
// Example badges
{
  id: 'streak_7',
  name: '7-Day Warrior',
  description: 'Maintain a 7-day meditation streak',
  icon: '🔥',
  tier: 'gold',
  isUnlocked: false,
  progress: 71, // 5 out of 7 days
  requirement: 'Complete 7 consecutive days'
}
```

**Streaks**:
```typescript
{
  currentStreak: 5,          // Current consecutive days
  longestStreak: 12,         // All-time record
  lastActivityDate: '2024-01-15T10:30:00Z',
  weeklyStreak: 1,           // Weeks in a row
  isActive: true             // Activity today
}
```

---

## Event Types

### Complete Event Catalog

#### Video Events
```typescript
// When video page loads
analyticsService.trackVideoView({...})    // → GA4 + Backend

// When user clicks play button
analyticsService.trackVideoPlay(id, title)  // → GA4 only

// When user pauses
analyticsService.trackVideoPause(id, time, duration)  // → GA4 only

// At 25%, 50%, 75%, 90% watched
analyticsService.trackVideoProgress(id, percent, time)  // → GA4 only

// When video finishes (95%+)
analyticsService.trackVideoComplete(id, title, watchTime)  // → GA4 only
```

#### User Lifecycle Events
```typescript
// User creates account
analyticsService.trackSignUp('email')  // → GA4 only

// User logs in
analyticsService.trackLogin('google')  // → GA4 only

// User purchases subscription
analyticsService.trackSubscription('premium', 29.99, 'txn_123')  // → GA4 only
```

#### Content Interaction Events
```typescript
// User favorites content
analyticsService.trackContentFavorite(id, title, 'add')  // → GA4 only

// User shares content
analyticsService.trackContentShare(id, title, 'copy_link')  // → GA4 only

// User searches
analyticsService.trackSearch('meditation', 42)  // → GA4 only

// User views category
analyticsService.trackCategoryView('Meditation', 'meditation')  // → GA4 only

// User views expert profile
analyticsService.trackExpertView('Dr. Sarah Chen', 'dr-sarah-chen')  // → GA4 only
```

#### Navigation Events
```typescript
// Page view (automatic via router)
analyticsService.trackPageView('/browse', 'Browse Videos')  // → GA4 only

// Custom navigation tracking
navigateWithTracking('/watch/123', {
  source: 'browse_click',
  videoId: '123',
  feature: 'recommended'
})  // → Console logs (not sent anywhere by default)
```

#### Progress Events
```typescript
// Activity tracking (gamification)
progressService.trackActivity({
  activityType: 'video_watched',
  contentId: '123',
  contentTitle: 'Mindfulness 101',
  durationMinutes: 15
})  // → Backend progress API
```

---

## Data Privacy & Security

### User Consent

**Google Analytics 4**:
- Can be disabled via `VITE_GA_ENABLED=false`
- IP anonymization enabled by default
- Cookie-based tracking (users can block)

**Backend Analytics**:
- Always enabled (view counts are anonymous)
- Uses session IDs for anonymous users
- Associates with user_id only if logged in

### GDPR Compliance

```typescript
// User can opt-out of GA4
analyticsService.disable();  // Stops sending to Google

// User can still get progress tracking
progressService.trackActivity({...});  // Backend only
```

### Data Retention

| Data Type | Location | Retention | Purpose |
|-----------|----------|-----------|---------|
| GA4 Events | Google servers | 14 months (configurable) | Business analytics |
| View counts | Your database | Indefinite | Content statistics |
| User progress | Your database | Indefinite | Gamification |
| Session IDs | sessionStorage | Until tab closes | Anonymous tracking |

### Security Headers

**File**: `src/services/analytics.service.ts:421-425`

```typescript
fetch(`${API_URL}/api/analytics/track/view`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include', // ← Sends httpOnly cookies (access_token)
  body: JSON.stringify(params)
});
```

Auth headers added by interceptor:
- `Authorization: Bearer {access_token}`
- `X-CSRF-Token: {csrf_token}`
- `X-Request-ID: {unique-id}`

---

## Configuration

### Environment Variables

```bash
# Google Analytics 4
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_GA_ENABLED=true

# Backend API
VITE_API_URL=http://localhost:8000
VITE_BACKEND_URL=http://localhost:8080

# Debug mode (auto-enabled in development)
# Shows console logs for all analytics events
```

### Enabling/Disabling Analytics

**Disable GA4**:
```bash
# .env
VITE_GA_ENABLED=false
```

**Disable Progress Tracking** (use mock data):
```typescript
// src/services/progress.service.ts:26
const USE_MOCK_DATA = true; // Set to false when backend is ready
```

### Debug Mode

**GA4 Debug Logs**:
```typescript
// Automatically enabled in development
export const GA_DEBUG = import.meta.env.DEV;

// Shows logs like:
// 📄 Page view tracked: /browse
// 📊 Video view tracked: 123e4567
// ▶️ Video play tracked: 123e4567
```

**Backend Debug Logs**:
```typescript
// Always logs in console
console.log('✅ Backend view tracked:', params.content_id);
console.log('✅ Activity tracked:', activityData.activityType);
```

---

## Key Files

### Core Services

| File | Lines | Purpose |
|------|-------|---------|
| `src/services/analytics.service.ts` | 529 | Main analytics service (GA4 + Backend) |
| `src/services/progress.service.ts` | 606 | Progress tracking and gamification |
| `src/config/analytics.config.ts` | 11 | GA4 configuration |

### Hooks

| File | Purpose |
|------|---------|
| `src/hooks/useNavigationTracking.ts` | Navigation event tracking |

### Integration Points

| File | Location | What It Tracks |
|------|----------|----------------|
| `src/main.tsx` | Line 6-7 | Initialize GA4 on app start |
| `src/pages/WatchPage.tsx` | Line 124-161 | Video views (GA4 + Backend + Progress) |
| `src/App.tsx` | Router integration | Page views (auto-tracked) |

### Types

| File | Purpose |
|------|---------|
| `src/types/progress.types.ts` | Progress tracking interfaces |

---

## Analytics Flow Summary

### What Happens When a User Watches a Video

```
1. User lands on /watch/:id
   ↓
2. WatchPage component mounts
   ↓
3. fetchVideo() loads video metadata
   ↓
4. trackVideoView() executes THREE parallel tracking calls:

   ┌─────────────────────────────────────┐
   │ Google Analytics 4                  │
   │ Event: video_view                   │
   │ Destination: google-analytics.com   │
   │ Purpose: Business analytics         │
   └─────────────────────────────────────┘

   ┌─────────────────────────────────────┐
   │ Backend View Tracking               │
   │ Endpoint: POST /api/analytics/...   │
   │ Destination: Your database          │
   │ Purpose: View counts, trending      │
   └─────────────────────────────────────┘

   ┌─────────────────────────────────────┐
   │ Progress Tracking                   │
   │ Endpoint: POST /api/progress/...    │
   │ Destination: Your database          │
   │ Purpose: Gamification, badges       │
   └─────────────────────────────────────┘

5. All three complete (failures are logged, not thrown)
   ↓
6. Video starts playing
```

### Where Is Data Stored?

| Data Type | Storage Location | Access |
|-----------|------------------|--------|
| GA4 events | Google Cloud | GA4 Dashboard at analytics.google.com |
| View counts | Your PostgreSQL/MySQL | Backend API queries |
| User progress | Your PostgreSQL/MySQL | Progress API & Dashboard |
| Session IDs | Browser sessionStorage | Cleared on tab close |
| GA4 cookies | Browser cookies | Managed by Google |

---

## Future Enhancements

### Planned Features

1. **Real-time Analytics Dashboard**
   - Custom admin dashboard showing live view counts
   - Trending content in real-time
   - User engagement heatmaps

2. **Enhanced Progress Tracking**
   - Weekly challenges
   - Social features (compare with friends)
   - Leaderboards

3. **Advanced Analytics**
   - A/B testing framework
   - Personalized recommendations based on watch history
   - Predictive analytics (churn detection)

4. **Privacy Features**
   - Granular consent management
   - Export user data (GDPR compliance)
   - Data deletion requests

5. **Performance Tracking**
   - Video buffering analytics
   - Error rate tracking
   - Quality of Experience (QoE) metrics

---

## Troubleshooting

### Common Issues

**GA4 not receiving events**:
```bash
# Check if GA4 is enabled
echo $VITE_GA_ENABLED  # Should be "true"

# Check measurement ID
echo $VITE_GA_MEASUREMENT_ID  # Should be "G-XXXXXXXXXX"

# Check browser console for errors
# Look for: "✅ Google Analytics initialized"
```

**Backend view tracking failing**:
```typescript
// Check API URL
console.log(import.meta.env.VITE_API_URL);

// Check if backend is running
fetch('http://localhost:8000/health')
  .then(r => r.json())
  .then(console.log);

// Check network tab for 401/403 errors (auth issue)
```

**Progress tracking not working**:
```typescript
// Check if mock mode is enabled
// File: src/services/progress.service.ts:26
const USE_MOCK_DATA = true; // ← Should be false for real backend
```

### Debug Checklist

- [ ] GA4 initialized (check console on page load)
- [ ] Measurement ID configured in `.env`
- [ ] Backend API reachable (check `/health`)
- [ ] User authenticated (cookies present)
- [ ] No CORS errors in console
- [ ] Network requests visible in DevTools Network tab

---

## Summary

The Soul Shapers Studio analytics system is a **robust, dual-channel tracking solution** that:

✅ **Tracks user behavior** with Google Analytics 4 for business intelligence
✅ **Records view counts** via backend API for content statistics
✅ **Tracks user progress** for gamification and engagement
✅ **Respects privacy** with opt-out options and anonymization
✅ **Fails gracefully** - tracking errors don't break the app
✅ **Provides debug logs** for development and troubleshooting

**Data is sent to**:
1. **Google Analytics 4** → `https://www.google-analytics.com/g/collect`
2. **Backend View API** → `POST /api/analytics/track/view`
3. **Backend Progress API** → `POST /api/progress/activity`

This architecture provides comprehensive analytics while maintaining user privacy and system reliability.
