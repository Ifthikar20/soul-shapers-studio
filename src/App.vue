<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import { RouterView } from 'vue-router'
import { Toaster } from '@/components/ui/toast'

// Lazy load special mode pages
const NewsletterOnlyPage = defineAsyncComponent(() => 
  import('@/pages/NewsletterOnlyPage.vue')
)
const UnderConstructionPage = defineAsyncComponent(() => 
  import('@/pages/UnderConstructionPage.vue')
)

// Check environment variables for different modes
const isConstructionMode = computed(() => import.meta.env.VITE_CONSTRUCTION_MODE === 'true')
const isNewsletterOnlyMode = computed(() => import.meta.env.VITE_NEWSLETTER_ONLY_MODE === 'true')
</script>

<template>
  <div>
    <!-- Newsletter-only mode -->
    <template v-if="isNewsletterOnlyMode">
      <Suspense>
        <NewsletterOnlyPage />
        <template #fallback>
          <div class="min-h-screen flex items-center justify-center">
            <div class="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        </template>
      </Suspense>
    </template>

    <!-- Construction mode -->
    <template v-else-if="isConstructionMode">
      <Suspense>
        <UnderConstructionPage />
        <template #fallback>
          <div class="min-h-screen flex items-center justify-center">
            <div class="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        </template>
      </Suspense>
    </template>

    <!-- Normal application mode -->
    <template v-else>
      <RouterView />
    </template>

    <!-- Global toast notifications -->
    <Toaster />
  </div>
</template>
