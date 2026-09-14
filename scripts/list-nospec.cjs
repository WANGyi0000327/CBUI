const fs = require('fs')
const path = require('path')
const srcDir = path.resolve('packages/components/src')
const dirs = fs
  .readdirSync(srcDir, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort()
const noSpec = []
for (const dir of dirs) {
  const files = fs.readdirSync(path.join(srcDir, dir))
  const hasSpec = files.some((f) => f.endsWith('.spec.ts'))
  if (!hasSpec) noSpec.push(dir)
}
console.log('组件/目录总数:', dirs.length)
console.log('无 spec.ts 的目录（' + noSpec.length + '）:')
noSpec.forEach((d) => console.log('  - ' + d))
