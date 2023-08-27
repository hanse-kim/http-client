type FetchApiOptions = Omit<RequestInit, 'method' | 'body'>;

/** Used when create HttpClient instance. */
export type HttpClientOptions = FetchApiOptions & {
  baseUrl?: string;
  interceptors?: {
    requestInterceptor?: (request: HttpClientRequest) => HttpClientRequest;
    responseInterceptor?: (
      response: HttpClientResponse<any>
    ) => HttpClientResponse<any>;
  };
};

/** Used in handleRequest. */
export type HttpClientRequest = FetchApiOptions & {
  url: string;
  method: HttpRequestMethod;
  body?: RequestBody;
  query?: RequestUrlQuery;
};

type HttpRequestMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

type RequestBody = Record<string, unknown>;

type RequestUrlQuery = Record<
  string,
  string | number | boolean | null | undefined
>;

/** Used in each request method. */
export type RequestOptions = Partial<
  Omit<HttpClientRequest, 'url' | 'method' | 'body'>
>;

export type HttpClientResponse<T> = Response & {
  data: T;
  status: HttpResponseStatusEnum;
};

export enum HttpResponseStatusEnum {
  OK = 200,
  Created = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

export class HttpClientError<E> extends Error {
  public readonly status: HttpResponseStatusEnum;
  public readonly headers: Headers;
  public readonly body: E;

  constructor({
    message,
    status,
    headers,
    body,
  }: {
    message: string;
    status: HttpResponseStatusEnum;
    headers: Headers;
    body: E;
  }) {
    super(message);
    this.status = status;
    this.headers = headers;
    this.body = body;
  }
}
