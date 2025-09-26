// vite.config.ts - Optimized for different modes
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
      rollupOptions: {
        output: {
          manualChunks: isNewsletterOnly ? undefined : {
            // Split vendor dependencies
            vendor: ['react', 'react-dom'],
            ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
            router: ['react-router-dom'],
            auth: ['@/contexts/AuthContext', '@/services/auth.service'],
            // video: ['@/components/VideoModal', '@/components/VideoPlayer'],
          },
        },
      },
      // Optimize for newsletter-only mode
      ...(isNewsletterOnly && {
        target: 'es2015',
        minify: 'terser',
        terserOptions: {
          compress: {
            drop_console: true,
            drop_debugger: true,
          },
        },
      }),
    },
    // Tree shaking optimization
    optimizeDeps: {
      include: isNewsletterOnly 
        ? ['react', 'react-dom'] 
        : ['react', 'react-dom', 'react-router-dom', '@tanstack/react-query'],
    },
    define: {
      // Remove unused features in newsletter-only mode
      __NEWSLETTER_ONLY__: JSON.stringify(isNewsletterOnly),
      __CONSTRUCTION_MODE__: JSON.stringify(isConstruction),
    },
  };
});