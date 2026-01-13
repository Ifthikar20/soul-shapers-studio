<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { contentService } from '@/services/content.service'
import { 
  Play, 
  Search,
  ChevronRight,
  User,
  Bell,
  Download,
  MoreHorizontal,
  Bookmark
} from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()

const featuredContent = ref<any>(null)
const popularContent = ref<any[]>([])
const moreContent = ref<any[]>([])
const loading = ref(true)

const user = computed(() => authStore.user)
const isAuthenticated = computed(() => authStore.isAuthenticated)

const fetchContent = async () => {
  loading.value = true
  try {
    const response = await contentService.getBrowseContent(undefined, 30)
    const content = response.content || []
    
    // Featured content (first one with thumbnail)
    featuredContent.value = content.find((c: any) => c.thumbnail_url) || content[0]
    
    // Popular content
    popularContent.value = content.slice(0, 3)
    
    // More content
    moreContent.value = content.slice(3, 9)
  } catch (err) {
    console.error('Failed to fetch content:', err)
  } finally {
    loading.value = false
  }
}

const formatViews = (count: number) => {
  if (!count) return '0'
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`
  if (count >= 1000) return `${Math.floor(count / 1000)}K`
  return count.toLocaleString()
}

onMounted(() => {
  fetchContent()
})
</script>

<template>
  <div class="min-h-screen bg-[#0f0a1f] text-white">
    <!-- Top Navigation -->
    <header class="sticky top-0 z-40 bg-[#0f0a1f]/90 backdrop-blur-lg border-b border-white/5">
      <div class="max-w-4xl mx-auto flex items-center justify-between px-6 py-4">
        <!-- Logo -->
        <RouterLink to="/" class="flex items-center gap-2">
          <div class="w-9 h-9 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <span class="text-white font-bold text-sm">S</span>
          </div>
          <span class="text-lg font-bold">SOUL</span>
        </RouterLink>
        
        <!-- Search Bar -->
        <div class="hidden md:flex relative flex-1 max-w-sm mx-8">
          <Search class="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input
            type="search"
            placeholder="Search for films, directors, or actors..."
            class="w-full pl-11 pr-4 py-2.5 rounded-full text-sm bg-white/5 border border-white/10 placeholder:text-gray-500 focus:border-purple-500 focus:outline-none transition-colors"
          />
        </div>
        
        <!-- Right Actions -->
        <div class="flex items-center gap-3">
          <template v-if="isAuthenticated">
            <button class="p-2.5 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
              <Bell class="h-5 w-5 text-gray-400" />
            </button>
            <RouterLink to="/profile" class="w-10 h-10 rounded-full overflow-hidden ring-2 ring-purple-500">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
                alt="Profile"
                class="w-full h-full object-cover"
              />
            </RouterLink>
          </template>
          
          <template v-else>
            <RouterLink to="/login" class="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors">
              Sign In
            </RouterLink>
            <RouterLink to="/register" class="px-5 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 transition-opacity">
              Get Started
            </RouterLink>
          </template>
        </div>
      </div>
    </header>
    
    <!-- Main Content - LARGE MARGINS -->
    <main class="max-w-4xl mx-auto px-6 py-8">
      <!-- Loading -->
      <div v-if="loading" class="flex items-center justify-center min-h-[60vh]">
        <div class="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
      
      <div v-else>
        <!-- Favorites Section -->
        <section class="mb-10">
          <h2 class="text-lg font-bold mb-4">Favorites</h2>
          <div class="flex items-center gap-4 p-5 bg-white/5 rounded-2xl border border-white/5">
            <div class="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
              <Bookmark class="h-5 w-5 text-gray-500" />
            </div>
            <div>
              <p class="font-semibold text-white">Nothing to show here yet!</p>
              <p class="text-sm text-gray-400">Start exploring our content and save your favorites for later.</p>
            </div>
          </div>
        </section>
        
        <!-- Popular Now Section -->
        <section class="mb-10">
          <div class="flex items-center justify-between mb-2">
            <h2 class="text-lg font-bold">Popular now</h2>
            <RouterLink to="/profile" class="text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors">
              Update profile
            </RouterLink>
          </div>
          <p class="text-sm text-gray-500 mb-5">Update your profile to get personalized program recommendations.</p>
          
          <!-- Content Cards -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
            <RouterLink
              v-for="item in popularContent"
              :key="item.id"
              :to="`/watch/${item.id}`"
              class="group"
            >
              <div class="relative rounded-2xl overflow-hidden aspect-video mb-3">
                <img 
                  :src="item.thumbnail_url || `https://picsum.photos/seed/${item.id}/600/340`"
                  :alt="item.title"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                <!-- Play Overlay -->
                <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div class="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-lg">
                    <Play class="h-6 w-6 text-black fill-black ml-1" />
                  </div>
                </div>
              </div>
              
              <h3 class="font-semibold text-white mb-1 line-clamp-1">{{ item.title }}</h3>
              <div class="flex items-center justify-between text-sm text-gray-400">
                <span>{{ item.expert_name || 'Dr. Emily Rodriguez' }}</span>
                <span class="flex items-center gap-1">
                  <User class="h-3.5 w-3.5" />
                  {{ formatViews(Math.floor(Math.random() * 2000000) + 100000) }}
                </span>
              </div>
            </RouterLink>
          </div>
        </section>
        
        <!-- Featured Banner -->
        <section v-if="featuredContent" class="mb-10">
          <div class="relative rounded-3xl overflow-hidden min-h-[320px]">
            <!-- Banner Image -->
            <img 
              :src="featuredContent.thumbnail_url || 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=1200&h=600&fit=crop'"
              :alt="featuredContent.title"
              class="absolute inset-0 w-full h-full object-cover"
            />
            
            <!-- Gradient Overlay -->
            <div class="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            <!-- Content -->
            <div class="relative z-10 flex flex-col justify-end p-8 min-h-[320px]">
              <div class="max-w-lg">
                <!-- Badge -->
                <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm w-fit mb-4">
                  <span class="text-base">🔥</span>
                  <span class="text-sm font-medium text-white">Now Trending</span>
                </div>
                
                <h2 class="text-2xl md:text-3xl font-bold text-white mb-2">
                  {{ featuredContent.title }}
                </h2>
                
                <p class="text-white/70 text-sm mb-5 line-clamp-2">
                  {{ featuredContent.description || 'How the Noise of birds and chirping can heal.' }}
                </p>
                
                <div class="flex items-center gap-3">
                  <RouterLink 
                    :to="`/watch/${featuredContent.id}`"
                    class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black font-semibold text-sm hover:bg-gray-100 transition-colors"
                  >
                    <Play class="h-4 w-4 fill-black" />
                    Watch Now
                  </RouterLink>
                  <button class="p-2.5 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors">
                    <Download class="h-4 w-4 text-white" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <!-- More for You -->
        <section class="mb-10">
          <div class="flex items-center justify-between mb-5">
            <h2 class="text-lg font-bold">More for you</h2>
            <RouterLink to="/browse" class="text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors">
              See All
            </RouterLink>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
            <RouterLink
              v-for="item in moreContent.slice(0, 3)"
              :key="item.id"
              :to="`/watch/${item.id}`"
              class="group"
            >
              <div class="relative rounded-2xl overflow-hidden aspect-video mb-3">
                <img 
                  :src="item.thumbnail_url || `https://picsum.photos/seed/${item.id + 100}/600/340`"
                  :alt="item.title"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div class="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-lg">
                    <Play class="h-6 w-6 text-black fill-black ml-1" />
                  </div>
                </div>
              </div>
              
              <h3 class="font-semibold text-white mb-1 line-clamp-1">{{ item.title }}</h3>
              <div class="flex items-center justify-between text-sm text-gray-400">
                <span>{{ item.expert_name || 'Dr. Sarah Thompson' }}</span>
                <span class="flex items-center gap-1">
                  <User class="h-3.5 w-3.5" />
                  {{ formatViews(Math.floor(Math.random() * 2000000) + 100000) }}
                </span>
              </div>
            </RouterLink>
          </div>
        </section>
        
        <!-- Navigation Links -->
        <section class="flex items-center justify-center gap-5 py-8 border-t border-white/10">
          <RouterLink 
            to="/browse" 
            class="flex items-center gap-2 px-7 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:opacity-90 transition-opacity"
          >
            <span>Explore</span>
            <ChevronRight class="h-5 w-5" />
          </RouterLink>
          <RouterLink 
            to="/meditate" 
            class="flex items-center gap-2 px-7 py-3 rounded-full bg-white/10 text-white font-semibold hover:bg-white/15 transition-colors"
          >
            <span>Meditate</span>
            <ChevronRight class="h-5 w-5" />
          </RouterLink>
        </section>
      </div>
    </main>
  </div>
</template>

<style scoped>
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
