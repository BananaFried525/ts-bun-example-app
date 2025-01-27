import type { Response } from "express"
import logger from "./logger"
import type { IResponse } from "../types/routers"

export const unhandledError = (error: any, res: Response) => {
  logger.error(error)

  const response: IResponse = {
    statusCode: 500,
    statusMessage: 'Internal Server Error',
    errorMessage: error.message,
  }
  
  res.status(500).json(response)
}