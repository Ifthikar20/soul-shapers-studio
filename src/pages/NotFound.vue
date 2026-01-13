<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Home } from 'lucide-vue-next'
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
    <div class="text-center max-w-md">
      <div class="text-8xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
        404
      </div>
      <h1 class="text-2xl font-semibold text-gray-900 mb-2">
        Page Not Found
      </h1>
      <p class="text-gray-600 mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <RouterLink to="/">
        <Button>
          <Home class="mr-2 h-4 w-4" />
          Back to Home
        </Button>
      </RouterLink>
    </div>
  </div>
</template>
