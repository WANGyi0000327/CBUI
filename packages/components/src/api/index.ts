// CbColControl 远程表头配置 API 适配层
// 业务侧接入：在应用入口挂载全局 serviceManager 与 SaApiName（window.serviceManager / window.SaApiName）
// 未挂载时降级为本地模式（get 返回空配置走本地初始化、save 静默成功），组件仍可完整使用
declare global {
  interface Window {
    serviceManager?: {
      getHttp: () => {
        post: (url: string, params?: unknown) => Promise<unknown>
        get: (url: string, params?: unknown) => Promise<unknown>
      }
    }
    SaApiName?: string
  }
}

const resolveService = () => (typeof window !== 'undefined' ? window.serviceManager : undefined)

const apiPrefix = () => (typeof window !== 'undefined' && window.SaApiName) || 'sa'

// 保存表头配置
export const tableHeaderSave = (params: Record<string, unknown>) => {
  const service = resolveService()
  if (!service) {
    return Promise.resolve({ code: 0, msg: 'local' })
  }
  return service.getHttp().post(`${apiPrefix()}/v1/tableHeader/save`, params)
}

// 获取表头配置
export const getHeaderColumnList = (params: { appCode: string; tableCode: string }) => {
  const service = resolveService()
  if (!service) {
    return Promise.resolve({ column: [], showColumn: [] })
  }
  return service.getHttp().get(`${apiPrefix()}/v1/tableHeader/getColumnList`, params)
}
