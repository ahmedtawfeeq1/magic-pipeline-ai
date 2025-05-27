import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Path resolution for absolute imports using @ prefix
  // This allows us to import like: import { Button } from '@/components/ui/button'
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  
  // Build configuration optimized for production
  build: {
    // Output directory (Vercel expects 'dist' by default)
    outDir: 'dist',
    
    // Generate source maps for debugging in production
    sourcemap: true,
    
    // Optimize chunk splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor libraries for better caching
          vendor: ['react', 'react-dom'],
          // Separate ReactFlow for better caching since it's large
          reactflow: ['@xyflow/react'],
          // UI components in their own chunk
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-slot'],
        },
      },
    },
    
    // Increase chunk size warning limit for our feature-rich app
    chunkSizeWarningLimit: 1000,
  },
  
  // Development server configuration
  server: {
    port: 5173,
    host: true, // Allows access from network
  },
  
  // Preview server configuration (for 'npm run preview')
  preview: {
    port: 4173,
    host: true,
  },
})
