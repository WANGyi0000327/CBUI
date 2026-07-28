/**
 * TailwindCSS 预设
 * ------------------------------------------------------------
 * 统一定义 CB UI 组件库的设计 token
 * 所有颜色、圆角等通过此预设注入，保证 Tailwind 类与 Sass 变量一致
 */
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4B3FE3',
          50: '#F2F7FF',
          100: '#E5EAFF',
          200: '#A9AEFF',
          500: '#6F6FFF',
          600: '#4B3FE3',
          700: '#3C2ECA',
          900: '#1A1759',
        },
        success: '#1DC981',
        warning: '#EFAA17',
        danger: '#E8463A',
        info: '#22A5F7',
      },
      borderRadius: {
        cb: '8px',
        'cb-lg': '12px',
        'cb-full': '999px',
      },
      spacing: {
        'cb-4': '4px',
        'cb-8': '8px',
        'cb-12': '12px',
        'cb-16': '16px',
        'cb-20': '20px',
        'cb-24': '24px',
      },
      fontFamily: {
        sans: ['SF Pro Text', 'PingFang SC', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
    },
  },
}
