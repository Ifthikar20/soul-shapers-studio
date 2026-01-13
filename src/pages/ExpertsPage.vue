<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { Input } from '@/components/ui/input'
import { 
  ArrowLeft,
  User,
  Search,
  Play,
  Star,
  Video
} from 'lucide-vue-next'

interface Expert {
  id: string
  name: string
  title: string
  photo_url?: string
  specialty: string
  video_count?: number
}

const router = useRouter()
const authStore = useAuthStore()

const experts = ref<Expert[]>([])
const loading = ref(true)
const searchQuery = ref('')

const user = computed(() => authStore.user)

const filteredExperts = computed(() => {
  if (!searchQuery.value) return experts.value
  const query = searchQuery.value.toLowerCase()
  return experts.value.filter(e => 
    e.name.toLowerCase().includes(query) ||
    e.specialty?.toLowerCase().includes(query)
  )
})

const fetchExperts = async () => {
  loading.value = true
  
  // Simulated experts data - in production this would come from an API
  experts.value = [
    { id: '1', name: 'Dr. Sarah Chen', title: 'Mindfulness Expert', photo_url: '', specialty: 'Meditation', video_count: 45 },
    { id: '2', name: 'Michael Torres', title: 'Life Coach', photo_url: '', specialty: 'Personal Growth', video_count: 32 },
    { id: '3', name: 'Emma Wilson', title: 'Wellness Coach', photo_url: '', specialty: 'Wellness', video_count: 28 },
    { id: '4', name: 'Dr. James Park', title: 'Neuroscientist', photo_url: '', specialty: 'Mind Training', video_count: 24 },
    { id: '5', name: 'Lisa Roberts', title: 'Yoga Instructor', photo_url: '', specialty: 'Yoga & Movement', video_count: 56 },
    { id: '6', name: 'David Martinez', title: 'Breathwork Expert', photo_url: '', specialty: 'Breathwork', video_count: 18 }
  ]
  
  loading.value = false
}

onMounted(() => {
  fetchExperts()
})
</script>

<template>
  <div class="min-h-screen bg-[#0a0a0a] text-white">
    <!-- Top Navigation -->
    <header class="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black to-transparent">
      <div class="flex items-center justify-between px-6 py-4">
        <div class="flex items-center gap-6">
          <button @click="router.back()" class="p-2 text-gray-400 hover:text-white">
            <ArrowLeft class="h-5 w-5" />
          </button>
          <RouterLink to="/" class="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            Soul Shapers
          </RouterLink>
        </div>
        
        <nav class="hidden md:flex items-center gap-6">
          <RouterLink to="/browse" class="text-sm text-gray-300 hover:text-white">Home</RouterLink>
          <RouterLink to="/audio" class="text-sm text-gray-300 hover:text-white">Audio</RouterLink>
          <RouterLink to="/meditate" class="text-sm text-gray-300 hover:text-white">Meditate</RouterLink>
          <RouterLink to="/experts" class="text-sm font-medium text-white">Experts</RouterLink>
        </nav>
        
        <div class="flex items-center gap-4">
          <div class="w-8 h-8 rounded bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <User class="h-4 w-4" />
          </div>
        </div>
      </div>
    </header>
    
    <main class="pt-20 px-6 md:px-12 pb-16">
      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-3xl md:text-4xl font-bold mb-2">Our Experts</h1>
        <p class="text-gray-400">Learn from world-class teachers and coaches</p>
      </div>
      
      <!-- Search -->
      <div class="relative max-w-md mb-8">
        <Search class="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
        <Input
          v-model="searchQuery"
          type="search"
          placeholder="Search experts..."
          class="pl-12 bg-gray-900/50 border-gray-800 text-white placeholder:text-gray-500"
        />
      </div>
      
      <!-- Loading -->
      <div v-if="loading" class="flex justify-center py-20">
        <div class="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
      
      <!-- Experts Grid -->
      <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        <RouterLink
          v-for="expert in filteredExperts"
          :key="expert.id"
          :to="`/experts/${expert.id}`"
          class="group text-center"
        >
          <!-- Avatar -->
          <div class="relative mx-auto w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden bg-gradient-to-br from-purple-500 to-pink-500 mb-4 group-hover:scale-105 transition-transform">
            <img
              v-if="expert.photo_url"
              :src="expert.photo_url"
              :alt="expert.name"
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full flex items-center justify-center">
              <User class="h-16 w-16 text-white/50" />
            </div>
            
            <!-- Hover Overlay -->
            <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Play class="h-10 w-10 text-white" />
            </div>
          </div>
          
          <!-- Info -->
          <h3 class="font-semibold text-white group-hover:text-purple-400 transition-colors">
            {{ expert.name }}
          </h3>
          <p class="text-sm text-gray-400 mb-2">{{ expert.title }}</p>
          
          <!-- Stats -->
          <div class="flex items-center justify-center gap-3 text-xs text-gray-500">
            <span class="flex items-center gap-1 px-2 py-1 rounded-full bg-gray-800">
              {{ expert.specialty }}
            </span>
            <span v-if="expert.video_count" class="flex items-center gap-1">
              <Video class="h-3 w-3" />
              {{ expert.video_count }}
            </span>
          </div>
        </RouterLink>
      </div>
      
      <!-- Empty State -->
      <div v-if="!loading && filteredExperts.length === 0" class="text-center py-20">
        <User class="h-16 w-16 text-gray-600 mx-auto mb-4" />
        <p class="text-gray-400 text-lg">No experts found</p>
      </div>
    </main>
  </div>
</template>
