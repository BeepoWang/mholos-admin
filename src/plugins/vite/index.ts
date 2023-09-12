import vue from '@vitejs/plugin-vue'
import VueJsx from '@vitejs/plugin-vue-jsx'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import { FileSystemIconLoader } from 'unplugin-icons/loaders'

const setupVitePlugins = () => {
  return [
    vue(),

    VueJsx(),

    Icons({
      compiler: 'vue3',
      customCollections: {
        local: FileSystemIconLoader('src/assets/svg-icons', (svg) => svg.replace(/^<svg /, '<svg fill="currentColor" '))
      },
      iconCustomizer(collection, _icon, props) {
        if (collection === 'local') {
          props.width = '1em'
          props.height = '1em'
        }
      }
    }),

    Components({
      dts: 'types/components.d.ts',
      resolvers: [
        IconsResolver({
          prefix: 'icon',
          customCollections: ['local']
        })
      ]
    }),

    AutoImport({
      dts: 'types/auto-imports.d.ts',
      imports: ['vue'],
      eslintrc: {
        enabled: true
      }
    }),


  ]
}

export default setupVitePlugins