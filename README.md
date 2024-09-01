<h1 align="center">@hanse-kim/http-client</h1>
<h4 align="center">A lightweight HTTP client library based on the Fetch API</h4>

`HttpClient` is a lightweight HTTP client library based on the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API), offering a simple and flexible API for making HTTP requests. This library allows you to easily perform basic HTTP operations and customize requests and responses using interceptors.

## Features

- Supports GET, POST, PUT, PATCH, DELETE request methods
- Reduce code redundancy by setting a base URL
- Customize requests and responses with interceptor support
- Provides type safety for catching errors at compile time

## Installation

### npm

```bash
npm install @hanse-kim/http-client
```

### yarn

```bash
yarn add @hanse-kim/http-client
```

## Usage

### Creating an Instance

You can create a basic HttpClient instance as follows:

```typescript
import { HttpClient } from 'your-http-client';

const client = new HttpClient({
  baseUrl: 'https://api.example.com',
  headers: {
    Authorization: 'Bearer your-token',
  },
});
```

### GET Request

```typescript
client
  .get<User[]>('/users')
  .then((response) => console.log(response.data))
  .catch((error) => console.error(error));
```

### POST Request

```typescript
client
  .post<User>('/users', { name: 'John Doe' })
  .then((response) => console.log(response.data))
  .catch((error) => console.error(error));
```

### PUT Request

```typescript
client
  .put<User>('/users/1', { name: 'Jane Doe' })
  .then((response) => console.log(response.data))
  .catch((error) => console.error(error));
```

### DELETE Request

```typescript
client
  .delete<void>('/users/1')
  .then(() => console.log('User deleted'))
  .catch((error) => console.error(error));
```

## Using Interceptors

You can intercept and modify requests and responses:

```typescript
const client = new HttpClient({
  interceptors: {
    requestInterceptor: (request) => {
      console.log('Request:', request);
      return request;
    },
    responseInterceptor: (response) => {
      console.log('Response:', response);
      return response;
    },
  },
});
```

## Error Handling

If the response has an error status, an `HttpClientError` exception will be thrown.

```typescript
client
  .get<User>('/invalid-url')
  .then((response) => console.log(response.data))
  .catch((error: HttpClientError<any>) => {
    console.error(`Error ${error.status}:`, error.body);
  });
```

## API

### HttpClient Class

- **`constructor(options?: HttpClientOptions)`**: Creates a new `HttpClient` instance.
- **`get<T>(url: string, options?: RequestOptions)`**: Performs a GET request.
- **`post<T>(url: string, body: RequestBody, options?: RequestOptions)`**: Performs a POST request.
- **`put<T>(url: string, body: RequestBody, options?: RequestOptions)`**: Performs a PUT request.
- **`patch<T>(url: string, body: RequestBody, options?: RequestOptions)`**: Performs a PATCH request.
- **`delete<T>(url: string, options?: RequestOptions)`**: Performs a DELETE request.

### HttpClientOptions

- **`baseUrl`**: Sets the base URL for all requests.
- **`headers`**: Sets default headers for all requests.
- **`interceptors`**: Allows you to define request and response interceptors.

### HttpClientRequest

- **`url`**: The URL to request.
- **`method`**: The HTTP method (GET, POST, PUT, PATCH, DELETE).
- **`body`**: The data to send with the request.
- **`query`**: Query parameters to append to the URL.

### HttpClientResponse

- **`data`**: Contains the response data.
- **`status`**: The HTTP status code of the response.

## License

MIT Licensed.
