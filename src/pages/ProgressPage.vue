<script setup lang="ts">
import { Header, Footer } from '@/components/layout'
import { Card, CardContent } from '@/components/ui/card'
import { usePointsStore } from '@/stores/points'
import { Trophy, Flame, Star, Target } from 'lucide-vue-next'

const pointsStore = usePointsStore()
</script>

<template>
  <div class="min-h-screen bg-background">
    <Header />
    
    <main class="container mx-auto px-4 py-8 max-w-4xl">
      <h1 class="text-3xl font-bold text-foreground mb-8">Your Progress</h1>
      
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent class="p-6 text-center">
            <Trophy class="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <p class="text-2xl font-bold">{{ pointsStore.points }}</p>
            <p class="text-sm text-muted-foreground">Total Points</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent class="p-6 text-center">
            <Flame class="h-8 w-8 text-orange-500 mx-auto mb-2" />
            <p class="text-2xl font-bold">{{ pointsStore.streak }}</p>
            <p class="text-sm text-muted-foreground">Day Streak</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent class="p-6 text-center">
            <Star class="h-8 w-8 text-purple-500 mx-auto mb-2" />
            <p class="text-2xl font-bold">{{ pointsStore.level }}</p>
            <p class="text-sm text-muted-foreground">Level</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent class="p-6 text-center">
            <Target class="h-8 w-8 text-green-500 mx-auto mb-2" />
            <p class="text-2xl font-bold">{{ pointsStore.achievements.length }}</p>
            <p class="text-sm text-muted-foreground">Achievements</p>
          </CardContent>
        </Card>
      </div>
    </main>
    
    <Footer />
  </div>
</template>
