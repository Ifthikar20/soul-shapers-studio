import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export type ThemeMode = 'dark' | 'light'

export const useThemeStore = defineStore('theme', () => {
    const mode = ref<ThemeMode>('dark')

    // Load from localStorage on init
    const savedMode = localStorage.getItem('theme-mode') as ThemeMode
    if (savedMode && (savedMode === 'dark' || savedMode === 'light')) {
        mode.value = savedMode
    }

    // Watch for changes and persist
    watch(mode, (newMode) => {
        localStorage.setItem('theme-mode', newMode)
        applyTheme(newMode)
    })

    const applyTheme = (themeMode: ThemeMode) => {
        const root = document.documentElement
        if (themeMode === 'light') {
            root.classList.add('light-mode')
            root.classList.remove('dark-mode')
        } else {
            root.classList.add('dark-mode')
            root.classList.remove('light-mode')
        }
    }

    const toggleMode = () => {
        mode.value = mode.value === 'dark' ? 'light' : 'dark'
    }

    const setMode = (newMode: ThemeMode) => {
        mode.value = newMode
    }

    // Apply theme on store creation
    applyTheme(mode.value)

    return {
        mode,
        toggleMode,
        setMode,
        applyTheme
    }
})
