import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import { ConfigEnv, defineConfig, loadEnv } from "vite";
import vueSetupExtend from "vite-plugin-vue-setup-extend-plus";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import viteCompression from "vite-plugin-compression";
import { buildConfig } from "./src/utils/build";
import Components from "unplugin-vue-components/vite";
import { VantResolver } from "unplugin-vue-components/resolvers";

const pathResolve = (dir: string) => {
  return resolve(__dirname, ".", dir);
};

const alias: Record<string, string> = {
  "@": pathResolve("./src/"),
  "vue-i18n": "vue-i18n/dist/vue-i18n.cjs.js"
};

const viteConfig = defineConfig((mode: ConfigEnv) => {
  const env = loadEnv(mode.mode, process.cwd());
  return {
    plugins: [
      vue(),
      vueSetupExtend(),
      viteCompression(),
      JSON.parse(env.VITE_OPEN_CDN) ? buildConfig.cdn() : null,
      // 使用 svg 图标
      createSvgIconsPlugin({
        iconDirs: [resolve(process.cwd(), "src/assets/icons"), resolve(process.cwd(), "src/views/formgen/assets/icons/svg")],
        symbolId: "icon-[name]"
      }),
      Components({
        resolvers: [VantResolver()]
      })
    ],
    root: process.cwd(),
    resolve: { alias },
    base: mode.command === "serve" ? "./" : env.VITE_PUBLIC_PATH,
    optimizeDeps: { exclude: ["vue-demi"] },
    server: {
      host: "0.0.0.0",
      port: env.VITE_PORT as unknown as number,
      open: JSON.parse(env.VITE_OPEN),
      hmr: true,
      proxy: {
        "/tduck-api": {
          // target: "https://x.tduckcloud.com",
          target: "http://localhost:8996",
          ws: false,
          changeOrigin: true
          // rewrite: path => path.replace(/^\/gitee/, "")
        }
      }
    },
    build: {
      outDir: "dist",
      chunkSizeWarningLimit: 1500,
      target: "esnext",
      supported: {
        "top-level-await": true //browsers can handle top-level-await features
      },
      rollupOptions: {
        output: {
          chunkFileNames: "assets/js/[name]-[hash].js",
          entryFileNames: "assets/js/[name]-[hash].js",
          assetFileNames: "assets/[ext]/[name]-[hash].[ext]",
          manualChunks(id) {
            if (id.includes("node_modules")) {
              return id.toString().match(/\/node_modules\/(?!.pnpm)(?<moduleName>[^\/]*)\//)?.groups!.moduleName ?? "vender";
            }
          }
        },
        ...(JSON.parse(env.VITE_OPEN_CDN) ? { external: buildConfig.external } : {})
      }
    },
    css: {
      preprocessorOptions: {
        css: { charset: false }
      }
    },
    define: {
      __VUE_I18N_LEGACY_API__: JSON.stringify(false),
      __VUE_I18N_FULL_INSTALL__: JSON.stringify(false),
      __INTLIFY_PROD_DEVTOOLS__: JSON.stringify(false),
      __NEXT_VERSION__: JSON.stringify(process.env.npm_package_version),
      __NEXT_NAME__: JSON.stringify(process.env.npm_package_name)
    }
  };
});

export default viteConfig;
