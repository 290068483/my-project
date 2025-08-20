import { fileURLToPath, URL } from "node:url";
import { loadEnv } from "vite";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // 加载对应环境的.env文件
  const env = loadEnv(mode, process.cwd());
  const isDev = mode === "development";
  const isProd = mode === "production";

  // 从环境变量获取日志级别，默认为'info'
  const logLevel = (env.VITE_LOG_LEVEL || "info") as
    | "error"
    | "warn"
    | "info"
    | "silent";

  return {
    // 基础配置
    base: env.VITE_STATIC_BASE_URL || "/",
    mode,
    logLevel,

    plugins: [
      vue(),
      // 开发环境启用Vue DevTools
      isDev && vueDevTools(),
      // 自动导入Element Plus组件和API
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
    ].filter(Boolean),

    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },

    // 开发服务器配置
    server: {
      port: Number(env.VITE_PORT) || 5173,
      open: isDev,
      proxy: isDev
        ? {
            "/api": {
              target: env.VITE_API_BASE_URL || "http://localhost:3000",
              changeOrigin: true,
              rewrite: (path) => path.replace(/^\/api/, ""),
            },
            // Mock服务配置
            "/mock": {
              target: "http://localhost:" + (Number(env.VITE_PORT) || 5173),
              changeOrigin: true,
              rewrite: (path) => path.replace(/^\/mock/, "/public/mock"),
            },
          }
        : undefined,
      // 热更新配置
      hmr: isDev
        ? {
            interval: 300,
            overlay: true,
          }
        : false,
    },

    // 构建配置
    build: {
      minify: isProd,
      sourcemap: !isProd,
      outDir: "dist",
      rollupOptions: {
        output: {
          manualChunks: isProd
            ? {
                vue: ["vue"],
                "vue-router": ["vue-router"],
                pinia: ["pinia"],
                "element-plus": ["element-plus"],
              }
            : undefined,
        },
      },
      // 生产环境开启CSS代码分割
      cssCodeSplit: isProd,
    },

    // 优化配置
    optimizeDeps: {
      // 预构建依赖
      include: ["vue", "vue-router", "pinia"],
      // 开发环境启用缓存
      cacheDir: isDev ? ".vite/cache" : undefined,
    },

    // 删除以下CSS配置
    // 添加CSS配置
    // css: {
    //   postcss: {
    //     plugins: [
    //       import('tailwindcss').then((module) => module.default),
    //       import('autoprefixer').then((module) => module.default),
    //     ],
    //   },
    // },
  };
});
