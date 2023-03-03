import { request } from "@/utils/request";

/**
 * 创建数字身份
 * @param data 创建数字身份需要的参数
 * @returns 创建好的数字身份
 */
export function createDI(data: API.DIParams) {
  return request<API.DIResponse>({
    url: "/di/create",
    method: "post",
    data,
  });
}

/**
 * 数字身份列表
 */
export function allDI() {
  return request<API.DIResponse[]>({
    url: "/di/list",
    method: "get",
  });
}

/**
 * 数字身份详细信息
 */
export function detailDI(params: API.DIParams) {
  return request<API.DIResponse>({
    url: "/di/detail",
    method: "get",
    params
  });
}

/**
 * 数字身份链上认证
 */
export function authDI(data: API.DIAuthParams) {
  return request<API.DIVCResponse>({
    url: "/di/auth",
    method: "post",
    data
  });
}

/**
 * 数字身份凭证列表
 */
export function VCList(params: API.DIVCListParams) {
  return request<API.DIVCListResponse>({
    url: "/di/vcs",
    method: "get",
    params
  });
}

/**
 * 数字身份当前使用的凭证
 */
export function VC(params: API.DIVCListParams) {
  return request<API.DIVCResponse>({
    url: "/di/vc",
    method: "get",
    params
  });
}
