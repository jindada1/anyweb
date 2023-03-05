import { request } from "@/utils/request";

/**
 * 创建数字账户
 * @param data 创建数字账户需要的参数
 * @returns 创建好的数字账户
 */
export function createDA(data: API.DACreateParams) {
  return request<API.DAResponse>({
    url: "/da/create",
    method: "post",
    data,
  });
}

/**
 * 数字身份列表
 */
export function allDA(params: API.DAListParams) {
  return request<API.DAResponse[]>({
    url: "/da/list",
    method: "get",
    params
  });
}

/**
 * 数字账户详细信息
 */
export function detailDA(params: API.DADetailParams) {
  return request<API.DAResponse>({
    url: "/da/detail",
    method: "get",
    params,
  });
}

/**
 * 认证数字账户
 */
export function authDA(data: API.DAAuthParams) {
  return request<API.DAAuthResponse>({
    url: "/da/auth",
    method: "post",
    data,
  });
}

/**
 * 数字账户当前使用的凭证
 */
export function VC(params: API.DAVCParams) {
  return request<API.DAVCResponse>({
    url: "/da/vc",
    method: "get",
    params
  });
}
