const fs = require('fs')
const path = require('path')
// 找 vitepress / vite 版本（pnpm 结构）
function findPkg(name, from) {
  let dir = path.resolve(from)
  for (;;) {
    const p = path.join(dir, 'node_modules', name, 'package.json')
    if (fs.existsSync(p)) return JSON.parse(fs.readFileSync(p, 'utf8')).version
    const parent = path.dirname(dir)
    if (parent === dir) return null
    dir = parent
  }
}
// docs/package.json
try {
  const dp = JSON.parse(fs.readFileSync('docs/package.json', 'utf8'))
  console.log('docs deps:', JSON.stringify(dp.dependencies || {}), JSON.stringify(dp.devDependencies || {}))
} catch (e) { console.log('no docs/package.json') }
// 从 docs 目录向上找
console.log('vitepress:', findPkg('vitepress', 'docs'))
console.log('vite:', findPkg('vite', 'docs'))
