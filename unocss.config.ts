import { FileSystemIconLoader } from '@iconify/utils/lib/loader/node-loaders';
import {
  defineConfig,
  presetUno,
  presetIcons,
  presetAttributify,
  transformerVariantGroup,
  transformerDirectives
} from 'unocss';
import presetRemToPx from '@unocss/preset-rem-to-px';

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetRemToPx({
      baseFontSize: 4
    }),
    presetIcons({
      scale: 1.2,
      extraProperties: {
        display: 'inline-block',
        'vertical-align': 'middle'
      },
      collections: {
        local: FileSystemIconLoader('src/assets/svg-icons')
      }
    })
  ],
  transformers: [transformerVariantGroup(), transformerDirectives()]
});
