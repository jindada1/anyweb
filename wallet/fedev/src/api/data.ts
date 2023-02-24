import { request } from "@/utils/request";

declare namespace API {
  /**种子 */
  type DataResponse = {
    mpri: string;
    mpub: string;
    seed: string;
  };
}

/**
 * 钱包的基础数据
 * @returns 钱包的基础数据
 */
export function getData() {
  return request<API.DataResponse>({
    url: "/data",
    method: "get",
  });
}
