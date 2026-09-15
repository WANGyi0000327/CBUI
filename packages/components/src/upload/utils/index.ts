import { inflateSync } from 'fflate'
import { EXTENSION_ALIASES, MIME_TYPE_MAP } from '../config'
// 递归解压嵌套 zip 的最大深度，防止恶意构造的无限嵌套
const MAX_UNZIP_DEPTH = 5
export const getAcceptList = (accepts: string): string[] => {
  const list: string[] = []
  accepts
    .toLowerCase()
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .forEach((ext) => {
      const aliases = EXTENSION_ALIASES[ext] || [ext]
      aliases.forEach((alias) => {
        if (!list.includes(alias)) list.push(alias)
      })
    })
  return list
}
export const getExtByName = (fileName: string): string => {
  const idx = fileName.lastIndexOf('.')
  return idx >= 0 ? fileName.slice(idx).toLowerCase() : ''
}
const extToMime = (ext: string): string => {
  const entry = Object.entries(MIME_TYPE_MAP).find(([, value]) => value === ext)
  return entry?.[0] || ''
}
export const isZipFile = (file: File): boolean => {
  return getExtByName(file.name) === '.zip'
}
// 判断 Uint8Array 是否为 zip 数据（magic bytes: PK\x03\x04），用于识别嵌套 zip
export const isZipBuffer = (data: Uint8Array): boolean => {
  return (
    data.length >= 4 &&
    data[0] === 0x50 && // P
    data[1] === 0x4b && // K
    data[2] === 0x03 &&
    data[3] === 0x04
  )
}
interface RawZipEntry {
  name: string
  content: Uint8Array
}
interface ZipEntry {
  name: string
  content: Uint8Array
}
const utf8FatalDecoder = new TextDecoder('utf-8', { fatal: true })
const gbkDecoder = new TextDecoder('gbk')
// 解码 zip 文件名：优先按 UTF-8 严格解码，遇到非法字节回退 GBK
// （Windows 中文版资源管理器压缩的 zip 文件名默认用 GBK 且不设 UTF-8 标志位）
const decodeZipName = (bytes: Uint8Array): string => {
  try {
    return utf8FatalDecoder.decode(bytes)
  } catch {
    return gbkDecoder.decode(bytes)
  }
}
const readU16 = (data: Uint8Array, offset: number): number =>
  data[offset]! | (data[offset + 1]! << 8)
const readU32 = (data: Uint8Array, offset: number): number =>
  (data[offset]! |
    (data[offset + 1]! << 8) |
    (data[offset + 2]! << 16) |
    (data[offset + 3]! << 24)) >>>
  0
// 自解析 zip 中央目录，正确处理 GBK/UTF-8 文件名（fflate 不支持指定文件名编码）
// 压缩数据用 fflate 的 inflateSync 解压
const parseZip = (data: Uint8Array): RawZipEntry[] => {
  const len = data.length
  if (len < 22) throw new Error('无效的 zip 文件')
  // 定位 EOCD（End of Central Directory），签名 0x06054b50
  let eocd = -1
  const minScan = Math.max(0, len - 65557)
  for (let i = len - 22; i >= minScan; i--) {
    if (data[i] === 0x50 && data[i + 1] === 0x4b && data[i + 2] === 0x05 && data[i + 3] === 0x06) {
      eocd = i
      break
    }
  }
  if (eocd === -1) throw new Error('无效的 zip 文件：未找到结束标记')
  const totalEntries = readU16(data, eocd + 10)
  const cdOffset = readU32(data, eocd + 16)
  const entries: RawZipEntry[] = []
  let p = cdOffset
  for (let i = 0; i < totalEntries; i++) {
    if (data[p] !== 0x50 || data[p + 1] !== 0x4b || data[p + 2] !== 0x01 || data[p + 3] !== 0x02) {
      throw new Error('无效的 zip 文件：中央目录损坏')
    }
    const compression = readU16(data, p + 10)
    const compressedSize = readU32(data, p + 20)
    const nameLen = readU16(data, p + 28)
    const extraLen = readU16(data, p + 30)
    const commentLen = readU16(data, p + 32)
    const localOffset = readU32(data, p + 42)
    const name = decodeZipName(data.subarray(p + 46, p + 46 + nameLen))
    // 下一中央目录条目
    p += 46 + nameLen + extraLen + commentLen
    // 本地数据起点 = local header(30) + 其 nameLen + extraLen
    const dataOffset =
      localOffset + 30 + readU16(data, localOffset + 26) + readU16(data, localOffset + 28)
    const raw = data.subarray(dataOffset, dataOffset + compressedSize)
    let content: Uint8Array
    if (compression === 0) {
      // stored，未压缩
      content = raw
    } else if (compression === 8) {
      // deflate（fflate inflateSync 默认即 raw DEFLATE，与 zip method 8 一致）
      content = inflateSync(raw)
    } else {
      // 不支持的压缩方式，跳过该文件
      continue
    }
    entries.push({ name, content })
  }
  return entries
}
// 递归解压 zip 数据：遇到嵌套 zip 继续往下拆，收集符合 accept 后缀的普通文件
const unzipRecursive = async (
  data: Uint8Array,
  acceptList: string[],
  depth: number
): Promise<ZipEntry[]> => {
  if (depth > MAX_UNZIP_DEPTH) return []
  const parsed = parseZip(data)
  const tasks: Promise<ZipEntry[]>[] = []
  for (const { name, content } of parsed) {
    // 跳过目录与 macOS 元数据
    if (name.endsWith('/')) continue
    if (name.includes('__MACOSX') || name.endsWith('.DS_Store')) continue
    const fileName = name.split('/').pop() || name
    if (isZipBuffer(content)) {
      // 嵌套 zip：递归解压
      tasks.push(unzipRecursive(content, acceptList, depth + 1))
    } else {
      const ext = getExtByName(fileName)
      if (acceptList.includes(ext)) {
        tasks.push(Promise.resolve([{ name: fileName, content }]))
      }
    }
  }
  const groups = await Promise.all(tasks)
  return groups.flat()
}
// 解压 zip（含嵌套 zip），返回符合 accepts 后缀的文件列表
export const unZipByAccept = (file: File, accepts: string): Promise<File[]> => {
  const acceptList = getAcceptList(accepts)
  return new Promise((resolve, reject) => {
    file
      .arrayBuffer()
      .then((buffer) => unzipRecursive(new Uint8Array(buffer), acceptList, 1))
      .then((entries) => {
        const result: File[] = entries.map(({ name, content }) => {
          const ext = getExtByName(name)
          return new File([new Uint8Array(content)], name, {
            type: extToMime(ext),
            lastModified: file.lastModified,
          })
        })
        resolve(result)
      })
      .catch(reject)
  })
}
