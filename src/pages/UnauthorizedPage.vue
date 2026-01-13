<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { Button } from '@/components/ui/button'
import { ShieldX, Home, LogIn } from 'lucide-vue-next'
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
    <div class="text-center max-w-md">
      <div class="flex justify-center mb-6">
        <div class="p-4 rounded-full bg-destructive/10">
          <ShieldX class="h-12 w-12 text-destructive" />
        </div>
      </div>
      <h1 class="text-2xl font-semibold text-gray-900 mb-2">
        Access Denied
      </h1>
      <p class="text-gray-600 mb-8">
        You don't have permission to access this page. Please sign in with an authorized account.
      </p>
      <div class="flex flex-col sm:flex-row gap-3 justify-center">
        <RouterLink to="/">
          <Button variant="outline">
            <Home class="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </RouterLink>
        <RouterLink to="/login">
          <Button>
            <LogIn class="mr-2 h-4 w-4" />
            Sign In
          </Button>
        </RouterLink>
      </div>
    </div>
  </div>
</template>
