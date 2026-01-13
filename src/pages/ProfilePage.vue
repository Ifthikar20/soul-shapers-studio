<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useThemeStore } from '@/stores/theme'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  ArrowLeft,
  User,
  Mail,
  Calendar,
  Shield,
  Award,
  Clock,
  TrendingUp,
  Edit,
  Camera,
  Moon,
  Sun,
  Settings,
  LogOut,
  Bell
} from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()
const themeStore = useThemeStore()

const user = computed(() => authStore.user)
const isDarkMode = computed(() => themeStore.mode === 'dark')
const showProfileDropdown = ref(false)

// Mock stats
const stats = ref({
  videosWatched: 42,
  hoursLearned: 18,
  streakDays: 7,
  achievements: 12
})

const toggleTheme = () => {
  themeStore.toggleMode()
}

const handleLogout = async () => {
  await authStore.logout()
  router.push('/')
}
</script>

<template>
  <div 
    class="min-h-screen transition-colors duration-300"
    :class="isDarkMode ? 'bg-[#1a1625] text-white' : 'bg-gray-50 text-gray-900'"
  >
    <!-- Top Navigation -->
    <header 
      class="sticky top-0 z-40 backdrop-blur-lg border-b transition-colors"
      :class="isDarkMode ? 'bg-[#1a1625]/80 border-white/5' : 'bg-white/80 border-gray-200'"
    >
      <div class="flex items-center justify-between px-8 py-4">
        <div class="flex items-center gap-6">
          <button @click="router.back()" class="p-2 rounded-xl transition-colors" :class="isDarkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'">
            <ArrowLeft class="h-5 w-5" />
          </button>
          <RouterLink to="/" class="flex items-center gap-2">
            <div class="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <span class="text-white font-bold text-lg">S</span>
            </div>
            <span class="text-xl font-bold">SOUL</span>
          </RouterLink>
        </div>
        
        <div class="flex items-center gap-4">
          <button 
            class="p-2.5 rounded-xl transition-colors"
            :class="isDarkMode ? 'bg-[#2a2438] text-gray-400 hover:text-white' : 'bg-gray-100 text-gray-500 hover:text-gray-900'"
          >
            <Bell class="h-5 w-5" />
          </button>
          
          <!-- Profile Dropdown -->
          <div class="relative">
            <button 
              @click="showProfileDropdown = !showProfileDropdown"
              class="flex items-center gap-3"
            >
              <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <User class="h-5 w-5 text-white" />
              </div>
            </button>
            
            <Transition name="dropdown">
              <div 
                v-if="showProfileDropdown"
                class="absolute right-0 top-14 w-64 rounded-2xl shadow-2xl border overflow-hidden z-50"
                :class="isDarkMode ? 'bg-[#2a2438] border-white/10' : 'bg-white border-gray-200'"
              >
                <div class="p-4 border-b" :class="isDarkMode ? 'border-white/10' : 'border-gray-100'">
                  <p class="font-semibold">{{ user?.name || 'User' }}</p>
                  <p class="text-sm" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">{{ user?.email }}</p>
                </div>
                
                <div class="p-3 border-b" :class="isDarkMode ? 'border-white/10' : 'border-gray-100'">
                  <div class="flex items-center justify-between px-2">
                    <div class="flex items-center gap-3">
                      <Moon v-if="isDarkMode" class="h-5 w-5 text-purple-400" />
                      <Sun v-else class="h-5 w-5 text-amber-500" />
                      <span class="text-sm font-medium">{{ isDarkMode ? 'Dark Mode' : 'Light Mode' }}</span>
                    </div>
                    <button 
                      @click="toggleTheme"
                      class="relative w-12 h-6 rounded-full transition-colors"
                      :class="isDarkMode ? 'bg-purple-500' : 'bg-gray-300'"
                    >
                      <span 
                        class="absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform"
                        :class="isDarkMode ? 'left-7' : 'left-1'"
                      />
                    </button>
                  </div>
                </div>
                
                <div class="py-2">
                  <RouterLink to="/profile" class="flex items-center gap-3 px-4 py-2.5" :class="isDarkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50'">
                    <User class="h-4 w-4" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'" />
                    <span class="text-sm">My Profile</span>
                  </RouterLink>
                  <RouterLink to="/settings" class="flex items-center gap-3 px-4 py-2.5" :class="isDarkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50'">
                    <Settings class="h-4 w-4" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'" />
                    <span class="text-sm">Settings</span>
                  </RouterLink>
                  <button @click="handleLogout" class="w-full flex items-center gap-3 px-4 py-2.5 text-red-400" :class="isDarkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50'">
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
    
    <main class="max-w-4xl mx-auto px-6 py-8">
      <!-- Profile Header -->
      <div class="text-center mb-10">
        <!-- Avatar -->
        <div class="relative inline-block mb-4">
          <div class="w-28 h-28 rounded-3xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <User class="h-14 w-14 text-white" />
          </div>
          <button 
            class="absolute -bottom-2 -right-2 p-2 rounded-xl shadow-lg"
            :class="isDarkMode ? 'bg-[#2a2438]' : 'bg-white'"
          >
            <Camera class="h-4 w-4" />
          </button>
        </div>
        
        <h1 class="text-2xl font-bold mb-1">{{ user?.name || 'User' }}</h1>
        <p :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">{{ user?.email }}</p>
        
        <RouterLink to="/settings">
          <Button class="mt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl">
            <Edit class="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        </RouterLink>
      </div>
      
      <!-- Stats Grid -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <div 
          class="p-5 rounded-2xl text-center"
          :class="isDarkMode ? 'bg-[#2a2438]' : 'bg-white shadow'"
        >
          <TrendingUp class="h-6 w-6 mx-auto mb-2 text-purple-400" />
          <p class="text-2xl font-bold">{{ stats.videosWatched }}</p>
          <p class="text-sm" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">Videos Watched</p>
        </div>
        <div 
          class="p-5 rounded-2xl text-center"
          :class="isDarkMode ? 'bg-[#2a2438]' : 'bg-white shadow'"
        >
          <Clock class="h-6 w-6 mx-auto mb-2 text-pink-400" />
          <p class="text-2xl font-bold">{{ stats.hoursLearned }}h</p>
          <p class="text-sm" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">Hours Learned</p>
        </div>
        <div 
          class="p-5 rounded-2xl text-center"
          :class="isDarkMode ? 'bg-[#2a2438]' : 'bg-white shadow'"
        >
          <Award class="h-6 w-6 mx-auto mb-2 text-amber-400" />
          <p class="text-2xl font-bold">{{ stats.streakDays }}</p>
          <p class="text-sm" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">Day Streak</p>
        </div>
        <div 
          class="p-5 rounded-2xl text-center"
          :class="isDarkMode ? 'bg-[#2a2438]' : 'bg-white shadow'"
        >
          <Shield class="h-6 w-6 mx-auto mb-2 text-emerald-400" />
          <p class="text-2xl font-bold">{{ stats.achievements }}</p>
          <p class="text-sm" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">Achievements</p>
        </div>
      </div>
      
      <!-- Account Info -->
      <div 
        class="rounded-2xl overflow-hidden"
        :class="isDarkMode ? 'bg-[#2a2438]' : 'bg-white shadow'"
      >
        <div class="p-4 border-b" :class="isDarkMode ? 'border-white/10' : 'border-gray-100'">
          <h2 class="font-semibold">Account Information</h2>
        </div>
        
        <div class="divide-y" :class="isDarkMode ? 'divide-white/10' : 'divide-gray-100'">
          <div class="flex items-center gap-4 p-4">
            <div class="p-2 rounded-xl" :class="isDarkMode ? 'bg-white/5' : 'bg-gray-50'">
              <Mail class="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <p class="text-sm" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">Email</p>
              <p class="font-medium">{{ user?.email || 'Not set' }}</p>
            </div>
          </div>
          
          <div class="flex items-center gap-4 p-4">
            <div class="p-2 rounded-xl" :class="isDarkMode ? 'bg-white/5' : 'bg-gray-50'">
              <Calendar class="h-5 w-5 text-pink-400" />
            </div>
            <div>
              <p class="text-sm" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">Member Since</p>
              <p class="font-medium">January 2026</p>
            </div>
          </div>
          
          <div class="flex items-center gap-4 p-4">
            <div class="p-2 rounded-xl" :class="isDarkMode ? 'bg-white/5' : 'bg-gray-50'">
              <Shield class="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <p class="text-sm" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">Subscription</p>
              <p class="font-medium">Premium</p>
            </div>
          </div>
        </div>
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
</style>
