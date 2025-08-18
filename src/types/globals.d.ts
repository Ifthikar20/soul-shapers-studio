// src/types/globals.d.ts
declare global {
    interface Window {
      gtag: (
        command: 'config' | 'event' | 'js' | 'set',
        targetId: string | Date,
        config?: any
      ) => void;
    }
  }
  
  export {};