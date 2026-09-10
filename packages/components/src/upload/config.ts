export const EXTENSION_ALIASES: Record<string, string[]> = {
  '.xlsx': ['.xlsx', '.xls'],
  '.xls': ['.xlsx', '.xls'],
  '.docx': ['.docx', '.doc'],
  '.doc': ['.docx', '.doc'],
  '.jpg': ['.jpg', '.jpeg'],
  '.jpeg': ['.jpg', '.jpeg'],
}
export const MIME_TYPE_MAP: Record<string, string> = {
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
  'application/vnd.ms-excel': '.xls',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
    '.docx',
  'application/msword': '.doc',
  'application/pdf': '.pdf',
  'image/jpeg': '.jpg',
  'image/png': '.png',
}
