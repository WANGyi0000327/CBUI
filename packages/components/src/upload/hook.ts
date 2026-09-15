import * as XLSX from 'xlsx'
interface ExcelData {
  [key: string]: any
}
interface ExcelSheet {
  name: string
  data: ExcelData[]
}
interface ExcelFile {
  sheets: ExcelSheet[]
  totalData: number
}
//获取导入的表格多少条数据
export function countExcelData(file?: any): Promise<ExcelFile> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e: ProgressEvent<FileReader>) => {
      try {
        const data: ArrayBuffer = e.target!.result as ArrayBuffer
        const workbook: XLSX.WorkBook = XLSX.read(data, { type: 'array' })
        const sheets: ExcelSheet[] = workbook.SheetNames.map((sheetName: string) => {
          const worksheet: XLSX.WorkSheet = workbook.Sheets[sheetName] as any
          const jsonData: ExcelData[] = XLSX.utils.sheet_to_json(worksheet, {
            header: 1,
          })
          // 类型守卫判断表头
          const isHeader = jsonData[0]?.some(
            (cell: any) => typeof cell === 'string' && cell.toLowerCase().includes('name')
          )
          return {
            name: sheetName,
            data: isHeader ? jsonData.slice(1) : jsonData,
            total: isHeader ? jsonData.length - 1 : jsonData.length,
          }
        })
        const totalData = sheets.reduce((sum, sheet: any) => sum + sheet.total, 0)
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
