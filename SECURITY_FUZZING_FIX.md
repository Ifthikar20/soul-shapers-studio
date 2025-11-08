# Security Fix: Fuzzing Attack Mitigation

## Issue Discovered

During fuzzing with `ffuf`, the following critical security vulnerabilities were discovered:

```
/.git/HEAD               [Status: 301]
/.git/config             [Status: 301]
/.svn/entries            [Status: 301]
/.well-known/*           [Status: 301] (multiple endpoints)
```

These findings indicated that sensitive version control directories and configuration files were publicly accessible, which could expose:
- Complete Git repository history
- Source code
- Sensitive credentials or secrets in commit history
- Configuration files
- Internal project structure

## Security Fixes Implemented

### 1. **Public Directory Access Control** (`public/_redirects`)

Created a `_redirects` file that AWS Amplify uses to control access to sensitive paths:

**Blocked Paths:**
- `.git/*` - Git repository files
- `.svn/*` - SVN repository files
- `.env*` - Environment configuration files
- Configuration files (package.json, amplify.yml, etc.)
- Backup files (*.bak, *.tmp, *.swp, etc.)
- Well-known paths that don't exist

**Key Features:**
- Returns 404 for all sensitive paths (instead of 301 redirects)
- Maintains SPA routing functionality for legitimate requests
- Prevents information disclosure about project structure

### 2. **Security Headers** (`public/_headers`)

Added comprehensive security headers to protect against common web vulnerabilities:

**Implemented Headers:**
- `X-Frame-Options: DENY` - Prevents clickjacking attacks
- `X-XSS-Protection: 1; mode=block` - XSS protection for older browsers
- `X-Content-Type-Options: nosniff` - Prevents MIME-sniffing attacks
- `Strict-Transport-Security` - Enforces HTTPS connections
- `Referrer-Policy` - Controls referrer information leakage
- `Content-Security-Policy` - Restricts resource loading to prevent XSS
- `Permissions-Policy` - Disables unnecessary browser features

### 3. **Enhanced Deployment Configuration** (`amplify.yml`)

Updated the AWS Amplify build configuration:

**Build Phase Security:**
- Explicitly removes sensitive files from dist directory during build
- Prevents accidental inclusion of `.git`, `.env`, config files

**Artifact Exclusions:**
- Configured `excludeFiles` to block version control directories
- Excludes environment files and configuration files
- Ensures only necessary static assets are deployed

**Custom Headers:**
- Applied security headers at the CDN/hosting level
- Provides defense-in-depth with both file-level and header-level protection

## Testing the Fixes

After deploying these changes, run the same fuzzing command:

```bash
ffuf -w /usr/share/seclists/Discovery/Web-Content/common.txt \
     -u https://www.betterandbliss.com/FUZZ \
     -mc 200,301,302,403 \
     -t 10 \
     -rate 10 \
     -c
```

**Expected Results:**
- `/.git/*` should return **404 Not Found** (not 301)
- `/.svn/*` should return **404 Not Found** (not 301)
- `/.well-known/*` should return **404 Not Found** (not 301)
- Configuration files should return **404 Not Found**

## Security Best Practices Followed

1. **Defense in Depth**: Multiple layers of protection
   - Build-time file removal
   - Deployment-time artifact exclusion
   - Runtime access control via redirects
   - Security headers for additional protection

2. **Least Privilege**: Only necessary files are deployed and accessible

3. **Fail Securely**: Unknown/blocked paths return 404 instead of revealing path structure

4. **Information Hiding**: Prevents disclosure of:
   - Technology stack details
   - Internal file structure
   - Version control history
   - Configuration details

## Additional Recommendations

1. **Regular Security Audits**: Run fuzzing tests periodically to catch new vulnerabilities

2. **Environment Variables**: Ensure all sensitive data uses environment variables, never commit secrets to Git

3. **Git History Cleanup**: If sensitive data was previously committed, consider using tools like `git-filter-repo` to clean history

4. **Monitoring**: Set up logging and monitoring to detect unauthorized access attempts

5. **WAF Configuration**: Consider adding AWS WAF rules for additional protection against common attack patterns

## Files Modified

- ✅ `public/_redirects` - Created access control rules
- ✅ `public/_headers` - Created security headers
- ✅ `amplify.yml` - Enhanced deployment security

## Deployment Instructions

1. Commit these changes to your repository
2. Push to the deployment branch
3. AWS Amplify will automatically rebuild with new security configurations
4. Verify fixes by running the fuzzing test again
5. Check browser developer tools to confirm security headers are present

## References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [AWS Amplify Hosting Redirects](https://docs.aws.amazon.com/amplify/latest/userguide/redirects.html)
- [Security Headers Best Practices](https://owasp.org/www-project-secure-headers/)
