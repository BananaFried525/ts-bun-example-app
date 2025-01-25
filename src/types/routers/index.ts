import type { Request, Response, NextFunction } from "express";

export type Route = {
  path: string;
  method: 'get' | 'post' | 'put' | 'delete' | 'patch';
  middleware: Middleware[];
  handler: Adapter;
}

export type Middleware = (req: Request, res: Response, next: NextFunction) => Promise<void>;

export type Adapter = (req: Request, res: Response, next: NextFunction) => void;

export type HTTPController<T> = (req: Request) => Promise<T>;