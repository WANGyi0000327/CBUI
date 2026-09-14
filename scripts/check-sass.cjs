const fs = require('fs')
const root = JSON.parse(fs.readFileSync('package.json', 'utf8'))
console.log('root deps:', JSON.stringify({ ...(root.dependencies || {}), ...(root.devDependencies || {}) }))
for (const name of ['sass', 'sass-embedded', 'vite', 'vitepress']) {
  try {
    const p = JSON.parse(fs.readFileSync(`node_modules/${name}/package.json`, 'utf8'))
    console.log(`${name}:`, p.version)
  } catch {
    console.log(`${name}:`, 'not found')
  }
}
