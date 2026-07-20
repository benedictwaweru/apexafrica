import {
  type UseMutationOptions,
  type UseQueryOptions,
  useMutation,
  useQuery,
} from '@tanstack/react-query';
import * as axios from 'axios';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export const axiosInstance = axios.create({ withCredentials: true });

type ApiRequestOptions = {
  method: HttpMethod;
  url: string;
  data?: unknown;
  config?: axios.AxiosRequestConfig;
};

export async function apiRequest<T>({
  method,
  url,
  data,
  config,
}: ApiRequestOptions): Promise<T> {
  try {
    const methodMap = {
      GET: () => axiosInstance.get<T>(url, config),
      POST: () => axiosInstance.post<T>(url, data, config),
      PUT: () => axiosInstance.put<T>(url, data, config),
      PATCH: () => axiosInstance.patch<T>(url, data, config),
      DELETE: () => axiosInstance.delete<T>(url, config),
    } as const;

    const request = methodMap[method];
    if (!request) {
      throw new Error(`Unsupported HTTP method: ${method}`);
    }

    const response = await request();

    return response.data;
  } catch (error) {
    const axiosError = error as axios.AxiosError;

    throw axiosError.response?.data ?? axiosError.message;
  }
}

type QueryOptions<T> = {
  queryKey: string[];
  url: string;
  config?: axios.AxiosRequestConfig;
  options?: Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'>;
};

export function useApiQuery<T>({
  queryKey,
  url,
  config,
  options,
}: QueryOptions<T>) {
  const queryOptions = {
    method: 'GET' as HttpMethod,
    url,
    data: undefined,
    config,
  };

  return useQuery<T>({
    queryKey,
    queryFn: () => apiRequest<T>(queryOptions),
    ...options,
  });
}

type MutationOptions<
  TResponse,
  TVariables extends Record<string, unknown> = Record<string, unknown>,
> = {
  method: HttpMethod;
  url: string;
  options?: UseMutationOptions<TResponse, Error, TVariables>;
};

export function useApiMutation<
  TResponse,
  TVariables extends Record<string, unknown> = Record<string, unknown>,
>({ method, url, options }: MutationOptions<TResponse, TVariables>) {
  if (method === 'GET') {
    throw new Error(`GET methods aren't used with mutation functions`);
  }

  return useMutation<TResponse, Error, TVariables>({
    mutationFn: (data: TVariables) =>
      apiRequest<TResponse>({ method, url, data }),
    ...options,
  });
}
