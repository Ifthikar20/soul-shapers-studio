<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useThemeStore } from '@/stores/theme'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  ArrowLeft,
  User,
  Bell,
  Shield,
  Lock,
  CreditCard,
  HelpCircle,
  Mail,
  Smartphone,
  Globe,
  ChevronRight,
  Moon,
  Sun,
  Settings,
  LogOut,
  Eye,
  EyeOff,
  Trash2
} from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()
const themeStore = useThemeStore()

const user = computed(() => authStore.user)
const isDarkMode = computed(() => themeStore.mode === 'dark')
const showProfileDropdown = ref(false)

// Settings state
const notifications = ref({
  email: true,
  push: true,
  marketing: false
})

const toggleTheme = () => {
  themeStore.toggleMode()
}

const handleLogout = async () => {
  await authStore.logout()
  router.push('/')
}

const settingsSections = [
  {
    title: 'Account',
    items: [
      { icon: User, label: 'Edit Profile', href: '/profile' },
      { icon: Mail, label: 'Email Preferences', href: '#' },
      { icon: Lock, label: 'Change Password', href: '#' }
    ]
  },
  {
    title: 'Subscription',
    items: [
      { icon: CreditCard, label: 'Manage Subscription', href: '/upgrade' },
      { icon: Globe, label: 'Billing History', href: '#' }
    ]
  },
  {
    title: 'Privacy & Security',
    items: [
      { icon: Shield, label: 'Privacy Settings', href: '#' },
      { icon: Smartphone, label: 'Connected Devices', href: '#' }
    ]
  },
  {
    title: 'Support',
    items: [
      { icon: HelpCircle, label: 'Help Center', href: '/support' },
      { icon: Mail, label: 'Contact Support', href: '/support' }
    ]
  }
]
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
    
    <main class="max-w-2xl mx-auto px-6 py-8">
      <h1 class="text-2xl font-bold mb-8">Settings</h1>
      
      <!-- Theme Toggle Card -->
      <div 
        class="rounded-2xl p-5 mb-6"
        :class="isDarkMode ? 'bg-[#2a2438]' : 'bg-white shadow'"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20">
              <Moon v-if="isDarkMode" class="h-6 w-6 text-purple-400" />
              <Sun v-else class="h-6 w-6 text-amber-500" />
            </div>
            <div>
              <p class="font-semibold">Appearance</p>
              <p class="text-sm" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
                {{ isDarkMode ? 'Dark mode is enabled' : 'Light mode is enabled' }}
              </p>
            </div>
          </div>
          
          <button 
            @click="toggleTheme"
            class="relative w-14 h-7 rounded-full transition-colors"
            :class="isDarkMode ? 'bg-purple-500' : 'bg-gray-300'"
          >
            <span 
              class="absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-transform"
              :class="isDarkMode ? 'left-8' : 'left-1'"
            />
          </button>
        </div>
      </div>
      
      <!-- Notifications -->
      <div 
        class="rounded-2xl overflow-hidden mb-6"
        :class="isDarkMode ? 'bg-[#2a2438]' : 'bg-white shadow'"
      >
        <div class="p-4 border-b" :class="isDarkMode ? 'border-white/10' : 'border-gray-100'">
          <h2 class="font-semibold">Notifications</h2>
        </div>
        
        <div class="divide-y" :class="isDarkMode ? 'divide-white/10' : 'divide-gray-100'">
          <div class="flex items-center justify-between p-4">
            <div class="flex items-center gap-4">
              <Mail class="h-5 w-5" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'" />
              <span>Email Notifications</span>
            </div>
            <button 
              @click="notifications.email = !notifications.email"
              class="relative w-12 h-6 rounded-full transition-colors"
              :class="notifications.email ? 'bg-purple-500' : (isDarkMode ? 'bg-gray-600' : 'bg-gray-300')"
            >
              <span 
                class="absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform"
                :class="notifications.email ? 'left-7' : 'left-1'"
              />
            </button>
          </div>
          
          <div class="flex items-center justify-between p-4">
            <div class="flex items-center gap-4">
              <Bell class="h-5 w-5" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'" />
              <span>Push Notifications</span>
            </div>
            <button 
              @click="notifications.push = !notifications.push"
              class="relative w-12 h-6 rounded-full transition-colors"
              :class="notifications.push ? 'bg-purple-500' : (isDarkMode ? 'bg-gray-600' : 'bg-gray-300')"
            >
              <span 
                class="absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform"
                :class="notifications.push ? 'left-7' : 'left-1'"
              />
            </button>
          </div>
        </div>
      </div>
      
      <!-- Settings Sections -->
      <div v-for="section in settingsSections" :key="section.title" class="mb-6">
        <h2 class="text-sm font-semibold mb-3 px-1" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
          {{ section.title }}
        </h2>
        <div 
          class="rounded-2xl overflow-hidden divide-y"
          :class="isDarkMode ? 'bg-[#2a2438] divide-white/10' : 'bg-white shadow divide-gray-100'"
        >
          <RouterLink 
            v-for="item in section.items" 
            :key="item.label"
            :to="item.href"
            class="flex items-center justify-between p-4 transition-colors"
            :class="isDarkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50'"
          >
            <div class="flex items-center gap-4">
              <component :is="item.icon" class="h-5 w-5" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'" />
              <span>{{ item.label }}</span>
            </div>
            <ChevronRight class="h-5 w-5" :class="isDarkMode ? 'text-gray-600' : 'text-gray-400'" />
          </RouterLink>
        </div>
      </div>
      
      <!-- Danger Zone -->
      <div 
        class="rounded-2xl overflow-hidden border-2 border-red-500/20"
        :class="isDarkMode ? 'bg-[#2a2438]' : 'bg-white'"
      >
        <div class="p-4 border-b border-red-500/20">
          <h2 class="font-semibold text-red-400">Danger Zone</h2>
        </div>
        <div class="p-4">
          <button class="flex items-center gap-3 text-red-400 hover:text-red-300 transition-colors">
            <Trash2 class="h-5 w-5" />
            <span>Delete Account</span>
          </button>
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
