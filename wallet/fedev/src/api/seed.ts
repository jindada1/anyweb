import { request } from "@/utils/request";

declare namespace API {
  /**种子 */
  type SeedResponse = string;
}

/**
 * 获取种子
 * @param params 可以是助记语
 * @returns 一串哈希种子
 */
export function genSeed(params: { sentence: string }) {
  return request<API.SeedResponse>({
    url: "/seed/gen",
    method: "get",
    params,
  });
}

/**
 * 选择种子
 * @param params 可以种子
 * @returns bool
 */
export function confirmSeed(params: { seed: string }) {
  return request<API.SeedResponse>({
    url: "/seed/confirm",
    method: "get",
    params,
  });
}
