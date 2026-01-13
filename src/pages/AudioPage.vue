<script setup lang="ts">
import { Header, Footer } from '@/components/layout'
import { Card, CardContent } from '@/components/ui/card'
import { Headphones, Music, Wind, Waves, Moon, Sun } from 'lucide-vue-next'

const categories = [
  { id: 'meditation', name: 'Meditation', icon: Moon, color: 'from-indigo-500 to-purple-600' },
  { id: 'sleep', name: 'Sleep', icon: Moon, color: 'from-blue-500 to-indigo-600' },
  { id: 'focus', name: 'Focus', icon: Sun, color: 'from-amber-500 to-orange-600' },
  { id: 'relaxation', name: 'Relaxation', icon: Waves, color: 'from-cyan-500 to-blue-600' },
  { id: 'nature', name: 'Nature Sounds', icon: Wind, color: 'from-green-500 to-emerald-600' },
  { id: 'music', name: 'Music', icon: Music, color: 'from-pink-500 to-rose-600' }
]
</script>

<template>
  <div class="min-h-screen bg-background">
    <Header />
    
    <main class="container mx-auto px-4 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-foreground mb-2">Audio Topics</h1>
        <p class="text-muted-foreground">Explore audio by category</p>
      </div>
      
      <div class="grid grid-cols-2 md:grid-cols-3 gap-6">
        <RouterLink
          v-for="category in categories"
          :key="category.id"
          :to="`/audio?category=${category.id}`"
          class="group"
        >
          <Card class="overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1">
            <div :class="`aspect-square bg-gradient-to-br ${category.color} flex flex-col items-center justify-center text-white p-6`">
              <component :is="category.icon" class="h-12 w-12 mb-4 opacity-80 group-hover:scale-110 transition-transform" />
              <h3 class="text-lg font-semibold text-center">{{ category.name }}</h3>
            </div>
          </Card>
        </RouterLink>
      </div>
    </main>
    
    <Footer />
  </div>
</template>
