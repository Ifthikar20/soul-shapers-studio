<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { Header, Footer } from '@/components/layout'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Check, Sparkles, Crown, Zap } from 'lucide-vue-next'

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Get started with basic features',
    features: ['Access to free content', 'Basic meditations', 'Community access'],
    cta: 'Current Plan',
    disabled: true,
    highlight: false
  },
  {
    name: 'Premium',
    price: '$14.99',
    period: 'per month',
    description: 'Unlock your full potential',
    features: ['All free features', 'Unlimited content access', 'Exclusive programs', 'Offline downloads', 'Priority support'],
    cta: 'Start Free Trial',
    disabled: false,
    highlight: true
  },
  {
    name: 'Annual',
    price: '$99.99',
    period: 'per year',
    description: 'Best value - save 45%',
    features: ['All Premium features', '2 months free', 'Early access to new content', 'Personal coaching session'],
    cta: 'Get Annual Plan',
    disabled: false,
    highlight: false
  }
]
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    <Header />
    
    <main class="container mx-auto px-4 py-16">
      <div class="text-center max-w-3xl mx-auto mb-12">
        <h1 class="text-4xl font-bold text-foreground mb-4">
          Choose Your Plan
        </h1>
        <p class="text-lg text-muted-foreground">
          Start your transformation journey with a plan that fits your goals
        </p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <Card
          v-for="plan in plans"
          :key="plan.name"
          :class="plan.highlight ? 'border-primary shadow-lg scale-105' : ''"
        >
          <CardHeader>
            <div v-if="plan.highlight" class="flex items-center gap-2 text-primary mb-2">
              <Sparkles class="h-4 w-4" />
              <span class="text-sm font-medium">Most Popular</span>
            </div>
            <CardTitle class="flex items-center gap-2">
              <Crown v-if="plan.name === 'Annual'" class="h-5 w-5 text-yellow-500" />
              {{ plan.name }}
            </CardTitle>
            <CardDescription>{{ plan.description }}</CardDescription>
          </CardHeader>
          
          <CardContent>
            <div class="mb-6">
              <span class="text-4xl font-bold">{{ plan.price }}</span>
              <span class="text-muted-foreground">/{{ plan.period }}</span>
            </div>
            
            <ul class="space-y-3">
              <li v-for="feature in plan.features" :key="feature" class="flex items-center gap-2">
                <Check class="h-4 w-4 text-green-500" />
                <span class="text-sm">{{ feature }}</span>
              </li>
            </ul>
          </CardContent>
          
          <CardFooter>
            <Button
              :variant="plan.highlight ? 'default' : 'outline'"
              :disabled="plan.disabled"
              class="w-full"
            >
              {{ plan.cta }}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
    
    <Footer />
  </div>
</template>
