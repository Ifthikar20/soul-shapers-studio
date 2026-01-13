<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useThemeStore } from '@/stores/theme'
import { contentService } from '@/services/content.service'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Play, 
  Search, 
  Bell, 
  User, 
  ChevronRight,
  Download,
  MoreHorizontal,
  Moon,
  Sun,
  Settings,
  LogOut
} from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()
const themeStore = useThemeStore()

// Data state
const featuredContent = ref<any>(null)
const sleepMeditations = ref<any[]>([])
const focusMeditations = ref<any[]>([])
const loading = ref(true)
const error = ref('')
const searchQuery = ref('')
const showProfileDropdown = ref(false)

// User state
const user = computed(() => authStore.user)
const isDarkMode = computed(() => themeStore.mode === 'dark')

// Fallback images for cards - calming/meditation themed
const cardImages = [
  'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&h=340&fit=crop',
  'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=600&h=340&fit=crop',
  'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=600&h=340&fit=crop',
  'https://images.unsplash.com/photo-1528715471579-d1bcf0ba5e83?w=600&h=340&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=340&fit=crop',
  'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=600&h=340&fit=crop'
]

const posterImages = [
  'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1528715471579-d1bcf0ba5e83?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop'
]

// Hero banner fallback image - meditation themed
const heroBannerImage = 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1600&h=900&fit=crop&q=80'

// Fetch all content
const fetchContent = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const response = await contentService.getBrowseContent(undefined, 50)
    const allContent = response.content || []
    
    featuredContent.value = allContent.find((item: any) => item.featured) || allContent[0]
    sleepMeditations.value = allContent.slice(0, 5)
    focusMeditations.value = allContent.slice(4, 9)
    
  } catch (err: any) {
    error.value = err.message || 'Failed to load content'
  } finally {
    loading.value = false
  }
}

const formatDuration = (seconds: number) => {
  if (!seconds) return '15min'
  const mins = Math.floor(seconds / 60)
  return `${mins}min`
}

const getCardImage = (index: number, thumbnailUrl?: string) => {
  if (thumbnailUrl) return thumbnailUrl
  return cardImages[index % cardImages.length]
}

const getPosterImage = (index: number, thumbnailUrl?: string) => {
  if (thumbnailUrl) return thumbnailUrl
  return posterImages[index % posterImages.length]
}

const handleLogout = async () => {
  await authStore.logout()
  router.push('/')
}

const toggleTheme = () => {
  themeStore.toggleMode()
}

// Close dropdown when clicking outside
const closeDropdown = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  if (!target.closest('.profile-dropdown-container')) {
    showProfileDropdown.value = false
  }
}

onMounted(() => {
  fetchContent()
  document.addEventListener('click', closeDropdown)
})
</script>

<template>
  <div class="min-h-screen bg-white text-gray-900">
    <!-- Top Navigation Bar -->
    <header class="fixed top-0 left-0 right-0 z-50">
      <div class="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
        <!-- Left: Navigation Tabs + Search -->
        <div class="flex-1 max-w-md">
          <div class="relative">
            <!-- Navigation Tabs -->
            <div class="flex items-center gap-6 mr-8">
              <RouterLink 
                to="/browse" 
                class="text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors"
              >
                Explore
              </RouterLink>
              <RouterLink 
                to="/meditate" 
                class="text-sm font-semibold text-gray-900 border-b-2 border-purple-500 pb-1"
              >
                Meditate
              </RouterLink>
            </div>
            
            <Search class="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 hidden" />
            <Input
              v-model="searchQuery"
              type="search"
              placeholder="Search meditations..."
              class="w-full pl-11 pr-4 py-3 bg-[#1a1625]/90 backdrop-blur-xl border-0 rounded-full text-sm placeholder:text-gray-500 text-white hidden"
            />
          </div>
        </div>
        
        <!-- Right: Actions -->
        <div class="flex items-center gap-4">
          <button class="p-2.5 rounded-full bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors">
            <Bell class="h-5 w-5" />
          </button>
          
          <!-- Profile Dropdown -->
          <div class="relative profile-dropdown-container">
            <button 
              @click.stop="showProfileDropdown = !showProfileDropdown"
              class="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center overflow-hidden ring-2 ring-white/20"
            >
              <User class="h-5 w-5 text-white" />
            </button>
            
            <!-- Dropdown Menu -->
            <Transition name="dropdown">
              <div 
                v-if="showProfileDropdown"
                class="absolute right-0 top-14 w-64 rounded-2xl shadow-2xl border bg-white border-gray-200 overflow-hidden z-50"
              >
                <!-- User Info -->
                <div class="p-4 border-b border-gray-200">
                  <p class="font-semibold text-gray-900">{{ user?.name || 'User' }}</p>
                  <p class="text-sm text-gray-400">{{ user?.email }}</p>
                </div>
                
                <!-- Theme Toggle -->
                <div class="p-3 border-b border-gray-200">
                  <div class="flex items-center justify-between px-2">
                    <div class="flex items-center gap-3">
                      <Moon v-if="isDarkMode" class="h-5 w-5 text-purple-400" />
                      <Sun v-else class="h-5 w-5 text-amber-500" />
                      <span class="text-sm font-medium">{{ isDarkMode ? 'Dark Mode' : 'Light Mode' }}</span>
                    </div>
                    <button 
                      @click="toggleTheme"
                      class="relative w-12 h-6 rounded-full transition-colors"
                      :class="isDarkMode ? 'bg-purple-500' : 'bg-gray-600'"
                    >
                      <span 
                        class="absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform"
                        :class="isDarkMode ? 'left-7' : 'left-1'"
                      />
                    </button>
                  </div>
                </div>
                
                <!-- Menu Items -->
                <div class="py-2">
                  <RouterLink 
                    to="/profile" 
                    class="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-gray-700"
                  >
                    <User class="h-4 w-4 text-gray-400" />
                    <span class="text-sm">My Profile</span>
                  </RouterLink>
                  <RouterLink 
                    to="/settings" 
                    class="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-gray-700"
                  >
                    <Settings class="h-4 w-4 text-gray-400" />
                    <span class="text-sm">Settings</span>
                  </RouterLink>
                  <button 
                    @click="handleLogout"
                    class="w-full flex items-center gap-3 px-4 py-2.5 text-red-500 hover:bg-gray-50 transition-colors"
                  >
                    <LogOut class="h-4 w-4" />
                    <span class="text-sm">Sign Out</span>
                  </button>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </header>
    
    <!-- Content -->
    <main>
      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center min-h-screen">
        <div class="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
      
      <!-- Error State -->
      <div v-else-if="error" class="flex flex-col items-center justify-center min-h-screen">
        <p class="text-red-400 mb-4">{{ error }}</p>
        <Button @click="fetchContent">Try Again</Button>
      </div>
      
      <!-- Main Content -->
      <div v-else>
        <!-- Hero Banner Section - Full Width -->
        <section class="relative min-h-[75vh] flex items-end">
          <!-- Background Image -->
          <div class="absolute inset-0">
            <img 
              :src="featuredContent?.thumbnail_url || heroBannerImage"
              :alt="featuredContent?.title"
              class="w-full h-full object-cover"
            />
            <!-- Gradient Overlays -->
            <div class="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          </div>
          
          <!-- Content Overlay with same margins -->
          <div class="relative z-10 w-full">
            <div class="max-w-4xl mx-auto px-6 pb-12">
              <!-- Badges -->
              <div class="flex items-center gap-3 mb-4">
                <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/90 text-white text-xs font-semibold">
                  <Moon class="h-3 w-3" />
                  Featured Meditation
                </span>
                <span class="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur text-white text-xs font-medium">
                  Sleep
                </span>
                <span class="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur text-white text-xs font-medium">
                  Relaxation
                </span>
              </div>
              
              <!-- Title -->
              <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4 max-w-xl">
                {{ featuredContent?.title || 'Deep Sleep Journey' }}
              </h1>
              
              <!-- Description -->
              <p class="text-gray-300 text-base max-w-lg mb-6 line-clamp-2">
                {{ featuredContent?.description || 'A calming guided meditation to help you drift into peaceful, restorative sleep. Let go of the day and embrace tranquility.' }}
              </p>
              
              <!-- Action Buttons -->
              <div class="flex items-center gap-4">
                <RouterLink 
                  :to="`/meditate/audio/${featuredContent?.id || '1'}`"
                  class="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-full font-semibold hover:bg-gray-100 transition-colors"
                >
                  <Play class="h-5 w-5 fill-black" />
                  Start Meditation
                </RouterLink>
                <button class="p-3 rounded-full bg-white/10 backdrop-blur hover:bg-white/20 transition-colors">
                  <Download class="h-5 w-5" />
                </button>
                <button class="p-3 rounded-full bg-white/10 backdrop-blur hover:bg-white/20 transition-colors">
                  <MoreHorizontal class="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </section>
        
        <!-- Sleep & Relaxation Section - Same margins as home -->
        <section class="max-w-4xl mx-auto px-6 py-10">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-lg font-bold text-gray-900">Sleep & Relaxation</h2>
            <button class="text-sm text-purple-600 hover:text-purple-700 transition-colors flex items-center gap-1">
              See All
              <ChevronRight class="h-4 w-4" />
            </button>
          </div>
          
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <RouterLink
              v-for="(item, index) in sleepMeditations"
              :key="item.id"
              :to="`/meditate/audio/${item.id}`"
              class="group"
            >
              <div class="relative rounded-2xl overflow-hidden bg-gray-100 transition-transform group-hover:-translate-y-1 group-hover:shadow-xl">
                <div class="relative aspect-video">
                  <img
                    :src="getCardImage(index, item.thumbnail_url)"
                    :alt="item.title"
                    class="w-full h-full object-cover"
                  />
                  
                  <!-- Hover Play Button -->
                  <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div class="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                      <Play class="h-5 w-5 text-black fill-black ml-0.5" />
                    </div>
                  </div>
                  
                  <!-- Duration Badge -->
                  <div class="absolute bottom-3 right-3">
                    <span class="px-2 py-1 rounded bg-black/60 backdrop-blur text-xs text-gray-300">
                      {{ formatDuration(item.duration_seconds) }}
                    </span>
                  </div>
                </div>
              </div>
              
              <div class="mt-3">
                <h3 class="text-sm font-medium text-gray-900 line-clamp-1 group-hover:text-purple-600 transition-colors">
                  {{ item.title }}
                </h3>
                <p class="text-xs text-gray-500 mt-1">{{ item.expert_name || 'Guided' }}</p>
              </div>
            </RouterLink>
          </div>
        </section>
        
        <!-- Focus & Mindfulness Section - Same margins as home -->
        <section class="max-w-4xl mx-auto px-6 py-10">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-lg font-bold text-gray-900">Focus & Mindfulness</h2>
            <button class="text-sm text-purple-600 hover:text-purple-700 transition-colors flex items-center gap-1">
              See All
              <ChevronRight class="h-4 w-4" />
            </button>
          </div>
          
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <RouterLink
              v-for="(item, index) in focusMeditations"
              :key="item.id"
              :to="`/meditate/audio/${item.id}`"
              class="group"
            >
              <div class="relative rounded-2xl overflow-hidden bg-gray-100 transition-transform group-hover:-translate-y-1 group-hover:shadow-xl">
                <div class="relative aspect-[2/3]">
                  <img
                    :src="getPosterImage(index, item.thumbnail_url)"
                    :alt="item.title"
                    class="w-full h-full object-cover"
                  />
                  
                  <!-- Hover Play Button -->
                  <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div class="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                      <Play class="h-5 w-5 text-black fill-black ml-0.5" />
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="mt-3">
                <h3 class="text-sm font-medium text-gray-900 line-clamp-1 group-hover:text-purple-600 transition-colors">
                  {{ item.title }}
                </h3>
              </div>
            </RouterLink>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
