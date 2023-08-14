import {
  HttpClientError,
  HttpClientOptions,
  HttpClientRequest,
  HttpClientResponse,
  HttpResponseStatusEnum,
  RequestOptions,
} from './types';

export class HttpClient {
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

  async request<T>({
    url,
    body,
    query,
    headers,
    ...request
  }: HttpClientRequest): Promise<HttpClientResponse<T>> {
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

    const response = await fetch(requestUrl, {
      ...this._options,
      ...request,
      body: requestBody,
      headers: requestHeaders,
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
