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

  private async _handleRequest<T>({
    url,
    body,
    query,
    headers,
    ...request
  }: HttpClientRequest) {
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
        ...request,
        body: requestBody,
        headers: requestHeaders,
      })
    );
  }

  private async _handleResponse<T>(
    response: Response
  ): Promise<HttpClientResponse<T>> {
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
}
