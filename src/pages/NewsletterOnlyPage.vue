<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ref } from 'vue'
import { Mail, Sparkles } from 'lucide-vue-next'

const email = ref('')
const isSubmitted = ref(false)

const handleSubmit = () => {
  if (email.value) {
    isSubmitted.value = true
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center p-4">
    <div class="max-w-md w-full text-center">
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-white mb-4">Soul Shapers Studio</h1>
        <p class="text-gray-300">Join our newsletter and be the first to know when we launch.</p>
      </div>
      
      <div v-if="isSubmitted" class="bg-white/10 backdrop-blur rounded-lg p-6">
        <Sparkles class="h-12 w-12 text-yellow-400 mx-auto mb-4" />
        <p class="text-white">Thanks for subscribing! We'll be in touch.</p>
      </div>
      
      <form v-else @submit.prevent="handleSubmit" class="space-y-4">
        <div class="relative">
          <Mail class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            v-model="email"
            type="email"
            placeholder="Enter your email"
            class="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            required
          />
        </div>
        <Button type="submit" class="w-full">Subscribe</Button>
      </form>
    </div>
  </div>
</template>
