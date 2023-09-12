import { ConfigEnv, UserConfig, loadEnv } from 'vite'
import setupVitePlugins from './src/plugins/vite'
import path from 'path'


export default ({ command, mode }: ConfigEnv): UserConfig => {

  let env: Record<string, any> = {}
  const root = process.cwd()
  const isBuild = command === 'build'
  if (isBuild) {
    env = loadEnv((process.argv[3] === '--mode' ? process.argv[4] : process.argv[3]), root)
  } else {
    env = loadEnv(mode, root)
  }

  return {
    base: env.VITE_BASE_PUBLIC_PATH,
    plugins: setupVitePlugins(),
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    },
    server: {
      host: true
    },
    build: {
      minify: 'terser',
      outDir: env.VITE_OUTPUT_DIR || 'dist',
      sourcemap: env.VITE_SOURCEMAP === 'true' ? 'inline' : false,
      assetsInlineLimit: 8 * 1024,
      chunkSizeWarningLimit: 1500,
      cssCodeSplit: true,
      emptyOutDir: true,
      terserOptions: {
        compress: {
          drop_console: env.VITE_DROP_CONSOLE,
          drop_debugger: env.VITE_DROP_DEBUGGER
        }
      }
    }
  }
}
