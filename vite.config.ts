import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";
import path from "path"
const time = new Date().getTime();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    uni(),
  ],
  server: {
    // port: 8080,
    host: '0.0.0.0',
    proxy: {
      "/api": {
        target: `https://zhuyiyun.com/api`,
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api/, '')
      },
      '/upload': {
        //代理图片下载的接口
        target: "https://resource.zhuyiyun.com",
        changeOrigin: true,
        secure: false, // 设置支持https协议的代理
        rewrite: (p) => p.replace(/^\/upload/, '')
      }
    }
  },
  base: process.env.NODE_ENV === 'development' ? "/" : "/",

  build: {
    target: "es2015",
    minify: "terser",
    terserOptions: {
      compress: {
        keep_infinity: true,
      }
    },
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name].${time}.js`,
        chunkFileNames: `assets/[name].${time}.js`,
        assetFileNames: `assets/[name].${time}.[ext]`
      }
    },
    // Turning off brotliSize display can slightly reduce packaging time
    brotliSize: false,
    chunkSizeWarningLimit: 2000
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  css: {
    // 配置`scss`全局变量
    preprocessorOptions: {
      scss: {
        additionalData: '@import "./src/uni.scss";'
      }
    }
  }
});
