# Search Security Documentation

## Overview

This document describes the comprehensive security measures implemented for the search functionality in the Better & Bliss platform. The search system has been designed with security-first principles to protect against common vulnerabilities and attacks.

## Security Features

### 1. Input Validation

**Purpose**: Prevent malicious input from being processed

**Implementation**:
- Minimum query length: 1 character
- Maximum query length: 200 characters
- Allowed characters: alphanumeric, spaces, and common punctuation
- Automatic truncation of queries exceeding maximum length

**Location**: `src/utils/search.security.ts` - `validateSearchQuery()`

### 2. XSS (Cross-Site Scripting) Protection

**Purpose**: Prevent execution of malicious scripts through search queries

**Protections**:
- HTML entity encoding for dangerous characters (`<`, `>`, `&`, `"`, `'`, `/`)
- Blocking of script tags and JavaScript protocols
- Removal of event handlers (onclick, onerror, etc.)
- Blocking of iframe, embed, and object tags
- Prevention of data URLs and VBScript

**Blocked Patterns**:
```javascript
- <script>...</script> tags
- javascript: protocol
- on* event handlers (onclick, onerror, etc.)
- <iframe>, <embed>, <object> tags
- data:text/html URLs
- vbscript: protocol
- <meta> tags
- HTML comments
```

**Location**: `src/utils/search.security.ts` - `sanitizeHTML()`, `removeDangerousPatterns()`

### 3. SQL Injection Protection

**Purpose**: Prevent SQL injection attempts (future-proofing for backend search)

**Blocked Patterns**:
```javascript
- SQL keywords: SELECT, INSERT, UPDATE, DELETE, DROP, CREATE, ALTER, EXEC, UNION, DECLARE
- OR 1=1 / AND 1=1 patterns
- SQL comments: --, /*, */
- SQL terminators: ;
- SQL Server stored procedures: xp_*, sp_*
```

**Location**: `src/utils/search.security.ts` - `SEARCH_SECURITY_CONFIG.SQL_INJECTION_PATTERNS`

### 4. Rate Limiting

**Purpose**: Prevent abuse and DoS attacks through excessive search requests

**Configuration**:
- Maximum searches per minute: 20
- Rolling window: 60 seconds
- Automatic cleanup of old timestamps
- Client-side enforcement

**Features**:
- Tracks search attempts with timestamps
- Blocks searches when rate limit exceeded
- Shows user-friendly error messages
- Provides remaining search count

**Location**:
- `src/utils/search.security.ts` - `SearchRateLimiter` class
- `src/hooks/useSecureSearch.ts` - Integration

### 5. Security Event Logging

**Purpose**: Monitor and track security-related events

**Events Logged**:
- `DANGEROUS_PATTERN` - Detected XSS attempt
- `SQL_INJECTION` - Detected SQL injection attempt
- `RATE_LIMIT` - Rate limit exceeded
- `INVALID_INPUT` - General input validation failure

**Data Captured**:
- Event type
- Search query (sanitized)
- User ID (if available)
- Timestamp

**Location**: `src/utils/search.security.ts` - `logSecurityEvent()`

### 6. URL Encoding/Decoding

**Purpose**: Safe transmission of search queries via URLs

**Features**:
- Validates query before encoding
- Safely decodes URL parameters
- Error handling for malformed URLs
- Double-encoding prevention

**Location**: `src/utils/search.security.ts` - `encodeSearchQuery()`, `decodeSearchQuery()`

## Architecture

### Components

```
┌─────────────────────────────────────────────────────────┐
│                     User Interface                       │
│                    (Header Component)                    │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                   useSecureSearch Hook                   │
│  • State Management                                      │
│  • Debouncing                                            │
│  • Validation Orchestration                              │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              search.security.ts Utilities                │
│  • Input Validation                                      │
│  • XSS Protection                                        │
│  • SQL Injection Prevention                              │
│  • Rate Limiting                                         │
│  • Security Logging                                      │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                    BrowsePage / Results                  │
│  • Displays validated search results                     │
│  • Shows security warnings/errors                        │
└─────────────────────────────────────────────────────────┘
```

### Data Flow

1. **User Input** → Header component receives search query
2. **Validation** → `useSecureSearch` hook validates input with debouncing
3. **Sanitization** → `validateSearchQuery()` sanitizes and checks for threats
4. **Rate Check** → `SearchRateLimiter` verifies rate limit compliance
5. **Encoding** → `encodeSearchQuery()` safely encodes for URL
6. **Navigation** → Router navigates to search results page
7. **Decoding** → `decodeSearchQuery()` validates URL parameter
8. **Filtering** → BrowsePage filters results with sanitized query
9. **Display** → Results shown with security warnings if applicable

## Usage Examples

### Basic Search (Header Component)

```typescript
import { useSecureSearch } from '@/hooks/useSecureSearch';

const {
  searchState,
  setQuery,
  performSearch,
  canSearch,
  isRateLimited,
} = useSecureSearch({
  autoValidate: true,
  onSearchError: (errors) => console.error(errors),
});

// Handle input
<input
  value={searchState.query}
  onChange={(e) => setQuery(e.target.value)}
  disabled={isRateLimited}
/>

// Handle submit
<button
  onClick={() => performSearch('/browse')}
  disabled={!canSearch}
>
  Search
</button>

// Show errors
{searchState.errors.map(error => (
  <div className="error">{error}</div>
))}
```

### Validating URL Search Params (BrowsePage)

```typescript
import { decodeSearchQuery } from '@/utils/search.security';

const rawQuery = searchParams.get('q') || '';
const validation = decodeSearchQuery(rawQuery);

if (!validation.isValid) {
  // Show error to user
  setErrors(validation.errors);
} else {
  // Use sanitized query
  performSearch(validation.sanitized);
}
```

### Manual Validation

```typescript
import { validateSearchQuery } from '@/utils/search.security';

const result = validateSearchQuery(userInput);

if (result.isValid) {
  // Safe to proceed
  searchWithQuery(result.sanitized);
} else {
  // Show errors
  showErrors(result.errors);
}

// Show warnings even if valid
if (result.warnings.length > 0) {
  showWarnings(result.warnings);
}
```

## Configuration

### Adjust Security Settings

Edit `SEARCH_SECURITY_CONFIG` in `src/utils/search.security.ts`:

```typescript
export const SEARCH_SECURITY_CONFIG = {
  MAX_QUERY_LENGTH: 200,        // Increase/decrease max length
  MIN_QUERY_LENGTH: 1,          // Set minimum length
  MAX_SEARCHES_PER_MINUTE: 20,  // Adjust rate limit
  ALLOWED_CHARACTERS: /^[...]/,  // Modify allowed pattern
};
```

### Add Custom Blocked Patterns

```typescript
BLOCKED_PATTERNS: [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  // Add your custom pattern here
  /your-custom-pattern/gi,
]
```

## Security Best Practices

### For Developers

1. **Always use `useSecureSearch` hook** for search functionality
2. **Never bypass validation** - use the utilities for all search queries
3. **Log security events** - monitor for attack patterns
4. **Keep patterns updated** - regularly review and update blocked patterns
5. **Test edge cases** - test with malicious inputs during development

### For Operations

1. **Monitor security logs** - watch for frequent security events
2. **Adjust rate limits** - based on legitimate usage patterns
3. **Review blocked queries** - analyze what's being blocked
4. **Update patterns** - add new threats as discovered
5. **Set up alerts** - for excessive security events from single users

## Testing

### Test Cases

```typescript
// Valid searches
✓ "anxiety relief"
✓ "Dr. Sarah's meditation"
✓ "stress & anxiety (2024)"

// Invalid - too long
✗ "a".repeat(201)

// Invalid - dangerous patterns
✗ "<script>alert('XSS')</script>"
✗ "'; DROP TABLE users; --"
✗ "<iframe src='evil.com'></iframe>"
✗ "javascript:alert('XSS')"

// Invalid - rate limited
✗ 21 searches within 60 seconds
```

### Manual Testing

1. Test XSS attempts:
   ```
   <script>alert('test')</script>
   <img src=x onerror="alert('test')">
   javascript:alert('test')
   ```

2. Test SQL injection:
   ```
   ' OR 1=1 --
   '; DROP TABLE videos; --
   SELECT * FROM users
   ```

3. Test rate limiting:
   - Perform 20+ searches rapidly
   - Verify rate limit message appears
   - Wait 60 seconds and verify searches work again

4. Test input validation:
   - Empty query
   - Very long query (200+ characters)
   - Special characters only
   - Unicode characters

## Performance Considerations

### Debouncing

The `useSecureSearch` hook implements 300ms debouncing to:
- Reduce validation calls during typing
- Improve user experience
- Minimize performance impact

### Caching

Rate limiter uses in-memory storage:
- No database calls
- Fast lookup (O(1))
- Automatic cleanup of old entries
- Minimal memory footprint

### Validation Performance

- Regex patterns are compiled once
- Validation completes in < 1ms for typical queries
- No blocking operations
- Runs synchronously for immediate feedback

## Future Enhancements

### Planned Features

1. **Backend Search API**
   - Move search to server-side
   - Database query optimization
   - Full-text search with Postgres
   - Advanced filtering capabilities

2. **Enhanced Rate Limiting**
   - Server-side rate limiting
   - IP-based limits
   - Graduated limits by user tier
   - Distributed rate limiting (Redis)

3. **Machine Learning**
   - Detect anomalous search patterns
   - Adaptive rate limiting
   - Automated threat detection
   - Search quality scoring

4. **Advanced Logging**
   - Integration with security monitoring tools
   - Real-time alerting
   - Analytics dashboard
   - Attack pattern visualization

5. **Search History**
   - Encrypted storage
   - User search history (opt-in)
   - Search suggestions based on history
   - Privacy-first design

## Support

For security issues or questions:
- **Security Issues**: Report privately to security@betterandbliss.com
- **General Questions**: Open an issue on GitHub
- **Documentation**: See inline code comments

## License

This security implementation is part of the Better & Bliss platform.
© 2024 Better & Bliss. All rights reserved.
