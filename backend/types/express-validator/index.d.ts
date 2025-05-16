declare module 'express-validator' {
    import { Request, Response, NextFunction } from 'express';
  
    export interface ValidationChain {
      notEmpty(): unknown;
      isEmail(): unknown;
      isLength(arg0: { min: number; }): unknown;
      optional(): unknown;
      run(req: Request): Promise<any>;
      // Add other methods as needed
    }
  
    export function body(field: string): ValidationChain;
    export function validationResult(req: Request): {
      isEmpty(): boolean;
      array(): Array<any>;
    };
    // Add other exports as needed
  }