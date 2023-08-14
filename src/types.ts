export type HttpClientOptions = Omit<RequestInit, 'method' | 'body'> & {
  baseUrl?: string;
};

export type HttpClientRequest = Omit<HttpClientOptions, 'baseUrl'> & {
  url: string;
  method: HttpRequestMethod;
  body?: RequestBody;
  query?: RequestUrlQuery;
};

type HttpRequestMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

type RequestBody = Record<string, unknown>;

type RequestUrlQuery = Record<string, string | number | boolean | null | undefined>;

export type RequestOptions = Partial<Omit<HttpClientRequest, 'url' | 'method'>>;

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
