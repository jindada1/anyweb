declare namespace API {
  type ErrorResponse = {
    /** 业务约定的错误码 */
    errorCode: string;
    /** 业务上的错误信息 */
    errorMessage?: string;
    /** 业务上的请求是否成功 */
    success?: boolean;
  };

  /** 与后端约定好自定义的 Response 结构 */
  type Response<T = any> = {
    code: number;
    message: string;
    data: T;
  };

  /**数字身份参数 */
  type DIParams = {
    name: string;
  };

  /**数字身份的返回值 */
  type DIResponse = {
    pri?: string;
    pub?: string;
    name?: string;
    path?: string;
    route?: string;
  };

  /**数字身份认证参数 */
  type DIAuthParams = {
    di: string;
    declaration: string;
  };

  /**数字身份认证返回参数 */
  type DIVCResponse = {
    R: string;
    declaration: string;
    di: string;
    key: string;
    pk: string;
    s: string;
  };

  /**数字身份凭证请求参数 */
  type DIVCListParams = {
    di: string;
  };

  /**数字身份凭证列表 */
  type DIVCListResponse = DIVCResponse[]

  /**创建数字账户参数 */
  type DACreateParams = {
    di?: string;
    name?: string;
    puid?: string;
    ppk?: string;
  };

  /**查询数字账户列表参数 */
  type DAListParams = {
    di?: string;
  };

  /**查询数字账户参数 */
  type DADetailParams = {
    route?: string;
  };

  /**数字账户的返回值 */
  type DAResponse = {
    di?: string;
    DAID?: string;
    PUID?: string;
    name?: string;
    path?: string;
    pri?: string;
    pub?: string;
    route?: string;
    tokenUri?: string;
  };
}
