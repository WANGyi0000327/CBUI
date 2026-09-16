import * as XLSX from 'xlsx'
interface ExcelSheet {
  name: string
  data: unknown[][]
  total: number
}
interface ExcelFile {
  sheets: ExcelSheet[]
  totalData: number
}
//获取导入的表格多少条数据
export function countExcelData(file?: File): Promise<ExcelFile> {
  if (!file) return Promise.reject(new Error('文件不存在'))
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e: ProgressEvent<FileReader>) => {
      try {
        const data: ArrayBuffer = e.target!.result as ArrayBuffer
        const workbook: XLSX.WorkBook = XLSX.read(data, { type: 'array' })
        const sheets: ExcelSheet[] = workbook.SheetNames.map((sheetName: string) => {
          const worksheet: XLSX.WorkSheet = workbook.Sheets[sheetName]!
          const jsonData: unknown[][] = XLSX.utils.sheet_to_json(worksheet, {
            header: 1,
          })
          // 类型守卫判断表头
          const isHeader = jsonData[0]?.some(
            (cell: unknown) => typeof cell === 'string' && cell.toLowerCase().includes('name')
          )
          return {
            name: sheetName,
            data: isHeader ? jsonData.slice(1) : jsonData,
            total: isHeader ? jsonData.length - 1 : jsonData.length,
          }
        })
        const totalData = sheets.reduce((sum, sheet) => sum + sheet.total, 0)
        resolve({ sheets, totalData })
      } catch (err) {
        console.error('文件解析失败，请检查文件格式', err)
        reject(new Error('文件解析失败，请检查文件格式'))
      }
    }
    reader.onerror = (e: ProgressEvent<FileReader>) => {
      reject(new Error(`文件读取失败，错误--->${e}`))
    }
    reader.readAsArrayBuffer(file)
  })
}
