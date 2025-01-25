import fs from 'fs'
import path from 'path'
import type { Adapter, HTTPController, Route } from '../types/routers'
import { Router } from 'express'

export const loadRoutesPath = (dirPath: string): string[] => {
  const endpointPath: string[] = []

  // read files in routes
  fs.readdirSync(dirPath).forEach((file) => {
    if (fs.lstatSync(path.join(dirPath, file)).isDirectory()) {
      // NOTE - recursive if is a directory
      const dirName = file
      const endpoints = loadRoutesPath(path.join(dirPath, dirName))

      endpointPath.push(...(endpoints.map((url) => `${dirName}/${url}`)))
    } else if (file !== 'index.ts') {
      const url = file.split('.')[0]
      endpointPath.push(url)
    }
  })

  return endpointPath
}

export const createAdapter = <T>(controller: HTTPController<T>, options?: any): Adapter => {
  return async (req, res, next) => {
    try {
      const result = await controller(req)
  
      res.status(200).json({
        statusCode: 200,
        statusMessage: 'Success',
        data: result,
      })
      return
    } catch (error) {
      next(error)
    }
  }
}

export const loadAppRoutes = (routes: Route[]): Router => {
  const router = Router()

  routes.forEach((route) => {
    router[route.method](route.path, ...route.middleware, route.handler)
  })

  return router
}

export const loadEndpoints = (endpointPaths: string[]): Router => {
  const router = Router()
  endpointPaths.forEach((endpointPath) => {
    const filePath = path.join(__dirname, `../routes/${endpointPath}`)
    const routes = require(filePath).default as Route[]

    const _router = loadAppRoutes(routes)

    router.use(`/${endpointPath}`, _router)
  })

  return router
}