<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { Button } from '@/components/ui/button'
import { ArrowRight, Play, Sparkles } from 'lucide-vue-next'
</script>

<template>
  <section class="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 text-white">
    <!-- Background Pattern -->
    <div class="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
    
    <!-- Animated Gradient Orbs -->
    <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
    <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>

    <div class="relative container mx-auto px-4 py-24 md:py-32">
      <div class="max-w-4xl mx-auto text-center">
        <!-- Badge -->
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8">
          <Sparkles class="h-4 w-4 text-yellow-400" />
          <span class="text-sm font-medium">Transform Your Life Today</span>
        </div>

        <!-- Heading -->
        <h1 class="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
          Unlock Your
          <span class="bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
            Fullest Potential
          </span>
        </h1>

        <!-- Subheading -->
        <p class="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10">
          Expert-led coaching, meditation, and mindfulness practices designed to 
          transform your mind, body, and soul in just 20 minutes a day.
        </p>

        <!-- CTA Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <RouterLink to="/upgrade">
            <Button size="lg" class="bg-white text-gray-900 hover:bg-gray-100 font-semibold px-8">
              Start Free Trial
              <ArrowRight class="ml-2 h-5 w-5" />
            </Button>
          </RouterLink>
          <RouterLink to="/login">
            <Button variant="outline" size="lg" class="border-white/50 bg-white/10 text-white hover:bg-white/20 px-8">
              <Play class="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </RouterLink>
        </div>

        <!-- Trust Indicators -->
        <div class="mt-16 flex flex-wrap justify-center gap-8">
          <div class="text-center">
            <div class="text-3xl font-bold text-white">1M+</div>
            <div class="text-sm text-gray-400">Active Users</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-white">100+</div>
            <div class="text-sm text-gray-400">Expert Teachers</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-white">4.9</div>
            <div class="text-sm text-gray-400">App Store Rating</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-white">50K+</div>
            <div class="text-sm text-gray-400">5-Star Reviews</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Wave Divider -->
    <div class="absolute bottom-0 left-0 right-0">
      <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V120Z" fill="white"/>
      </svg>
    </div>
  </section>
</template>

<style scoped>
.delay-1000 {
  animation-delay: 1s;
}
</style>
