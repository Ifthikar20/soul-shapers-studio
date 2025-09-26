// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => {
  const isNewsletterOnly = process.env.VITE_NEWSLETTER_ONLY_MODE === 'true';
  const isConstruction = process.env.VITE_CONSTRUCTION_MODE === 'true';
  
  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [
      react(),
      mode === 'development' && componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      // Use esbuild instead of terser for faster builds
      minify: 'esbuild',
      rollupOptions: {
        output: {
          manualChunks: isNewsletterOnly ? undefined : {
            vendor: ['react', 'react-dom'],
            ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
            router: ['react-router-dom'],
            auth: ['@/contexts/AuthContext', '@/services/auth.service'],
            // video: ['@/components/VideoModal', '@/components/VideoPlayer'],
          },
        },
      },
    },
    optimizeDeps: {
      include: isNewsletterOnly 
        ? ['react', 'react-dom'] 
        : ['react', 'react-dom', 'react-router-dom', '@tanstack/react-query'],
    },
    define: {
      __NEWSLETTER_ONLY__: JSON.stringify(isNewsletterOnly),
      __CONSTRUCTION_MODE__: JSON.stringify(isConstruction),
    },
  };
});