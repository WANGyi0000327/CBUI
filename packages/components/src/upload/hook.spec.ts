import { describe, it, expect, vi } from 'vitest'
import { countExcelData } from './hook'
import * as XLSX from 'xlsx'

// 包装 read 使其可被 mock（ESM 命名导出默认不可配置），默认仍走真实实现
vi.mock('xlsx', async () => {
  const actual = await vi.importActual<typeof import('xlsx')>('xlsx')
  return { ...actual, read: vi.fn(actual.read) }
})

// 用真实 XLSX 库生成测试用工作簿文件
const buildXlsxFile = (sheets: { name: string; rows: (string | number)[][] }[]) => {
  const wb = XLSX.utils.book_new()
  sheets.forEach(({ name, rows }) => {
    const ws = XLSX.utils.aoa_to_sheet(rows)
    XLSX.utils.book_append_sheet(wb, ws, name)
  })
  const data = XLSX.write(wb, { type: 'array', bookType: 'xlsx' }) as ArrayBuffer
  return new File([data], 'test.xlsx')
}

describe('countExcelData 导入表格数据统计', () => {
  it('首行包含 name 字段时按表头解析并剔除表头行', async () => {
    const file = buildXlsxFile([{ name: '人员', rows: [['name', 'age'], ['张三', 30], ['李四', 25]] }])
    const result = await countExcelData(file)
    expect(result.sheets).toHaveLength(1)
    expect(result.sheets[0]!.name).toBe('人员')
    expect(result.sheets[0]!.data).toHaveLength(2)
    expect(result.totalData).toBe(2)
  })

  it('首行不含 name 字段时不按表头解析，全部计入', async () => {
    const file = buildXlsxFile([{ name: 'Sheet1', rows: [[1, 2], [3, 4], [5, 6]] }])
    const result = await countExcelData(file)
    expect(result.sheets[0]!.data).toHaveLength(3)
    expect(result.totalData).toBe(3)
  })

  it('多 sheet 时 totalData 为各 sheet 数据量之和', async () => {
    const file = buildXlsxFile([
      { name: '有表头', rows: [['name', 'v'], ['a', 1], ['b', 2]] },
      { name: '无表头', rows: [[1], [2]] },
    ])
    const result = await countExcelData(file)
    expect(result.sheets).toHaveLength(2)
    expect(result.totalData).toBe(2 + 2)
  })

  it('首行 cell 为数字时不触发表头判断（typeof 守卫）', async () => {
    const file = buildXlsxFile([{ name: 'S', rows: [[2024, 1], [2025, 2]] }])
    const result = await countExcelData(file)
    expect(result.sheets[0]!.data).toHaveLength(2)
    expect(result.totalData).toBe(2)
  })

  it('XLSX 解析抛错时 reject 并提示文件解析失败', async () => {
    vi.mocked(XLSX.read).mockImplementationOnce(() => {
      throw new Error('boom')
    })
    const bad = new File(['x'], 'bad.xlsx')
    await expect(countExcelData(bad)).rejects.toThrow('文件解析失败')
  })
})
