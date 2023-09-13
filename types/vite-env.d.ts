/// <reference types="vite/client" />

declare module '*.vue' {
  import { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '@element-plus/icons-vue'

interface ImportMetaEnv {
  VITE_APP_TITLE: string
  VITE_OUTPUT_DIR: string
  VITE_APP_API_URL: string
  VITE_BASE_PUBLIC_PATH: string
  VITE_DROP_DEBUGGER: string
  VITE_DROP_CONSOLE: string
  VITE_SOURCEMAP: string
}