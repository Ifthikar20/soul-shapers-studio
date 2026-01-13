<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Header, Footer } from '@/components/layout'
import { Eye, EyeOff, Loader2, Mail, Lock } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const isLoading = ref(false)
const error = ref('')
const isRegisterMode = ref(false)
const fullName = ref('')

const redirectPath = computed(() => route.query.redirect as string || '/browse')

const toggleMode = () => {
  isRegisterMode.value = !isRegisterMode.value
  error.value = ''
}

const handleSubmit = async () => {
  if (isLoading.value) return
  
  error.value = ''
  isLoading.value = true
  
  try {
    if (isRegisterMode.value) {
      const result = await authStore.register(email.value, password.value, fullName.value)
      if (result?.needsConfirmation) {
        // Stay on login page, show confirmation message
        isRegisterMode.value = false
        return
      }
    } else {
      await authStore.login(email.value, password.value)
    }
    
    router.push(redirectPath.value)
  } catch (err: any) {
    error.value = err.message || 'An error occurred'
  } finally {
    isLoading.value = false
  }
}

const handleGoogleLogin = async () => {
  try {
    // Redirect to Google OAuth
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`
  } catch (err: any) {
    error.value = err.message || 'Google login failed'
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    <Header />
    
    <main class="flex items-center justify-center px-4 py-16">
      <Card class="w-full max-w-md">
        <CardHeader class="text-center">
          <CardTitle class="text-2xl">
            {{ isRegisterMode ? 'Create Account' : 'Welcome Back' }}
          </CardTitle>
          <CardDescription>
            {{ isRegisterMode 
              ? 'Start your transformation journey today' 
              : 'Sign in to continue your journey' 
            }}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <!-- Error Message -->
            <div
              v-if="error"
              class="p-3 rounded-md bg-destructive/10 text-destructive text-sm"
            >
              {{ error }}
            </div>
            
            <!-- Full Name (Register only) -->
            <div v-if="isRegisterMode" class="space-y-2">
              <Label for="fullName">Full Name</Label>
              <Input
                id="fullName"
                v-model="fullName"
                placeholder="Enter your name"
                required
                :disabled="isLoading"
              />
            </div>
            
            <!-- Email -->
            <div class="space-y-2">
              <Label for="email">Email</Label>
              <div class="relative">
                <Mail class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  v-model="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  :disabled="isLoading"
                  class="pl-10"
                />
              </div>
            </div>
            
            <!-- Password -->
            <div class="space-y-2">
              <Label for="password">Password</Label>
              <div class="relative">
                <Lock class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="••••••••"
                  required
                  :disabled="isLoading"
                  class="pl-10 pr-10"
                />
                <button
                  type="button"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  @click="showPassword = !showPassword"
                >
                  <Eye v-if="!showPassword" class="h-4 w-4" />
                  <EyeOff v-else class="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <!-- Forgot Password Link -->
            <div v-if="!isRegisterMode" class="text-right">
              <RouterLink
                to="/forgot-password"
                class="text-sm text-primary hover:underline"
              >
                Forgot password?
              </RouterLink>
            </div>
            
            <!-- Submit Button -->
            <Button
              type="submit"
              class="w-full"
              :disabled="isLoading"
            >
              <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
              {{ isRegisterMode ? 'Create Account' : 'Sign In' }}
            </Button>
          </form>
          
          <!-- Divider -->
          <div class="relative my-6">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t" />
            </div>
            <div class="relative flex justify-center text-xs uppercase">
              <span class="bg-card px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>
          
          <!-- Social Login -->
          <Button
            variant="outline"
            class="w-full"
            @click="handleGoogleLogin"
            :disabled="isLoading"
          >
            <svg class="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </Button>
        </CardContent>
        
        <CardFooter class="justify-center">
          <p class="text-sm text-muted-foreground">
            {{ isRegisterMode ? 'Already have an account?' : "Don't have an account?" }}
            <button
              type="button"
              class="text-primary hover:underline ml-1"
              @click="toggleMode"
            >
              {{ isRegisterMode ? 'Sign In' : 'Sign Up' }}
            </button>
          </p>
        </CardFooter>
      </Card>
    </main>
    
    <Footer />
  </div>
</template>
