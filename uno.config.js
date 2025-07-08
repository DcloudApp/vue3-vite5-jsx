import { FileSystemIconLoader } from '@iconify/utils/lib/loader/node-loaders'
import { createLocalFontProcessor } from '@unocss/preset-web-fonts/local'
import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetWebFonts,
  presetWind3,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  shortcuts: [
    ['input-reset', 'appearance-none rounded-none border-none outline-none bg-transparent'],
  ],
  rules: [
    ['scrollbar-none', {
      '-ms-overflow-style': 'none', /* IE 和 Edge */
      'scrollbar-width': 'none', /* Firefox */
    }],
    [/^scrollbar-none$/, () => ({
      '::-webkit-scrollbar': 'none', /* Chrome, Safari, Opera */
    })],
  ],
  presets: [
    presetWind3(),
    presetAttributify(),
    presetIcons({
      collections: {
        svg: FileSystemIconLoader('./src/assets/svg'),
        icon: FileSystemIconLoader('./src/assets/icon', (svg) => {
          return svg.replace('#ffffff', 'currentColor')
        }),
      },
    }),

    presetTypography(),
    presetWebFonts({
      provider: 'fontshare',
      fonts: {},
      processors: createLocalFontProcessor(),
    }),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
})
