<script setup lang="ts">
import { Header, Footer } from '@/components/layout'
import { Card, CardContent } from '@/components/ui/card'
import { Calendar, User } from 'lucide-vue-next'

const posts = [
  { slug: 'getting-started', title: 'Getting Started with Meditation', excerpt: 'Learn the basics of meditation practice.', author: 'Dr. Sarah Chen', date: '2026-01-10' },
  { slug: 'mindfulness-tips', title: '10 Mindfulness Tips for Beginners', excerpt: 'Simple ways to bring mindfulness into your daily life.', author: 'Michael Torres', date: '2026-01-08' },
  { slug: 'stress-relief', title: 'Managing Stress Through Breathwork', excerpt: 'Powerful breathing techniques for stress relief.', author: 'Emma Wilson', date: '2026-01-05' }
]
</script>

<template>
  <div class="min-h-screen bg-background">
    <Header />
    
    <main class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-foreground mb-8">Read</h1>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <RouterLink v-for="post in posts" :key="post.slug" :to="`/read/post/${post.slug}`">
          <Card class="h-full hover:shadow-lg transition-shadow">
            <div class="aspect-video bg-gradient-to-br from-indigo-500 to-purple-600" />
            <CardContent class="p-6">
              <h3 class="font-semibold text-lg mb-2">{{ post.title }}</h3>
              <p class="text-muted-foreground text-sm mb-4">{{ post.excerpt }}</p>
              <div class="flex items-center gap-4 text-xs text-muted-foreground">
                <span class="flex items-center gap-1"><User class="h-3 w-3" /> {{ post.author }}</span>
                <span class="flex items-center gap-1"><Calendar class="h-3 w-3" /> {{ post.date }}</span>
              </div>
            </CardContent>
          </Card>
        </RouterLink>
      </div>
    </main>
    
    <Footer />
  </div>
</template>
