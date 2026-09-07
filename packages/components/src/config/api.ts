/**
 * serviceManager shim —— 让组件库 / 文档站可以编译 CbImageSecret 组件
 *
 * ------------------------------------------------------------
 * 背景：
 * CbImageSecret.vue 原始代码通过 `import { serviceManager } from '#/config/api'`
 * 获取一个 HTTP 客户端，用于把业务文件路径转换为可访问的临时 URL。
 * 这是业务项目中的约定路径，组件库本身不实现该 service。
 *
 * 业务方在使用时应在自己的项目中提供 `#/config/api` 模块，
 * 导出真实的 serviceManager（包含 getHttp().getFileTempUrl() 能力），
 * 覆盖此 shim。
 *
 * 文档站和组件库 build 时，通过 VitePress alias 把 `#` 指向本目录，
 * 使路径可解析、编译可通过。文档演示时 getFileTempUrl 直接回传原始路径。
 */

/** HTTP 客户端接口（业务方需实现真实版本） */
export interface IHttpService {
  /** 根据业务文件路径获取可访问的临时 URL */
  getFileTempUrl(filePath: string): Promise<string>
}

/** serviceManager 接口 */
export interface IServiceManager {
  /** 获取 HTTP 服务实例 */
  getHttp(): IHttpService
}

/**
 * 文档站 / 组件库本地使用的 mock serviceManager。
 * 业务方应在项目中提供真实的 serviceManager 覆盖此 shim。
 */
const mockHttp: IHttpService = {
  // 文档演示：直接返回原始路径作为 URL
  getFileTempUrl(filePath: string): Promise<string> {
    return Promise.resolve(filePath)
  },
}

export const serviceManager: IServiceManager = {
  getHttp() {
    return mockHttp
  },
}
