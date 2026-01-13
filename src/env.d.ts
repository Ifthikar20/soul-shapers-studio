/// <reference types="vite/client" />

declare module '*.vue' {
    import type { DefineComponent } from 'vue'
    const component: DefineComponent<{}, {}, any>
    export default component
}

interface ImportMetaEnv {
    readonly VITE_API_URL: string
    readonly VITE_BACKEND_URL: string
    readonly VITE_CONSTRUCTION_MODE: string
    readonly VITE_NEWSLETTER_ONLY_MODE: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
