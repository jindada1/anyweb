import { request } from '@/utils/request';
import { useFetchFactory } from "@/utils/factory";

declare namespace API {
    type TestResponse = string;
}

 export function test() {
    return request<API.TestResponse>(
        {
            url: '/test',
            method: 'get',
        }
    );
}

export const useTest = useFetchFactory<Object, API.TestResponse>(test)