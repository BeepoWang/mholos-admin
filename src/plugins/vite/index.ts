import vue from '@vitejs/plugin-vue';
import VueJsx from '@vitejs/plugin-vue-jsx';
import Unocss from 'unocss/vite';
import AutoImport from 'unplugin-auto-import/vite';
import { FileSystemIconLoader } from 'unplugin-icons/loaders';
import IconsResolver from 'unplugin-icons/resolver';
import Icons from 'unplugin-icons/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';

const setupVitePlugins = () => {
  return [
    vue(),
    VueJsx(),
    Unocss(),

    Icons({
      compiler: 'vue3',
      customCollections: {
        local: FileSystemIconLoader('src/assets/svg-icons', (svg) =>
          svg.replace(/^<svg /, '<svg fill="currentColor" ')
        )
      },
      iconCustomizer(collection, _icon, props) {
        if (collection === 'local') {
          props.width = '1em';
          props.height = '1em';
        }
      }
    }),

    Components({
      dts: 'types/components.d.ts',
      resolvers: [
        IconsResolver({
          prefix: 'icon',
          customCollections: ['local']
        }),
        ElementPlusResolver()
      ]
    }),

    AutoImport({
      dts: 'types/auto-imports.d.ts',
      imports: ['vue', 'vue-router', 'pinia'],
      eslintrc: {
        enabled: true
      },
      resolvers: [ElementPlusResolver()]
    })
  ];
};

export default setupVitePlugins;
