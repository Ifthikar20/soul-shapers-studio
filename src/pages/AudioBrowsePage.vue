<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { contentService } from '@/services/content.service'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Search, 
  Bell, 
  User, 
  Play, 
  Clock,
  Headphones,
  ChevronLeft,
  ChevronRight,
  ArrowLeft
} from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()

const audioContent = ref<any[]>([])
const categories = ref<any[]>([])
const loading = ref(true)
const error = ref('')
const searchQuery = ref('')

const user = computed(() => authStore.user)

const filteredContent = computed(() => {
  if (!searchQuery.value) return audioContent.value
  const query = searchQuery.value.toLowerCase()
  return audioContent.value.filter(item =>
    item.title?.toLowerCase().includes(query) ||
    item.expert_name?.toLowerCase().includes(query)
  )
})

const formatDuration = (seconds: number) => {
  if (!seconds) return ''
  const mins = Math.floor(seconds / 60)
  return `${mins}m`
}

const fetchAudioContent = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const content = await contentService.getAudioContent(undefined, 50)
    audioContent.value = content || []
    
    // Group by category
    const catResponse = await contentService.getCategories()
    categories.value = catResponse.categories || []
  } catch (err: any) {
    error.value = err.message || 'Failed to load audio content'
  } finally {
    loading.value = false
  }
}

const handleLogout = async () => {
  await authStore.logout()
  router.push('/')
}

onMounted(() => {
  fetchAudioContent()
})
</script>

<template>
  <div class="min-h-screen bg-[#0a0a0a] text-white">
    <!-- Top Navigation -->
    <header class="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black to-transparent">
      <div class="flex items-center justify-between px-6 py-4">
        <!-- Left: Back & Logo -->
        <div class="flex items-center gap-6">
          <button @click="router.back()" class="p-2 text-gray-400 hover:text-white">
            <ArrowLeft class="h-5 w-5" />
          </button>
          <RouterLink to="/" class="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            Soul Shapers
          </RouterLink>
        </div>
        
        <!-- Center: Nav -->
        <nav class="hidden md:flex items-center gap-6">
          <RouterLink to="/browse" class="text-sm text-gray-300 hover:text-white">Home</RouterLink>
          <RouterLink to="/audio" class="text-sm font-medium text-white">Audio</RouterLink>
          <RouterLink to="/meditate" class="text-sm text-gray-300 hover:text-white">Meditate</RouterLink>
          <RouterLink to="/experts" class="text-sm text-gray-300 hover:text-white">Experts</RouterLink>
        </nav>
        
        <!-- Right: Actions -->
        <div class="flex items-center gap-4">
          <div class="relative group">
            <button class="flex items-center gap-2">
              <div class="w-8 h-8 rounded bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <User class="h-4 w-4" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
    
    <main class="pt-20 px-6 md:px-12 pb-16">
      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-3xl md:text-4xl font-bold mb-2">Audio Library</h1>
        <p class="text-gray-400">Guided meditations and audio coaching</p>
      </div>
      
      <!-- Search -->
      <div class="relative max-w-md mb-8">
        <Search class="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
        <Input
          v-model="searchQuery"
          type="search"
          placeholder="Search audio..."
          class="pl-12 bg-gray-900/50 border-gray-800 text-white placeholder:text-gray-500"
        />
      </div>
      
      <!-- Loading -->
      <div v-if="loading" class="flex justify-center py-20">
        <div class="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
      
      <!-- Error -->
      <div v-else-if="error" class="text-center py-20">
        <p class="text-red-400 mb-4">{{ error }}</p>
        <Button @click="fetchAudioContent">Try Again</Button>
      </div>
      
      <!-- Content Grid -->
      <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        <RouterLink
          v-for="item in filteredContent"
          :key="item.id"
          :to="`/audio/${item.id}`"
          class="group"
        >
          <!-- Card -->
          <div class="relative aspect-square rounded-xl overflow-hidden bg-gray-800 mb-3">
            <img
              v-if="item.thumbnail_url"
              :src="item.thumbnail_url"
              :alt="item.title"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div v-else class="w-full h-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
              <Headphones class="h-16 w-16 text-white/50" />
            </div>
            
            <!-- Play Overlay -->
            <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div class="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-lg">
                <Play class="h-7 w-7 text-black ml-0.5" />
              </div>
            </div>
            
            <!-- Duration Badge -->
            <div v-if="item.duration_seconds" class="absolute bottom-3 right-3 px-2 py-1 bg-black/80 rounded-full text-xs flex items-center gap-1">
              <Clock class="h-3 w-3" />
              {{ formatDuration(item.duration_seconds) }}
            </div>
            
            <!-- Premium Badge -->
            <div v-if="item.access_tier === 'premium'" class="absolute top-3 right-3 px-2 py-1 bg-yellow-500 rounded text-xs text-black font-medium">
              Premium
            </div>
          </div>
          
          <!-- Info -->
          <h3 class="font-semibold text-white line-clamp-1 group-hover:text-purple-400 transition-colors">
            {{ item.title }}
          </h3>
          <p class="text-sm text-gray-400 line-clamp-1">
            {{ item.expert_name }}
          </p>
        </RouterLink>
      </div>
      
      <!-- Empty State -->
      <div v-if="!loading && !error && filteredContent.length === 0" class="text-center py-20">
        <Headphones class="h-16 w-16 text-gray-600 mx-auto mb-4" />
        <p class="text-gray-400 text-lg">No audio content found</p>
        <p class="text-gray-500 text-sm mt-2">Try adjusting your search or check back later</p>
      </div>
    </main>
  </div>
</template>
