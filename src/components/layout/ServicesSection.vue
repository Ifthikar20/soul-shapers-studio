<script setup lang="ts">
import { Headphones, Video, Heart, Brain, Flower2, Users } from 'lucide-vue-next'

const services = [
  {
    icon: Video,
    title: 'Video Courses',
    description: 'Expert-led video programs for personal growth and transformation.',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Headphones,
    title: 'Audio Sessions',
    description: 'Guided meditations and audio coaching for on-the-go learning.',
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: Brain,
    title: 'Mind Training',
    description: 'Science-backed techniques to rewire your mind for success.',
    color: 'from-orange-500 to-red-500'
  },
  {
    icon: Heart,
    title: 'Wellness Programs',
    description: 'Holistic approaches to physical and emotional well-being.',
    color: 'from-green-500 to-emerald-500'
  },
  {
    icon: Flower2,
    title: 'Meditation Library',
    description: 'Hundreds of guided meditations for every mood and goal.',
    color: 'from-indigo-500 to-purple-500'
  },
  {
    icon: Users,
    title: 'Community',
    description: 'Connect with like-minded individuals on your growth journey.',
    color: 'from-pink-500 to-rose-500'
  }
]
</script>

<template>
  <section class="py-20 bg-white">
    <div class="container mx-auto px-4">
      <!-- Section Header -->
      <div class="text-center max-w-3xl mx-auto mb-16">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Everything You Need to
          <span class="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Transform Your Life
          </span>
        </h2>
        <p class="text-lg text-gray-600">
          Access world-class content designed to help you grow in every area of your life.
        </p>
      </div>

      <!-- Services Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="service in services"
          :key="service.title"
          class="group p-8 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-gray-100"
        >
          <!-- Icon -->
          <div
            :class="`w-14 h-14 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`"
          >
            <component :is="service.icon" class="h-7 w-7 text-white" />
          </div>

          <!-- Content -->
          <h3 class="text-xl font-semibold text-gray-900 mb-3">
            {{ service.title }}
          </h3>
          <p class="text-gray-600">
            {{ service.description }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
