import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { VueQueryPlugin } from '@tanstack/vue-query'
import App from './App.vue'
import router from './router'
import './index.css'

// Create Vue app
const app = createApp(App)

// Install plugins
app.use(createPinia())
app.use(router)
app.use(VueQueryPlugin)

// Global error handler
app.config.errorHandler = (err, instance, info) => {
    console.error('Vue Error:', err)
    console.error('Component:', instance)
    console.error('Info:', info)

    // In production, send to error tracking service
    if (import.meta.env.PROD) {
        // TODO: Send to error tracking (e.g., Sentry)
    }
}

// Mount app
app.mount('#app')
