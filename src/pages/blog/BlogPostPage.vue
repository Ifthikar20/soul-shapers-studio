<script setup lang="ts">
import { Header, Footer } from '@/components/layout'
</script>

<template>
  <div class="min-h-screen bg-background">
    <Header />
    <main class="container mx-auto px-4 py-8 max-w-3xl">
      <h1 class="text-3xl font-bold text-foreground mb-4">Blog Post</h1>
      <p class="text-muted-foreground">Blog post content will appear here</p>
    </main>
    <Footer />
  </div>
</template>
