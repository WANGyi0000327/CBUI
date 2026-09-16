const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

// 生成 eslint JSON 输出
execSync('npx eslint packages --ext .vue,.ts,.tsx,.cjs,.mjs -f json -o _lint_d.json', { cwd: 'D:/domexiangm720/CBUi', stdio: 'pipe' })

const raw = fs.readFileSync('D:/domexiangm720/CBUi/_lint_d.json', 'utf8')
const results = JSON.parse(raw)

const perFile = new Map()
let total = 0
for (const r of results) {
  const anys = (r.messages || []).filter((m) => m.ruleId === '@typescript-eslint/no-explicit-any')
  if (anys.length) {
    const rel = r.filePath.replace(/\\/g, '/').replace('D:/domexiangm720/CBUi/', '')
    perFile.set(rel, anys.length)
    total += anys.length
  }
}
const sorted = [...perFile.entries()].sort((a, b) => b[1] - a[1])
for (const [f, n] of sorted) console.log(`${f} (${n})`)
console.log(`TOTAL: ${total}`)
fs.unlinkSync('D:/domexiangm720/CBUi/_lint_d.json')
