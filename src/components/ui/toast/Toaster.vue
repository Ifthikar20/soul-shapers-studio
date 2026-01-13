<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useToast } from '@/composables/useToast'
import { X } from 'lucide-vue-next'
import { cn } from '@/lib/utils'

const { toasts, removeToast } = useToast()
</script>

<template>
  <Teleport to="body">
    <div class="fixed top-0 right-0 z-50 flex flex-col gap-2 p-4 max-w-md w-full pointer-events-none">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="cn(
            'pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all',
            toast.variant === 'destructive'
              ? 'border-destructive bg-destructive text-destructive-foreground'
              : 'border bg-background text-foreground'
          )"
        >
          <div class="flex flex-col gap-1">
            <div class="text-sm font-semibold">{{ toast.title }}</div>
            <div v-if="toast.description" class="text-sm opacity-90">
              {{ toast.description }}
            </div>
          </div>
          <button
            class="absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100"
            @click="removeToast(toast.id)"
          >
            <X class="h-4 w-4" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
