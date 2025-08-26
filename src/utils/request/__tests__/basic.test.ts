/**
 * 超级简化版本的 axios 请求封装测试
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import axios from "axios";
import { BasicRequest, createBasicRequest } from "../basic";

// Mock axios
vi.mock("axios", () => {
  const mockInstance = {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
  };

  return {
    default: {
      create: vi.fn(() => mockInstance),
    },
  };
});

const mockedAxios = vi.mocked(axios);

describe("Basic Request Module", () => {
  let request: BasicRequest;
  let mockInstance: any;

  beforeEach(() => {
    vi.clearAllMocks();

    // Create fresh mock instance for each test
    mockInstance = {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() },
      },
    };

    mockedAxios.create.mockReturnValue(mockInstance);

    // Create a new BasicRequest instance for each test
    request = new BasicRequest();
  });

  describe("HTTP Methods", () => {
    it("should make GET request", async () => {
      const mockResponse = { id: 1, name: "test" };
      mockInstance.get.mockResolvedValue(mockResponse);

      const result = await request.get("/users/1");

      expect(result).toEqual(mockResponse);
      expect(mockInstance.get).toHaveBeenCalledWith("/users/1", { params: undefined });
    });

    it("should make POST request", async () => {
      const mockResponse = { success: true };
      mockInstance.post.mockResolvedValue(mockResponse);

      const data = { name: "John" };
      const result = await request.post("/users", data);

      expect(result).toEqual(mockResponse);
      expect(mockInstance.post).toHaveBeenCalledWith("/users", data);
    });

    it("should make PUT request", async () => {
      const mockResponse = { id: 1, name: "Updated" };
      mockInstance.put.mockResolvedValue(mockResponse);

      const data = { name: "Updated" };
      const result = await request.put("/users/1", data);

      expect(result).toEqual(mockResponse);
      expect(mockInstance.put).toHaveBeenCalledWith("/users/1", data);
    });

    it("should make DELETE request", async () => {
      const mockResponse = { success: true };
      mockInstance.delete.mockResolvedValue(mockResponse);

      const result = await request.delete("/users/1");

      expect(result).toEqual(mockResponse);
      expect(mockInstance.delete).toHaveBeenCalledWith("/users/1", { params: undefined });
    });
  });

  describe("File Upload", () => {
    it("should upload file", async () => {
      const mockResponse = { url: "/uploads/file.jpg" };
      mockInstance.post.mockResolvedValue(mockResponse);

      const file = new File(["content"], "test.jpg", { type: "image/jpeg" });
      const result = await request.upload("/upload", file);

      expect(result).toEqual(mockResponse);
      expect(mockInstance.post).toHaveBeenCalledWith(
        "/upload",
        expect.any(FormData),
        expect.objectContaining({
          headers: { "Content-Type": "multipart/form-data" },
        }),
      );
    });

    it("should upload FormData", async () => {
      const mockResponse = { url: "/uploads/file.jpg" };
      mockInstance.post.mockResolvedValue(mockResponse);

      const formData = new FormData();
      formData.append("file", new File(["content"], "test.jpg"));

      const result = await request.upload("/upload", formData);

      expect(result).toEqual(mockResponse);
      expect(mockInstance.post).toHaveBeenCalledWith("/upload", formData, expect.any(Object));
    });
  });

  describe("Custom Instance", () => {
    it("should create custom request instance", () => {
      const customRequest = createBasicRequest({
        baseURL: "/custom-api",
        timeout: 15000,
        token: "test-token",
      });

      expect(customRequest).toBeDefined();
      expect(mockedAxios.create).toHaveBeenCalledWith(
        expect.objectContaining({
          baseURL: "/custom-api",
          timeout: 15000,
        }),
      );
    });
  });

  describe("Error Handling", () => {
    it("should handle request errors", async () => {
      mockInstance.get.mockRejectedValue(new Error("Network Error"));

      await expect(request.get("/error")).rejects.toThrow("Network Error");
    });
  });

  describe("Request with Params", () => {
    it("should handle GET request with params", async () => {
      const mockResponse = { data: [] };
      mockInstance.get.mockResolvedValue(mockResponse);

      const params = { page: 1, size: 10 };
      await request.get("/users", params);

      expect(mockInstance.get).toHaveBeenCalledWith("/users", { params });
    });

    it("should handle DELETE request with params", async () => {
      const mockResponse = { success: true };
      mockInstance.delete.mockResolvedValue(mockResponse);

      const params = { force: true };
      await request.delete("/users/1", params);

      expect(mockInstance.delete).toHaveBeenCalledWith("/users/1", { params });
    });
  });
});
