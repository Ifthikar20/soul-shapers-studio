// src/types/api.types.ts
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: {
      message: string;
      code: string;
      details?: any;
    };
    meta?: {
      timestamp: string;
      requestId: string;
    };
  }