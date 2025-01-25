import type { Request, Response, NextFunction } from "express";
import type { HTTPController } from "../types/routers";
import type { ExampleResponse } from "../types/controllers/example";

export const exampleController: HTTPController<ExampleResponse> = async (req: Request): Promise<ExampleResponse> => {
  return {
    message: 'Hello World'
  }
}