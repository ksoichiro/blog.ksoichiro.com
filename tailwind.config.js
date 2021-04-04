module.exports = {
  // cssPath: '~/assets/css/tailwind.scss',
  purge: [
    './components/**/*.{vue,js}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}',
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
    colors: {
      transparent: 'transparent',
      nord0: '#2E3440',
      'nord0-dark': '#252a34', // darken($nord0, 4%) by scss
      nord1: '#3B4252',
      nord2: '#434C5E',
      nord3: '#4C566A',
      nord4: '#D8DEE9',
      nord5: '#E5E9F0',
      nord6: '#ECEFF4',
      nord7: '#8FBCBB',
      nord8: '#88C0D0',
      nord9: '#81A1C1',
      nord10: '#5E81AC',
      nord11: '#BF616A',
      nord12: '#D08770',
      nord13: '#EBCB8B',
      nord14: '#A3BE8C',
      nord15: '#B48EAD',
    },
    fontFamily: {
      main: ['Inter', '"M PLUS 1p"','"Noto Sans JP"', '-apple-system', 'BlinkMacSystemFont', '"Helvetica Neue"', '"Segoe UI"', '"Yu Gothic"', 'YuGothic', '"Hiragino Kaku Gothic ProN"', '"Hiragino Sans"', '"ヒラギノ角ゴ ProN W3"', 'Verdana', 'Meiryo', '"M+ 1p"', 'sans-serif'],
      mono: ['"Roboto Mono"', 'source-code-pro', 'Menlo', 'Monaco', 'Consolas', '"Courier New"', 'monospace'],
    }
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
