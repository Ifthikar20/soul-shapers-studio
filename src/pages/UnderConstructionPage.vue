<script setup lang="ts">
import { Hammer, Clock } from 'lucide-vue-next'
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
    <div class="max-w-md w-full text-center">
      <div class="mb-8">
        <Hammer class="h-16 w-16 text-yellow-500 mx-auto mb-6 animate-bounce" />
        <h1 class="text-4xl font-bold text-white mb-4">Under Construction</h1>
        <p class="text-gray-400 mb-6">
          We're working hard to bring you something amazing. Check back soon!
        </p>
        <div class="flex items-center justify-center gap-2 text-gray-500">
          <Clock class="h-4 w-4" />
          <span>Coming Soon</span>
        </div>
      </div>
    </div>
  </div>
</template>
