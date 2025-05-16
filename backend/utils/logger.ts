// backend/src/utils/logger.ts
export class Logger {
    private context: string;
  
    constructor(context: string) {
      this.context = context;
    }
  
    log(message: string): void {
      console.log(`[${this.context}] ${message}`);
    }
  
    error(message: string, trace?: string): void {
      console.error(`[${this.context}] ERROR: ${message}`);
      if (trace) {
        console.error(trace);
      }
    }
  
    warn(message: string): void {
      console.warn(`[${this.context}] WARN: ${message}`);
    }
  
    debug(message: string): void {
      if (process.env.NODE_ENV !== 'production') {
        console.debug(`[${this.context}] DEBUG: ${message}`);
      }
    }
  }