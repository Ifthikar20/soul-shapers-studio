<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { contentService } from '@/services/content.service'
import { useAuthStore } from '@/stores/auth'
import { Button } from '@/components/ui/button'
import Hls from 'hls.js'
import {
  ArrowLeft,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  SkipBack,
  SkipForward,
  Settings,
  Loader2,
  Clock,
  User,
  Star,
  ChevronRight,
  List
} from 'lucide-vue-next'

interface ContentDetail {
  id: string
  title: string
  description: string
  thumbnail_url?: string
  video_url?: string
  videoUrl?: string
  hls_url?: string
  duration_seconds: number
  expert_name: string
  expert_title?: string
  category_name: string
  access_tier: 'free' | 'premium'
  series_id?: string
  episode_number?: number
  view_count?: number
}

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const content = ref<ContentDetail | null>(null)
const loading = ref(true)
const error = ref('')
const videoRef = ref<HTMLVideoElement | null>(null)
const containerRef = ref<HTMLElement | null>(null)
const hls = ref<Hls | null>(null)

// Player state
const isPlaying = ref(false)
const isMuted = ref(false)
const isFullscreen = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const volume = ref(1)
const showControls = ref(true)
const isBuffering = ref(false)
const showEpisodes = ref(false)
const relatedContent = ref<any[]>([])

let controlsTimeout: ReturnType<typeof setTimeout> | null = null
let progressInterval: ReturnType<typeof setInterval> | null = null

const progress = computed(() => {
  if (duration.value === 0) return 0
  return (currentTime.value / duration.value) * 100
})

const formattedCurrentTime = computed(() => formatTime(currentTime.value))
const formattedDuration = computed(() => formatTime(duration.value))

const formatTime = (seconds: number) => {
  const hrs = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)
  
  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const togglePlay = () => {
  if (!videoRef.value) return
  
  if (isPlaying.value) {
    videoRef.value.pause()
  } else {
    videoRef.value.play()
  }
}

const toggleMute = () => {
  if (!videoRef.value) return
  videoRef.value.muted = !videoRef.value.muted
  isMuted.value = videoRef.value.muted
}

const toggleFullscreen = async () => {
  if (!containerRef.value) return
  
  try {
    if (document.fullscreenElement) {
      await document.exitFullscreen()
      isFullscreen.value = false
    } else {
      await containerRef.value.requestFullscreen()
      isFullscreen.value = true
    }
  } catch (err) {
    console.error('Fullscreen error:', err)
  }
}

const seek = (event: MouseEvent) => {
  if (!videoRef.value) return
  const target = event.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  const percent = (event.clientX - rect.left) / rect.width
  videoRef.value.currentTime = percent * duration.value
}

const skipForward = () => {
  if (!videoRef.value) return
  videoRef.value.currentTime = Math.min(videoRef.value.currentTime + 10, duration.value)
}

const skipBackward = () => {
  if (!videoRef.value) return
  videoRef.value.currentTime = Math.max(videoRef.value.currentTime - 10, 0)
}

const handleMouseMove = () => {
  showControls.value = true
  
  if (controlsTimeout) {
    clearTimeout(controlsTimeout)
  }
  
  controlsTimeout = setTimeout(() => {
    if (isPlaying.value) {
      showControls.value = false
    }
  }, 3000)
}

const initializeHls = (url: string) => {
  if (!videoRef.value) return
  
  console.log('🎬 Initializing video with URL:', url)
  
  // Check if it's an HLS stream
  if (url.includes('.m3u8') && Hls.isSupported()) {
    hls.value = new Hls({
      enableWorker: true,
      lowLatencyMode: false,
    })
    
    hls.value.loadSource(url)
    hls.value.attachMedia(videoRef.value)
    
    hls.value.on(Hls.Events.MANIFEST_PARSED, () => {
      console.log('✅ HLS manifest parsed')
    })
    
    hls.value.on(Hls.Events.ERROR, (event, data) => {
      console.error('HLS error:', data)
      if (data.fatal) {
        error.value = 'Video playback error. Please try again.'
      }
    })
  } else if (videoRef.value.canPlayType('application/vnd.apple.mpegurl')) {
    // Safari native HLS support
    videoRef.value.src = url
  } else {
    // Regular video file
    videoRef.value.src = url
  }
}

const fetchContent = async () => {
  const id = route.params.id as string
  if (!id) {
    error.value = 'Content ID not provided'
    loading.value = false
    return
  }
  
  loading.value = true
  error.value = ''
  
  try {
    // Get video details
    const video = await contentService.getVideoByUUID(id)
    content.value = video as any
    
    // Get stream URL
    const streamData = await contentService.getVideoStreamData(id)
    
    if (streamData.streamUrl && videoRef.value) {
      initializeHls(streamData.streamUrl)
    } else if ((video as any).video_url || (video as any).videoUrl) {
      initializeHls((video as any).video_url || (video as any).videoUrl)
    }
    
    // Fetch related content
    const browseData = await contentService.getBrowseContent(undefined, 10)
    relatedContent.value = (browseData.content || []).filter((item: any) => item.id !== id)
    
  } catch (err: any) {
    error.value = err.message || 'Failed to load content'
    console.error('Watch error:', err)
  } finally {
    loading.value = false
  }
}

const setupVideoListeners = () => {
  if (!videoRef.value) return
  
  videoRef.value.addEventListener('play', () => { 
    isPlaying.value = true 
    isBuffering.value = false
  })
  videoRef.value.addEventListener('pause', () => { isPlaying.value = false })
  videoRef.value.addEventListener('timeupdate', () => { 
    currentTime.value = videoRef.value?.currentTime || 0 
  })
  videoRef.value.addEventListener('loadedmetadata', () => { 
    duration.value = videoRef.value?.duration || 0 
  })
  videoRef.value.addEventListener('volumechange', () => { 
    isMuted.value = videoRef.value?.muted || false
    volume.value = videoRef.value?.volume || 0
  })
  videoRef.value.addEventListener('waiting', () => { isBuffering.value = true })
  videoRef.value.addEventListener('canplay', () => { isBuffering.value = false })
}

const handleKeyPress = (event: KeyboardEvent) => {
  switch (event.key) {
    case ' ':
    case 'k':
      event.preventDefault()
      togglePlay()
      break
    case 'f':
      toggleFullscreen()
      break
    case 'm':
      toggleMute()
      break
    case 'ArrowLeft':
      skipBackward()
      break
    case 'ArrowRight':
      skipForward()
      break
  }
}

onMounted(() => {
  fetchContent()
  setupVideoListeners()
  document.addEventListener('keydown', handleKeyPress)
  
  document.addEventListener('fullscreenchange', () => {
    isFullscreen.value = !!document.fullscreenElement
  })
})

onUnmounted(() => {
  if (hls.value) {
    hls.value.destroy()
  }
  if (controlsTimeout) {
    clearTimeout(controlsTimeout)
  }
  if (progressInterval) {
    clearInterval(progressInterval)
  }
  document.removeEventListener('keydown', handleKeyPress)
})
</script>

<template>
  <div class="min-h-screen bg-black text-white" ref="containerRef">
    <!-- Loading State -->
    <div v-if="loading" class="min-h-screen flex items-center justify-center">
      <Loader2 class="h-12 w-12 animate-spin text-purple-500" />
    </div>
    
    <!-- Error State -->
    <div v-else-if="error" class="min-h-screen flex flex-col items-center justify-center px-4">
      <p class="text-red-400 mb-4 text-center">{{ error }}</p>
      <div class="flex gap-4">
        <Button variant="outline" @click="router.back()">Go Back</Button>
        <Button @click="fetchContent">Try Again</Button>
      </div>
    </div>
    
    <!-- Video Player -->
    <div v-else-if="content" class="relative">
      <!-- Back Button -->
      <button
        @click="router.back()"
        class="fixed top-6 left-6 z-50 p-3 rounded-full bg-black/50 hover:bg-black/70 transition-colors backdrop-blur"
        :class="{ 'opacity-0': !showControls }"
      >
        <ArrowLeft class="h-5 w-5" />
      </button>
      
      <!-- Video Container -->
      <div 
        class="relative w-full h-screen cursor-pointer"
        @mousemove="handleMouseMove"
        @click="togglePlay"
      >
        <video
          ref="videoRef"
          class="w-full h-full object-contain bg-black"
          :poster="content.thumbnail_url"
          playsinline
        />
        
        <!-- Buffering Indicator -->
        <div v-if="isBuffering" class="absolute inset-0 flex items-center justify-center">
          <Loader2 class="h-16 w-16 animate-spin text-white" />
        </div>
        
        <!-- Center Play Button (when paused) -->
        <Transition name="fade">
          <div 
            v-if="!isPlaying && !isBuffering && showControls"
            class="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div class="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Play class="h-12 w-12 text-white ml-2" />
            </div>
          </div>
        </Transition>
        
        <!-- Top Gradient -->
        <div 
          class="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/80 to-transparent pointer-events-none transition-opacity"
          :class="showControls ? 'opacity-100' : 'opacity-0'"
        />
        
        <!-- Bottom Controls -->
        <Transition name="fade">
          <div 
            v-if="showControls"
            class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-6"
            @click.stop
          >
            <!-- Progress Bar -->
            <div 
              class="relative h-1 bg-white/30 rounded-full mb-4 cursor-pointer group"
              @click="seek"
            >
              <div 
                class="absolute left-0 top-0 h-full bg-purple-500 rounded-full"
                :style="{ width: `${progress}%` }"
              />
              <div 
                class="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-opacity"
                :style="{ left: `calc(${progress}% - 8px)` }"
              />
            </div>
            
            <!-- Control Buttons -->
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <!-- Play/Pause -->
                <button @click="togglePlay" class="hover:scale-110 transition-transform">
                  <Play v-if="!isPlaying" class="h-8 w-8" />
                  <Pause v-else class="h-8 w-8" />
                </button>
                
                <!-- Skip Back -->
                <button @click="skipBackward" class="hover:scale-110 transition-transform">
                  <SkipBack class="h-6 w-6" />
                </button>
                
                <!-- Skip Forward -->
                <button @click="skipForward" class="hover:scale-110 transition-transform">
                  <SkipForward class="h-6 w-6" />
                </button>
                
                <!-- Volume -->
                <button @click="toggleMute" class="hover:scale-110 transition-transform">
                  <VolumeX v-if="isMuted" class="h-6 w-6" />
                  <Volume2 v-else class="h-6 w-6" />
                </button>
                
                <!-- Time -->
                <span class="text-sm font-mono">
                  {{ formattedCurrentTime }} / {{ formattedDuration }}
                </span>
              </div>
              
              <!-- Title & Info -->
              <div class="hidden md:block flex-1 text-center px-8">
                <h1 class="text-lg font-semibold truncate">{{ content.title }}</h1>
                <p class="text-sm text-gray-400">{{ content.expert_name }}</p>
              </div>
              
              <div class="flex items-center gap-4">
                <!-- Episodes -->
                <button 
                  v-if="content.series_id"
                  @click="showEpisodes = true" 
                  class="hover:scale-110 transition-transform"
                >
                  <List class="h-6 w-6" />
                </button>
                
                <!-- Settings -->
                <button class="hover:scale-110 transition-transform">
                  <Settings class="h-6 w-6" />
                </button>
                
                <!-- Fullscreen -->
                <button @click="toggleFullscreen" class="hover:scale-110 transition-transform">
                  <Minimize v-if="isFullscreen" class="h-6 w-6" />
                  <Maximize v-else class="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </div>
      
      <!-- Video Info (below player when not fullscreen) -->
      <div v-if="!isFullscreen" class="px-6 md:px-12 py-8 bg-[#0a0a0a]">
        <div class="max-w-4xl">
          <h1 class="text-2xl md:text-3xl font-bold mb-2">{{ content.title }}</h1>
          
          <div class="flex items-center gap-4 text-sm text-gray-400 mb-4">
            <span class="flex items-center gap-1">
              <User class="h-4 w-4" />
              {{ content.expert_name }}
            </span>
            <span class="flex items-center gap-1">
              <Clock class="h-4 w-4" />
              {{ formatTime(content.duration_seconds || 0) }}
            </span>
            <span class="px-2 py-0.5 rounded bg-gray-800">
              {{ content.category_name }}
            </span>
          </div>
          
          <p class="text-gray-300 leading-relaxed">
            {{ content.description }}
          </p>
        </div>
        
        <!-- Related Content -->
        <div v-if="relatedContent.length > 0" class="mt-12">
          <h2 class="text-xl font-semibold mb-4">More Like This</h2>
          <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <RouterLink 
              v-for="item in relatedContent.slice(0, 5)" 
              :key="item.id"
              :to="`/watch/${item.id}`"
              class="group"
            >
              <div class="aspect-video rounded-lg overflow-hidden bg-gray-800 mb-2">
                <img 
                  v-if="item.thumbnail_url"
                  :src="item.thumbnail_url"
                  :alt="item.title"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <h3 class="text-sm font-medium line-clamp-1 group-hover:text-purple-400 transition-colors">
                {{ item.title }}
              </h3>
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
