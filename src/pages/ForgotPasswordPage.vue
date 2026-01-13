<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Header, Footer } from '@/components/layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { authService } from '@/services/auth.service'
import { useToast } from '@/composables/useToast'
import { ArrowLeft, Mail, Loader2 } from 'lucide-vue-next'

const router = useRouter()
const { toast } = useToast()

const email = ref('')
const isLoading = ref(false)
const isSubmitted = ref(false)

const handleSubmit = async () => {
  if (!email.value || isLoading.value) return
  
  isLoading.value = true
  
  try {
    await authService.forgotPassword(email.value)
    isSubmitted.value = true
    toast({ title: 'Email sent', description: 'Check your inbox for reset instructions' })
  } catch (err: any) {
    toast({ title: 'Error', description: err.message || 'Failed to send reset email', variant: 'destructive' })
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    <Header />
    
    <main class="flex items-center justify-center px-4 py-16">
      <Card class="w-full max-w-md">
        <CardHeader>
          <button @click="router.back()" class="flex items-center text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft class="h-4 w-4 mr-2" />
            Back
          </button>
          <CardTitle>Forgot Password</CardTitle>
          <CardDescription>
            {{ isSubmitted ? 'Check your email for reset instructions' : "Enter your email and we'll send you a reset link" }}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div v-if="isSubmitted" class="text-center py-8">
            <Mail class="h-12 w-12 text-primary mx-auto mb-4" />
            <p class="text-muted-foreground">We've sent a reset link to {{ email }}</p>
          </div>
          
          <form v-else @submit.prevent="handleSubmit" class="space-y-4">
            <div class="space-y-2">
              <Label for="email">Email</Label>
              <Input id="email" v-model="email" type="email" placeholder="you@example.com" required />
            </div>
            <Button type="submit" class="w-full" :disabled="isLoading">
              <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
              Send Reset Link
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
    
    <Footer />
  </div>
</template>
