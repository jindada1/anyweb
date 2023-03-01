import { request } from '@/utils/request';

declare namespace API {
    type InitResponse = {
        baseUrl?: string;
        masterKey?: string;
    };
}

 export function init() {
    return request<API.InitResponse>(
        {
            url: '/init',
            method: 'get',
        }
    );
}