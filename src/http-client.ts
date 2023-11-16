import {
  HttpClientError,
  HttpClientOptions,
  HttpClientRequest,
  HttpClientResponse,
  HttpResponseStatusEnum,
  RequestOptions,
} from './types';

export class HttpClient {
  static instance = new HttpClient();

  private _options: HttpClientOptions;

  constructor(options: HttpClientOptions = {}) {
    this._options = {
      ...options,
      baseUrl: options.baseUrl || '',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };
  }

  get<T>(url: string, options: RequestOptions = {}) {
    return this._handleRequest<T>({ ...options, method: 'GET', url });
  }

  post<T>(
    url: string,
    body: HttpClientRequest['body'],
    options: RequestOptions = {}
  ) {
    return this._handleRequest<T>({ ...options, method: 'POST', body, url });
  }

  put<T>(
    url: string,
    body: HttpClientRequest['body'],
    options: RequestOptions = {}
  ) {
    return this._handleRequest<T>({ ...options, method: 'PUT', body, url });
  }

  patch<T>(
    url: string,
    body: HttpClientRequest['body'],
    options: RequestOptions = {}
  ) {
    return this._handleRequest<T>({ ...options, method: 'PATCH', body, url });
  }

  delete<T>(url: string, options: RequestOptions = {}) {
    return this._handleRequest<T>({ ...options, method: 'DELETE', url });
  }

  private async _handleRequest<T>(requestOrigin: HttpClientRequest) {
    const request =
      this._options.interceptors?.requestInterceptor?.(requestOrigin) ||
      requestOrigin;
    const { url, body, query, headers, ...fetchOptions } = request;

    const requestUrl = new URL(`${this._options.baseUrl}${url}`);
    const urlSearchParams = new URLSearchParams(
      query
        ? Object.entries(query)
            .filter(([_, value]) => value !== undefined)
            .map(([key, value]) => [key, `${value}`])
        : {}
    );
    requestUrl.search = urlSearchParams.toString();

    const requestBody = JSON.stringify(body);

    const requestHeaders = { ...this._options.headers, ...headers };

    return this._handleResponse<T>(
      await fetch(requestUrl, {
        ...this._options,
        ...fetchOptions,
        body: requestBody,
        headers: requestHeaders,
      })
    );
  }

  private async _handleResponse<T>(
    responseOrigin: Response
  ): Promise<HttpClientResponse<T>> {
    if (!responseOrigin.ok) {
      const errorBody = await responseOrigin.json();

      throw new HttpClientError({
        message: `Fetch failed (${responseOrigin.statusText})`,
        status: responseOrigin.status,
        headers: responseOrigin.headers,
        body: errorBody,
      });
    }

    const data: T =
      responseOrigin.status === HttpResponseStatusEnum.NO_CONTENT
        ? undefined
        : await responseOrigin.json();
    const response = { data, ...responseOrigin };
    return (
      this._options.interceptors?.responseInterceptor?.(response) || response
    );
  }
}
