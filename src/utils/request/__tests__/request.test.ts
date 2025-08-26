import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';
import { ElMessage } from 'element-plus';
import { request, createRequest } from '../index';
import type { RequestMethodConfig } from '../types';

// Mock dependencies
vi.mock('axios');
vi.mock('element-plus');
vi.mock('@/stores/user', () => ({
  useUserStore: () => ({
    token: 'mock-token',
    logout: vi.fn(),
  }),
}));
vi.mock('@/router', () => ({
  default: {
    push: vi.fn(),
  },
}));
vi.mock('@/config/index', () => ({
  default: {
    baseUrl: '/api',
    timeout: 30000,
  },
}));

const mockedAxios = vi.mocked(axios);
const mockedElMessage = vi.mocked(ElMessage);

describe('Request Module', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock axios.create
    const mockInstance = {
      request: vi.fn(),
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
      interceptors: {
        request: {
          use: vi.fn(),
        },
        response: {
          use: vi.fn(),
        },
      },
    };
    
    mockedAxios.create.mockReturnValue(mockInstance as any);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Basic HTTP Methods', () => {
    it('should make GET request successfully', async () => {
      const mockResponse = { data: { code: 200, data: { id: 1, name: 'test' } } };
      const mockAxiosInstance = mockedAxios.create();
      mockAxiosInstance.request = vi.fn().mockResolvedValue(mockResponse.data.data);

      const result = await request.get('/users/1');
      
      expect(result).toEqual({ id: 1, name: 'test' });
    });

    it('should make POST request with data', async () => {
      const mockResponse = { data: { code: 200, data: { id: 1, name: 'John' } } };
      const mockAxiosInstance = mockedAxios.create();
      mockAxiosInstance.request = vi.fn().mockResolvedValue(mockResponse.data.data);

      const postData = { name: 'John', email: 'john@example.com' };
      const result = await request.post('/users', postData);
      
      expect(result).toEqual({ id: 1, name: 'John' });
    });

    it('should make PUT request', async () => {
      const mockResponse = { data: { code: 200, data: { id: 1, name: 'John Updated' } } };
      const mockAxiosInstance = mockedAxios.create();
      mockAxiosInstance.request = vi.fn().mockResolvedValue(mockResponse.data.data);

      const putData = { name: 'John Updated' };
      const result = await request.put('/users/1', putData);
      
      expect(result).toEqual({ id: 1, name: 'John Updated' });
    });

    it('should make DELETE request', async () => {
      const mockResponse = { data: { code: 200, data: { success: true } } };
      const mockAxiosInstance = mockedAxios.create();
      mockAxiosInstance.request = vi.fn().mockResolvedValue(mockResponse.data.data);

      const result = await request.delete('/users/1');
      
      expect(result).toEqual({ success: true });
    });

    it('should make PATCH request', async () => {
      const mockResponse = { data: { code: 200, data: { id: 1, status: 'active' } } };
      const mockAxiosInstance = mockedAxios.create();
      mockAxiosInstance.request = vi.fn().mockResolvedValue(mockResponse.data.data);

      const patchData = { status: 'active' };
      const result = await request.patch('/users/1', patchData);
      
      expect(result).toEqual({ id: 1, status: 'active' });
    });
  });

  describe('File Operations', () => {
    it('should upload file successfully', async () => {
      const mockResponse = { data: { code: 200, data: { url: '/uploads/file.jpg' } } };
      const mockAxiosInstance = mockedAxios.create();
      mockAxiosInstance.request = vi.fn().mockResolvedValue(mockResponse.data.data);

      const mockFile = new File(['file content'], 'test.jpg', { type: 'image/jpeg' });
      const result = await request.upload('/upload', mockFile);
      
      expect(result).toEqual({ url: '/uploads/file.jpg' });
    });

    it('should validate file size during upload', async () => {
      const mockFile = new File(['x'.repeat(1000000)], 'large.jpg', { type: 'image/jpeg' });
      
      await expect(
        request.upload('/upload', mockFile, { maxSize: 100000 })
      ).rejects.toThrow('文件大小超过限制');
    });

    it('should validate file type during upload', async () => {
      const mockFile = new File(['file content'], 'test.txt', { type: 'text/plain' });
      
      await expect(
        request.upload('/upload', mockFile, { accept: '.jpg,.png' })
      ).rejects.toThrow('不支持的文件类型');
    });
  });

  describe('Batch Operations', () => {
    it('should handle concurrent requests', async () => {
      const mockAxiosInstance = mockedAxios.create();
      mockAxiosInstance.request = vi.fn()
        .mockResolvedValueOnce({ data: 'response1' })
        .mockResolvedValueOnce({ data: 'response2' })
        .mockResolvedValueOnce({ data: 'response3' });

      const requests: RequestMethodConfig[] = [
        { method: 'GET', url: '/api/1' },
        { method: 'GET', url: '/api/2' },
        { method: 'GET', url: '/api/3' },
      ];

      const results = await request.concurrent(requests);
      
      expect(results).toHaveLength(3);
      expect(results).toEqual([
        { data: 'response1' },
        { data: 'response2' },
        { data: 'response3' },
      ]);
    });

    it('should handle queue requests with concurrency limit', async () => {
      const mockAxiosInstance = mockedAxios.create();
      const requestSpy = vi.fn()
        .mockResolvedValueOnce({ data: 'response1' })
        .mockResolvedValueOnce({ data: 'response2' })
        .mockResolvedValueOnce({ data: 'response3' });
      
      mockAxiosInstance.request = requestSpy;

      const requests: RequestMethodConfig[] = [
        { method: 'GET', url: '/api/1' },
        { method: 'GET', url: '/api/2' },
        { method: 'GET', url: '/api/3' },
      ];

      const results = await request.queue(requests, 2);
      
      expect(results).toHaveLength(3);
      expect(requestSpy).toHaveBeenCalledTimes(3);
    });
  });

  describe('Custom Request Instance', () => {
    it('should create custom request instance with config', () => {
      const customRequest = createRequest({
        baseURL: '/custom-api',
        timeout: 15000,
        withToken: false,
      });

      expect(customRequest).toBeDefined();
      expect(mockedAxios.create).toHaveBeenCalledWith(
        expect.objectContaining({
          baseURL: '/custom-api',
          timeout: 15000,
        })
      );
    });

    it('should use custom config in requests', async () => {
      const customRequest = createRequest({
        showErrorMessage: false,
        showSuccessMessage: true,
      });

      const mockAxiosInstance = mockedAxios.create();
      mockAxiosInstance.request = vi.fn().mockResolvedValue({ data: 'success' });

      await customRequest.get('/test');
      
      expect(mockAxiosInstance.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          url: '/test',
        })
      );
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors', async () => {
      const mockAxiosInstance = mockedAxios.create();
      const networkError = new Error('Network Error');
      networkError.name = 'AxiosError';
      (networkError as any).isAxiosError = true;
      
      mockAxiosInstance.request = vi.fn().mockRejectedValue(networkError);

      await expect(request.get('/test')).rejects.toThrow('Network Error');
    });

    it('should handle HTTP error responses', async () => {
      const mockAxiosInstance = mockedAxios.create();
      const httpError = new Error('Request failed');
      (httpError as any).response = {
        status: 404,
        data: { message: 'Not Found' },
      };
      (httpError as any).isAxiosError = true;
      
      mockAxiosInstance.request = vi.fn().mockRejectedValue(httpError);

      await expect(request.get('/not-found')).rejects.toThrow();
    });
  });
});