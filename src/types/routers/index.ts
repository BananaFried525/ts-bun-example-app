import type { Request, Response, NextFunction } from "express";
type HTTP_METHOD = 'get' | 'post' | 'put' | 'delete' | 'patch'

export type Route = {
  path: string;
  method: HTTP_METHOD
  middleware: Middleware[];
  handler: Adapter;
}

export type IResponse = {
  statusCode: number;
  statusMessage: string;
  data?: any;
  errorMessage?: string;
}

export type Middleware = (req: Request, res: Response, next: NextFunction) => Promise<void>;

export type Adapter = (req: Request, res: Response, next: NextFunction) => void;

export type HTTPController<T> = (req: Request) => Promise<T>;