/**
 * 简化版本的 axios 请求封装测试
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import axios from "axios";
import { simpleRequest, createSimpleRequest } from "../simple";
import type { SimpleRequestMethodConfig } from "../simple-config";

// Mock axios
vi.mock("axios");
const mockedAxios = vi.mocked(axios);

describe("Simple Request Module", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock axios.create
    const mockInstance = {
      request: vi.fn(),
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

  describe("Basic HTTP Methods", () => {
    it("should make GET request successfully", async () => {
      const mockResponse = { id: 1, name: "test user" };
      const mockAxiosInstance = mockedAxios.create();
      mockAxiosInstance.request = vi.fn().mockResolvedValue(mockResponse);

      const result = await simpleRequest.get("/users/1");

      expect(result).toEqual(mockResponse);
      expect(mockAxiosInstance.request).toHaveBeenCalledWith({
        method: "GET",
        url: "/users/1",
        params: undefined,
      });
    });

    it("should make POST request with data", async () => {
      const mockResponse = { id: 1, name: "John", email: "john@example.com" };
      const mockAxiosInstance = mockedAxios.create();
      mockAxiosInstance.request = vi.fn().mockResolvedValue(mockResponse);

      const postData = { name: "John", email: "john@example.com" };
      const result = await simpleRequest.post("/users", postData);

      expect(result).toEqual(mockResponse);
      expect(mockAxiosInstance.request).toHaveBeenCalledWith({
        method: "POST",
        url: "/users",
        data: postData,
      });
    });

    it("should make PUT request", async () => {
      const mockResponse = { id: 1, name: "John Updated" };
      const mockAxiosInstance = mockedAxios.create();
      mockAxiosInstance.request = vi.fn().mockResolvedValue(mockResponse);

      const putData = { name: "John Updated" };
      const result = await simpleRequest.put("/users/1", putData);

      expect(result).toEqual(mockResponse);
      expect(mockAxiosInstance.request).toHaveBeenCalledWith({
        method: "PUT",
        url: "/users/1",
        data: putData,
      });
    });

    it("should make DELETE request", async () => {
      const mockResponse = { success: true };
      const mockAxiosInstance = mockedAxios.create();
      mockAxiosInstance.request = vi.fn().mockResolvedValue(mockResponse);

      const result = await simpleRequest.delete("/users/1");

      expect(result).toEqual(mockResponse);
      expect(mockAxiosInstance.request).toHaveBeenCalledWith({
        method: "DELETE",
        url: "/users/1",
        params: undefined,
      });
    });

    it("should make PATCH request", async () => {
      const mockResponse = { id: 1, status: "active" };
      const mockAxiosInstance = mockedAxios.create();
      mockAxiosInstance.request = vi.fn().mockResolvedValue(mockResponse);

      const patchData = { status: "active" };
      const result = await simpleRequest.patch("/users/1", patchData);

      expect(result).toEqual(mockResponse);
      expect(mockAxiosInstance.request).toHaveBeenCalledWith({
        method: "PATCH",
        url: "/users/1",
        data: patchData,
      });
    });
  });

  describe("File Operations", () => {
    it("should upload file successfully", async () => {
      const mockResponse = { url: "/uploads/file.jpg" };
      const mockAxiosInstance = mockedAxios.create();
      mockAxiosInstance.request = vi.fn().mockResolvedValue(mockResponse);

      const mockFile = new File(["file content"], "test.jpg", { type: "image/jpeg" });
      const result = await simpleRequest.upload("/upload", mockFile);

      expect(result).toEqual(mockResponse);
      expect(mockAxiosInstance.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: "POST",
          url: "/upload",
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }),
      );
    });

    it("should handle FormData upload", async () => {
      const mockResponse = { url: "/uploads/file.jpg" };
      const mockAxiosInstance = mockedAxios.create();
      mockAxiosInstance.request = vi.fn().mockResolvedValue(mockResponse);

      const formData = new FormData();
      formData.append("file", new File(["content"], "test.txt"));

      const result = await simpleRequest.upload("/upload", formData);

      expect(result).toEqual(mockResponse);
      expect(mockAxiosInstance.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: "POST",
          url: "/upload",
          data: formData,
        }),
      );
    });
  });

  describe("Batch Operations", () => {
    it("should handle concurrent requests", async () => {
      const mockAxiosInstance = mockedAxios.create();
      mockAxiosInstance.request = vi
        .fn()
        .mockResolvedValueOnce({ data: "response1" })
        .mockResolvedValueOnce({ data: "response2" })
        .mockResolvedValueOnce({ data: "response3" });

      const requests: SimpleRequestMethodConfig[] = [
        { method: "GET", url: "/api/1" },
        { method: "GET", url: "/api/2" },
        { method: "GET", url: "/api/3" },
      ];

      const results = await simpleRequest.concurrent(requests);

      expect(results).toHaveLength(3);
      expect(results).toEqual([{ data: "response1" }, { data: "response2" }, { data: "response3" }]);
    });

    it("should handle queue requests with concurrency limit", async () => {
      const mockAxiosInstance = mockedAxios.create();
      const requestSpy = vi
        .fn()
        .mockResolvedValueOnce({ data: "response1" })
        .mockResolvedValueOnce({ data: "response2" })
        .mockResolvedValueOnce({ data: "response3" });

      mockAxiosInstance.request = requestSpy;

      const requests: SimpleRequestMethodConfig[] = [
        { method: "GET", url: "/api/1" },
        { method: "GET", url: "/api/2" },
        { method: "GET", url: "/api/3" },
      ];

      const results = await simpleRequest.queue(requests, 2);

      expect(results).toHaveLength(3);
      expect(requestSpy).toHaveBeenCalledTimes(3);
    });
  });

  describe("Custom Request Instance", () => {
    it("should create custom request instance with config", () => {
      const customRequest = createSimpleRequest({
        baseURL: "/custom-api",
        timeout: 15000,
        withToken: false,
      });

      expect(customRequest).toBeDefined();
      expect(mockedAxios.create).toHaveBeenCalledWith(
        expect.objectContaining({
          baseURL: "/custom-api",
          timeout: 15000,
        }),
      );
    });

    it("should use default config when no custom config provided", () => {
      const defaultRequest = createSimpleRequest();

      expect(defaultRequest).toBeDefined();
      expect(mockedAxios.create).toHaveBeenCalledWith(
        expect.objectContaining({
          baseURL: "/api",
          timeout: 10000,
        }),
      );
    });
  });

  describe("Error Handling", () => {
    it("should handle request errors", async () => {
      const mockAxiosInstance = mockedAxios.create();
      const error = new Error("Network Error");
      mockAxiosInstance.request = vi.fn().mockRejectedValue(error);

      await expect(simpleRequest.get("/error")).rejects.toThrow("Network Error");
    });

    it("should handle response errors with status codes", async () => {
      const mockAxiosInstance = mockedAxios.create();
      const error = {
        response: {
          status: 404,
          data: { message: "Not Found" },
        },
      };
      mockAxiosInstance.request = vi.fn().mockRejectedValue(error);

      await expect(simpleRequest.get("/not-found")).rejects.toThrow();
    });
  });

  describe("Request Configuration", () => {
    it("should pass through custom headers", async () => {
      const mockResponse = { success: true };
      const mockAxiosInstance = mockedAxios.create();
      mockAxiosInstance.request = vi.fn().mockResolvedValue(mockResponse);

      await simpleRequest.get(
        "/test",
        {},
        {
          headers: {
            "Custom-Header": "custom-value",
          },
        },
      );

      expect(mockAxiosInstance.request).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: {
            "Custom-Header": "custom-value",
          },
        }),
      );
    });

    it("should handle request params correctly", async () => {
      const mockResponse = { data: [] };
      const mockAxiosInstance = mockedAxios.create();
      mockAxiosInstance.request = vi.fn().mockResolvedValue(mockResponse);

      const params = { page: 1, size: 10 };
      await simpleRequest.get("/users", params);

      expect(mockAxiosInstance.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: "GET",
          url: "/users",
          params: params,
        }),
      );
    });
  });
});
