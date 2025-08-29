async get<T = unknown>(
  url: string,
  params?: Record<string, unknown>,
  config?: AxiosRequestConfig,
): Promise<T> {
  const response = await this.instance.get(url, { params, ...config });
  return response.data as T; // ✅ 正确：返回response.data
}
