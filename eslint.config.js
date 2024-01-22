import antfu from '@antfu/eslint-config'

export default antfu({
  ignores: [
    'src/components/ui/**/*',
    'src/lib/circosJS/**/*',
  ],
  unocss: true,
})
