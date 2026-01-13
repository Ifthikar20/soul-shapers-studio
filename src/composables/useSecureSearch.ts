// src/composables/useSecureSearch.ts
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import DOMPurify from 'isomorphic-dompurify'

// Security patterns to detect malicious input
const SECURITY_PATTERNS = [
    /<script[\s\S]*?>[\s\S]*?<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<[^>]+>/g,
    /(\$\{|\{\{)/gi,
    /[\x00-\x1f\x7f]/g,
    /\.\.\//g,
    /[;|`$()]/g
]

// Max search query length
const MAX_QUERY_LENGTH = 100

export function useSecureSearch() {
    const router = useRouter()
    const searchQuery = ref('')
    const searchError = ref<string | null>(null)
    const isSearching = ref(false)

    const sanitizeQuery = (query: string): string => {
        // Trim and limit length
        let sanitized = query.trim().slice(0, MAX_QUERY_LENGTH)

        // Use DOMPurify to strip HTML
        sanitized = DOMPurify.sanitize(sanitized, { ALLOWED_TAGS: [] })

        // Remove any remaining security patterns
        SECURITY_PATTERNS.forEach(pattern => {
            sanitized = sanitized.replace(pattern, '')
        })

        // Normalize whitespace
        sanitized = sanitized.replace(/\s+/g, ' ').trim()

        return sanitized
    }

    const validateQuery = (query: string): boolean => {
        if (!query || query.length < 2) {
            searchError.value = 'Search query must be at least 2 characters'
            return false
        }

        if (query.length > MAX_QUERY_LENGTH) {
            searchError.value = `Search query must be less than ${MAX_QUERY_LENGTH} characters`
            return false
        }

        // Check for security patterns
        for (const pattern of SECURITY_PATTERNS) {
            if (pattern.test(query)) {
                searchError.value = 'Invalid search query'
                return false
            }
        }

        searchError.value = null
        return true
    }

    const search = async (query: string) => {
        const sanitized = sanitizeQuery(query)

        if (!validateQuery(sanitized)) {
            return
        }

        searchQuery.value = sanitized
        isSearching.value = true

        try {
            await router.push({
                name: 'search',
                query: { q: sanitized }
            })
        } finally {
            isSearching.value = false
        }
    }

    const clearSearch = () => {
        searchQuery.value = ''
        searchError.value = null
        isSearching.value = false
    }

    return {
        searchQuery,
        searchError,
        isSearching,
        sanitizeQuery,
        validateQuery,
        search,
        clearSearch
    }
}
