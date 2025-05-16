declare module 'ioredis' {
    export class Redis {
      constructor(url?: string);
      set(key: string, value: string): Promise<string>;
      get(key: string): Promise<string | null>;
      del(key: string): Promise<number>;
      expire(key: string, seconds: number): Promise<number>;
      // Add other methods as needed
    }
  }