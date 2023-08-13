import {
  HttpClientError,
  HttpClientOptions,
  HttpClientRequest,
  HttpClientResponse,
  HttpHeaders,
  HttpResponseStatusEnum,
  RequestOptions,
} from './types';

export class HttpClient {
  private _baseUrl: string;
  private _headers: HttpHeaders;
  private _cache: RequestCache;

  constructor(options?: HttpClientOptions) {
    this._baseUrl = options?.baseUrl || '';
    this._headers = {
      'Content-Type': 'application/json',
      ...options?.headers,
    };
    this._cache = options?.cache || 'default';
  }

  async request<T>({
    url,
    body,
    query,
    cache,
    headers,
    ...request
  }: HttpClientRequest): Promise<HttpClientResponse<T>> {
    const requestBody = JSON.stringify(body);

    const requestUrl = new URL(`${this._baseUrl}${url}`);
    const urlSearchParams = new URLSearchParams(
      query
        ? Object.entries(query)
            .filter(([_, value]) => value !== undefined)
            .map(([key, value]) => [key, `${value}`])
        : {}
    );
    requestUrl.search = urlSearchParams.toString();

    const requestHeaders = new Headers();
    this._headers &&
      Object.entries(this._headers).forEach(([key, value]) =>
        requestHeaders.append(key, value)
      );
    headers &&
      Object.entries(headers).forEach(([key, value]) =>
        requestHeaders.append(key, value)
      );

    const response = await fetch(requestUrl, {
      ...request,
      body: requestBody,
      headers: requestHeaders,
      cache: this._cache || cache,
    });

    if (!response.ok) {
      const errorBody = await response.json();

      throw new HttpClientError({
        message: `Fetch failed (${response.statusText})`,
        status: response.status,
        headers: response.headers,
        body: errorBody,
      });
    }

    const data: T =
      response.status === HttpResponseStatusEnum.NO_CONTENT
        ? undefined
        : await response.json();
    return { data, ...response };
  }

  get<T>(url: string, options: RequestOptions = {}) {
    return this.request<T>({ ...options, method: 'GET', url });
  }

  post<T>(
    url: string,
    body: HttpClientRequest['body'],
    options: RequestOptions = {}
  ) {
    return this.request<T>({ ...options, method: 'POST', body, url });
  }

  put<T>(
    url: string,
    body: HttpClientRequest['body'],
    options: RequestOptions = {}
  ) {
    return this.request<T>({ ...options, method: 'PUT', body, url });
  }

  patch<T>(
    url: string,
    body: HttpClientRequest['body'],
    options: RequestOptions = {}
  ) {
    return this.request<T>({ ...options, method: 'PATCH', body, url });
  }

  delete<T>(url: string, options: RequestOptions = {}) {
    return this.request<T>({ ...options, method: 'DELETE', url });
  }
}
