// src/composables/useToast.ts
import { ref } from 'vue'

interface Toast {
    id: string
    title: string
    description?: string
    variant?: 'default' | 'destructive'
    duration?: number
}

const toasts = ref<Toast[]>([])

export function useToast() {
    const toast = (options: Omit<Toast, 'id'>) => {
        const id = Math.random().toString(36).substr(2, 9)
        const newToast: Toast = {
            id,
            duration: 5000,
            variant: 'default',
            ...options
        }

        toasts.value.push(newToast)

        // Auto remove after duration
        setTimeout(() => {
            removeToast(id)
        }, newToast.duration)

        return id
    }

    const removeToast = (id: string) => {
        const index = toasts.value.findIndex(t => t.id === id)
        if (index > -1) {
            toasts.value.splice(index, 1)
        }
    }

    const clearToasts = () => {
        toasts.value = []
    }

    return {
        toasts,
        toast,
        removeToast,
        clearToasts
    }
}
