import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Lazy load pages for code splitting
const Index = () => import('@/pages/Index.vue')
const LoginPage = () => import('@/pages/LoginPage.vue')
const ForgotPasswordPage = () => import('@/pages/ForgotPasswordPage.vue')
const ResetPasswordPage = () => import('@/pages/ResetPasswordPage.vue')
const BrowsePage = () => import('@/pages/BrowsePage.vue')
const WatchPage = () => import('@/pages/WatchPage.vue')
const AudioPage = () => import('@/pages/AudioPage.vue')
const AudioBrowsePage = () => import('@/pages/AudioBrowsePage.vue')
const SingleAudioPage = () => import('@/pages/SingleAudioPage.vue')
const MeditatePage = () => import('@/pages/MeditatePage.vue')
const MeditateAudioPage = () => import('@/pages/MeditateAudioPage.vue')
const SoundDetailPage = () => import('@/pages/SoundDetailPage.vue')
const ExpertsPage = () => import('@/pages/ExpertsPage.vue')
const ExpertProfilePage = () => import('@/pages/ExpertProfilePage.vue')
const ProfilePage = () => import('@/pages/ProfilePage.vue')
const SettingsPage = () => import('@/pages/SettingsPage.vue')
const ProgressPage = () => import('@/pages/ProgressPage.vue')
const SearchResults = () => import('@/pages/SearchResults.vue')
const UpgradePage = () => import('@/pages/UpgradePage.vue')
const PrivacyPolicyPage = () => import('@/pages/PrivacyPolicyPage.vue')
const SupportPage = () => import('@/pages/SupportPage.vue')
const UnauthorizedPage = () => import('@/pages/UnauthorizedPage.vue')
const NotFound = () => import('@/pages/NotFound.vue')

// Blog pages
const BlogLandingPage = () => import('@/pages/blog/BlogLandingPage.vue')
const BlogPostPage = () => import('@/pages/blog/BlogPostPage.vue')
const BlogCategoryPage = () => import('@/pages/blog/BlogCategoryPage.vue')

const routes: RouteRecordRaw[] = [
    // Landing Page (accessible by everyone)
    {
        path: '/',
        name: 'home',
        component: Index,
        meta: { public: true }
    },

    // Public Routes
    {
        path: '/login',
        name: 'login',
        component: LoginPage,
        meta: { public: true }
    },
    {
        path: '/forgot-password',
        name: 'forgot-password',
        component: ForgotPasswordPage,
        meta: { public: true }
    },
    {
        path: '/reset-password',
        name: 'reset-password',
        component: ResetPasswordPage,
        meta: { public: true }
    },
    {
        path: '/privacy-policy',
        name: 'privacy-policy',
        component: PrivacyPolicyPage,
        meta: { public: true }
    },
    {
        path: '/support',
        name: 'support',
        component: SupportPage,
        meta: { public: true }
    },
    {
        path: '/unauthorized',
        name: 'unauthorized',
        component: UnauthorizedPage,
        meta: { public: true }
    },
    {
        path: '/upgrade',
        name: 'upgrade',
        component: UpgradePage,
        meta: { public: true }
    },
    {
        path: '/upgrade/:upgradeId',
        name: 'upgrade-type',
        component: UpgradePage,
        meta: { public: true }
    },

    // Blog Routes (Public)
    {
        path: '/read',
        name: 'blog',
        component: BlogLandingPage,
        meta: { public: true }
    },
    {
        path: '/read/post/:slug',
        name: 'blog-post',
        component: BlogPostPage,
        meta: { public: true }
    },
    {
        path: '/read/category/:category',
        name: 'blog-category',
        component: BlogCategoryPage,
        meta: { public: true }
    },

    // Protected Routes - Audio
    {
        path: '/audio',
        name: 'audio',
        component: AudioBrowsePage,
        meta: { requiresAuth: true }
    },
    {
        path: '/audio/browse',
        name: 'audio-browse',
        component: AudioBrowsePage,
        meta: { requiresAuth: true }
    },
    {
        path: '/audio/topics',
        name: 'audio-topics',
        component: AudioPage,
        meta: { requiresAuth: true }
    },
    {
        path: '/audio/:id',
        name: 'audio-detail',
        component: SingleAudioPage,
        meta: { requiresAuth: true }
    },

    // Protected Routes - Meditate
    {
        path: '/meditate',
        name: 'meditate',
        component: MeditatePage,
        meta: { requiresAuth: true }
    },
    {
        path: '/meditate/audio/:id',
        name: 'meditate-audio',
        component: MeditateAudioPage,
        meta: { requiresAuth: true }
    },
    {
        path: '/meditate/:soundId',
        name: 'sound-detail',
        component: SoundDetailPage,
        meta: { requiresAuth: true }
    },

    // Protected Routes - Watch
    {
        path: '/watch/:id',
        name: 'watch',
        component: WatchPage,
        meta: { requiresAuth: true }
    },

    // Protected Routes - Experts
    {
        path: '/experts',
        name: 'experts',
        component: ExpertsPage,
        meta: { requiresAuth: true }
    },
    {
        path: '/experts/:id',
        name: 'expert-profile',
        component: ExpertProfilePage,
        meta: { requiresAuth: true }
    },

    // Protected Routes - User Profile
    {
        path: '/profile',
        name: 'profile',
        component: ProfilePage,
        meta: { requiresAuth: true }
    },
    {
        path: '/settings',
        name: 'settings',
        component: SettingsPage,
        meta: { requiresAuth: true }
    },
    {
        path: '/progress',
        name: 'progress',
        component: ProgressPage,
        meta: { requiresAuth: true }
    },

    // Protected Routes - Browse
    {
        path: '/browse',
        name: 'browse',
        component: BrowsePage,
        meta: { requiresAuth: true }
    },

    // Protected Routes - Search
    {
        path: '/search',
        name: 'search',
        component: SearchResults,
        meta: { requiresAuth: true }
    },

    // 404 Catch-all
    {
        path: '/:pathMatch(.*)*',
        name: 'not-found',
        component: NotFound
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            return { top: 0 }
        }
    }
})

// Navigation guards
router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore()

    // Wait for auth to be initialized
    if (authStore.loading) {
        await authStore.checkAuthStatus()
    }

    const isAuthenticated = authStore.isAuthenticated
    const requiresAuth = to.meta.requiresAuth
    const isPublicOnly = to.meta.publicOnly

    // If route requires auth and user is not authenticated
    if (requiresAuth && !isAuthenticated) {
        next({ name: 'login', query: { redirect: to.fullPath } })
        return
    }

    // If route is public only (like landing page) and user is authenticated
    if (isPublicOnly && isAuthenticated) {
        next({ name: 'browse' })
        return
    }

    next()
})

export default router
