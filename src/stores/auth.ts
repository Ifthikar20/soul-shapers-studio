// src/stores/auth.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '@/services/auth.service'
import { useToast } from '@/composables/useToast'
import { logAuthEvent, clearSensitiveData } from '@/utils/auth.security'

export interface User {
    id: string
    email: string
    name: string
    role: 'free_user' | 'premium_user' | 'admin'
    subscription_tier: 'free' | 'basic' | 'premium'
    permissions: string[]
}

export const useAuthStore = defineStore('auth', () => {
    // State
    const user = ref<User | null>(null)
    const loading = ref(true)
    const isInitialized = ref(false)

    // Session timeout refs
    let sessionTimeoutId: ReturnType<typeof setTimeout> | null = null
    const SESSION_TIMEOUT_MS = 30 * 60 * 1000 // 30 minutes

    // Getters
    const isAuthenticated = computed(() => !!user.value)

    const checkPermission = (permission: string): boolean => {
        if (!user.value) return false
        if (user.value.role === 'admin') return true
        return user.value.permissions?.includes(permission) || false
    }

    const canAccessContent = (contentTier: string): boolean => {
        if (!user.value) return contentTier === 'free'

        const tierHierarchy: Record<string, number> = {
            'free': 0,
            'basic': 1,
            'premium': 2
        }

        return tierHierarchy[user.value.subscription_tier] >= tierHierarchy[contentTier]
    }

    // Actions
    const checkAuthStatus = async () => {
        if (isInitialized.value) return

        try {
            const userData = await authService.getCurrentUser()
            user.value = userData
            startSessionTimeout()
        } catch {
            user.value = null
        } finally {
            loading.value = false
            isInitialized.value = true
        }
    }

    const login = async (email: string, password: string) => {
        const { toast } = useToast()

        try {
            const response = await authService.login(email, password)
            user.value = response.user
            startSessionTimeout()

            toast({
                title: 'Welcome back!',
                description: "You've successfully logged in."
            })
        } catch (error: any) {
            toast({
                title: 'Login failed',
                description: error.message || 'Invalid credentials',
                variant: 'destructive'
            })
            throw error
        }
    }

    const register = async (email: string, password: string, fullName: string) => {
        const { toast } = useToast()

        try {
            const response = await authService.register(email, password, fullName)

            if (response.needsConfirmation) {
                toast({
                    title: 'Check your email',
                    description: response.message || 'Please confirm your email address.'
                })
                return response
            }

            user.value = response.user
            startSessionTimeout()

            toast({
                title: 'Welcome to Soul Shapers!',
                description: 'Your account has been created successfully.'
            })

            return response
        } catch (error: any) {
            toast({
                title: 'Registration failed',
                description: error.message || 'Could not create account',
                variant: 'destructive'
            })
            throw error
        }
    }

    const logout = async () => {
        const { toast } = useToast()

        try {
            await authService.logout()
        } catch (error) {
            console.error('Logout error:', error)
            logAuthEvent('LOGOUT', { error: 'Logout failed', details: error })
        } finally {
            clearSessionTimeout()
            user.value = null
            isInitialized.value = false
            clearSensitiveData()

            toast({
                title: 'Logged out',
                description: "You've been successfully logged out."
            })
        }
    }

    const handleSessionExpiry = async () => {
        const { toast } = useToast()

        logAuthEvent('SESSION_EXPIRED', { reason: 'Inactivity timeout' })
        clearSessionTimeout()
        user.value = null
        isInitialized.value = false
        clearSensitiveData()

        toast({
            title: 'Session Expired',
            description: 'Your session has expired due to inactivity. Please log in again.',
            variant: 'destructive'
        })

        try {
            await authService.logout()
        } catch {
            // Ignore errors during session expiry logout
        }
    }

    const startSessionTimeout = () => {
        clearSessionTimeout()
        sessionTimeoutId = setTimeout(() => {
            if (user.value) {
                handleSessionExpiry()
            }
        }, SESSION_TIMEOUT_MS)
    }

    const clearSessionTimeout = () => {
        if (sessionTimeoutId) {
            clearTimeout(sessionTimeoutId)
            sessionTimeoutId = null
        }
    }

    const resetSessionTimeout = () => {
        if (user.value) {
            startSessionTimeout()
        }
    }

    // Set up token refresh
    const setupTokenRefresh = () => {
        setInterval(() => {
            if (user.value) {
                authService.refreshToken().catch(console.error)
            }
        }, 14 * 60 * 1000) // 14 minutes
    }

    return {
        // State
        user,
        loading,
        isAuthenticated,

        // Actions
        checkAuthStatus,
        login,
        register,
        logout,
        checkPermission,
        canAccessContent,
        resetSessionTimeout,
        setupTokenRefresh
    }
})
