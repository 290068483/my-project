// 重新导出新的request模块，保持向后兼容
export { request, createRequest, batch, legacyRequest } from "./request/index";
export type {
  ApiResponse,
  CreateRequestConfig,
  RequestMethodConfig,
  UploadConfig,
  DownloadConfig,
} from "./request/index";

// 导出默认request对象
export { request as default } from "./request/index";

// 保持与旧版Http.ts的兼容
import http from "./Http";
export { http };
