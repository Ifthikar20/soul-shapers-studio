<script setup lang="ts">
import { Header, Footer } from '@/components/layout'
</script>

<template>
  <div class="min-h-screen bg-background">
    <Header />
    <main class="container mx-auto px-4 py-8 max-w-4xl">
      <h1 class="text-3xl font-bold text-foreground mb-8">Privacy Policy</h1>
      <div class="prose prose-gray max-w-none">
        <p class="text-muted-foreground">Last updated: January 2026</p>
        <h2>1. Information We Collect</h2>
        <p>We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support.</p>
        <h2>2. How We Use Your Information</h2>
        <p>We use the information we collect to provide, maintain, and improve our services, and to communicate with you.</p>
        <h2>3. Information Sharing</h2>
        <p>We do not sell your personal information. We may share your information with third-party service providers who assist us in operating our platform.</p>
      </div>
    </main>
    <Footer />
  </div>
</template>
