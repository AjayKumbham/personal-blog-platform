import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Enable network access
    port: 5173,
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          forms: ['react-hook-form', '@hookform/resolvers', 'yup'],
          supabase: ['@supabase/supabase-js'],
          icons: ['lucide-react'],
          utils: ['date-fns'],
          // Separate admin chunk for lazy loading
          admin: [
            './src/pages/admin/AdminDashboard',
            './src/pages/admin/AdminPosts',
            './src/pages/admin/AdminNotifications',
            './src/pages/admin/AdminAbout',
            './src/pages/admin/AdminSettings',
            './src/pages/admin/NewPost',
            './src/pages/admin/EditPost',
            './src/components/admin/AdminLayout'
          ]
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  }
});
