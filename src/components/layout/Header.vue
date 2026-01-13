<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useSecureSearch } from '@/composables/useSecureSearch'
import { useMobile } from '@/composables/useMobile'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Menu,
  X,
  Search,
  User,
  LogOut,
  Settings,
  ChevronDown
} from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()
const { isMobile } = useMobile()
const { searchQuery, search } = useSecureSearch()

const isMenuOpen = ref(false)
const isProfileMenuOpen = ref(false)
const localSearchQuery = ref('')

const isAuthenticated = computed(() => authStore.isAuthenticated)
const user = computed(() => authStore.user)

const navigation = [
  { name: 'Browse', href: '/browse', requiresAuth: true },
  { name: 'Audio', href: '/audio', requiresAuth: true },
  { name: 'Meditate', href: '/meditate', requiresAuth: true },
  { name: 'Experts', href: '/experts', requiresAuth: true },
  { name: 'Read', href: '/read', requiresAuth: false }
]

const filteredNavigation = computed(() => {
  return navigation.filter(item => {
    if (item.requiresAuth && !isAuthenticated.value) return false
    return true
  })
})

const handleSearch = () => {
  if (localSearchQuery.value.trim()) {
    search(localSearchQuery.value)
    localSearchQuery.value = ''
  }
}

const handleLogout = async () => {
  await authStore.logout()
  router.push('/')
}

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const toggleProfileMenu = () => {
  isProfileMenuOpen.value = !isProfileMenuOpen.value
}
</script>

<template>
  <header class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <div class="container flex h-16 items-center justify-between px-4 mx-auto">
      <!-- Logo -->
      <RouterLink to="/" class="flex items-center space-x-2">
        <span class="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Soul Shapers
        </span>
      </RouterLink>

      <!-- Desktop Navigation -->
      <nav class="hidden md:flex items-center space-x-6">
        <RouterLink
          v-for="item in filteredNavigation"
          :key="item.name"
          :to="item.href"
          class="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          {{ item.name }}
        </RouterLink>
      </nav>

      <!-- Search & Auth -->
      <div class="hidden md:flex items-center space-x-4">
        <!-- Search -->
        <form v-if="isAuthenticated" @submit.prevent="handleSearch" class="relative">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            v-model="localSearchQuery"
            type="search"
            placeholder="Search..."
            class="w-64 pl-10"
          />
        </form>

        <!-- Auth Buttons / Profile Menu -->
        <template v-if="isAuthenticated">
          <div class="relative">
            <button
              @click="toggleProfileMenu"
              class="flex items-center space-x-2 rounded-full bg-muted p-1 pr-3"
            >
              <div class="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                <User class="h-4 w-4 text-white" />
              </div>
              <span class="text-sm font-medium">{{ user?.name?.split(' ')[0] }}</span>
              <ChevronDown class="h-4 w-4" />
            </button>

            <!-- Dropdown Menu -->
            <Transition name="fade">
              <div
                v-if="isProfileMenuOpen"
                class="absolute right-0 mt-2 w-48 rounded-md bg-background border shadow-lg py-1"
              >
                <RouterLink
                  to="/profile"
                  class="flex items-center px-4 py-2 text-sm text-foreground hover:bg-muted"
                  @click="isProfileMenuOpen = false"
                >
                  <User class="mr-2 h-4 w-4" />
                  Profile
                </RouterLink>
                <RouterLink
                  to="/settings"
                  class="flex items-center px-4 py-2 text-sm text-foreground hover:bg-muted"
                  @click="isProfileMenuOpen = false"
                >
                  <Settings class="mr-2 h-4 w-4" />
                  Settings
                </RouterLink>
                <button
                  @click="handleLogout"
                  class="flex items-center w-full px-4 py-2 text-sm text-foreground hover:bg-muted"
                >
                  <LogOut class="mr-2 h-4 w-4" />
                  Log out
                </button>
              </div>
            </Transition>
          </div>
        </template>
        <template v-else>
          <RouterLink to="/login">
            <Button variant="ghost">Log in</Button>
          </RouterLink>
          <RouterLink to="/upgrade">
            <Button>Get Started</Button>
          </RouterLink>
        </template>
      </div>

      <!-- Mobile Menu Button -->
      <button
        class="md:hidden p-2"
        @click="toggleMenu"
      >
        <Menu v-if="!isMenuOpen" class="h-6 w-6" />
        <X v-else class="h-6 w-6" />
      </button>
    </div>

    <!-- Mobile Menu -->
    <Transition name="slide">
      <div
        v-if="isMenuOpen && isMobile"
        class="md:hidden border-t bg-background"
      >
        <div class="container px-4 py-4 space-y-4">
          <!-- Mobile Search -->
          <form v-if="isAuthenticated" @submit.prevent="handleSearch" class="relative">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              v-model="localSearchQuery"
              type="search"
              placeholder="Search..."
              class="w-full pl-10"
            />
          </form>

          <!-- Mobile Navigation -->
          <nav class="flex flex-col space-y-2">
            <RouterLink
              v-for="item in filteredNavigation"
              :key="item.name"
              :to="item.href"
              class="text-sm font-medium text-foreground py-2"
              @click="isMenuOpen = false"
            >
              {{ item.name }}
            </RouterLink>
          </nav>

          <!-- Mobile Auth -->
          <div class="pt-4 border-t">
            <template v-if="isAuthenticated">
              <RouterLink to="/profile" class="flex items-center py-2" @click="isMenuOpen = false">
                <User class="mr-2 h-4 w-4" />
                Profile
              </RouterLink>
              <button @click="handleLogout" class="flex items-center py-2 text-destructive">
                <LogOut class="mr-2 h-4 w-4" />
                Log out
              </button>
            </template>
            <template v-else>
              <div class="flex flex-col space-y-2">
                <RouterLink to="/login" @click="isMenuOpen = false">
                  <Button variant="outline" class="w-full">Log in</Button>
                </RouterLink>
                <RouterLink to="/upgrade" @click="isMenuOpen = false">
                  <Button class="w-full">Get Started</Button>
                </RouterLink>
              </div>
            </template>
          </div>
        </div>
      </div>
    </Transition>
  </header>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
