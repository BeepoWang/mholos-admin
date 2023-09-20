import { FileSystemIconLoader } from '@iconify/utils/lib/loader/node-loaders';
import {
  defineConfig,
  presetUno,
  presetIcons,
  presetAttributify,
  transformerVariantGroup,
  transformerDirectives,
  toEscapedSelector as e
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
  transformers: [transformerVariantGroup(), transformerDirectives()],
  rules: [
    [
      /^custom-hover$/,
      // eslint-disable-next-line no-empty-pattern
      ([], { rawSelector }) => {
        const selector = e(rawSelector);
        return `
${selector} {
  display: flex;
  height: 100%;
  padding: 1px 10px 0;
  cursor: pointer;
  align-items: center;
  transition: background var(--transition-time-02);
}
/* you can have multiple rules */
${selector}:hover {
  background-color: var(--top-header-hover-color);
}
.dark ${selector}:hover {
  background-color: var(--el-bg-color-overlay);
}
`;
      }
    ]
  ]
});
