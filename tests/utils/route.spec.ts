import { describe, expect, test, mock, spyOn } from 'bun:test'

import { createAdapter, loadEndpoints, loadRoutesPath, notFoundEndpoint } from '../../src/utils/route'
import { setRateLimit } from '../../src/utils/route';

import path from 'path'
import rateLimit from 'express-rate-limit';
import type { HTTPController } from '../../src/types/routers';
import * as errorUtils from '../../src/utils/error';

describe('createAdapter', () => {
  test('Successful execution of the controller function', async () => {
    const mockController: HTTPController<any> = async (req: any) => {
      return { message: 'Hello World' };
    };

    const mockReq: any = {};
    const mockRes: any = {
      status: mock(() => mockRes),
      json: mock(),
    };

    const adapter = createAdapter(mockController);
    await adapter(mockReq, mockRes, mock());

    expect(mockRes.status).toHaveBeenCalledTimes(1);
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledTimes(1);
    expect(mockRes.json).toHaveBeenCalledWith({
      statusCode: 200,
      statusMessage: 'Success',
      data: { message: 'Hello World' },
    });
  });

  test('Error thrown by the controller function', async () => {
    const mockController: HTTPController<any> = async (req: any) => {
      throw new Error('Test error');
    };

    const mockReq: any = {};
    const mockRes: any = {
      status: mock(() => mockRes),
      json: mock(),
    };

    const adapter = createAdapter(mockController);
    await adapter(mockReq, mockRes, mock());

    expect(mockRes.status).toHaveBeenCalledTimes(1);
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledTimes(1);
    expect(mockRes.json).toHaveBeenCalledWith({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      errorMessage: 'Test error',
    });
  });

  test('Error handling by the unhandledError function', async () => {
    const mockError = new Error('Test error');
    const mockReq: any = {};
    const mockRes: any = {
      status: mock(() => mockRes),
      json: mock(),
    };

    const spyUnhandledError = spyOn(errorUtils, 'unhandledError');
    const adapter = createAdapter(async (req: any) => {
      throw mockError;
    });

    await adapter(mockReq, mockRes, mock());

    expect(spyUnhandledError).toHaveBeenCalledTimes(1);
    expect(spyUnhandledError).toHaveBeenCalledWith(mockError, mockRes);
  });
});

describe('loadRoutesPath', () => {
  test('Should return an array of routes', () => {
    // prepare  
    const dirPath = path.join(__dirname, '/../../src/routes')

    // execute
    const actual = loadRoutesPath(dirPath)

    // assert
    expect(actual).not.toBeNull()
    expect(actual).not.toBeUndefined()
    expect(actual).not.toBeNaN()
    expect(actual).toBeArray()
    expect(actual.length).toBeGreaterThan(0)
    expect(actual).toContain('v1/example')
  })
})

describe('loadEndpoints', () => {
  test('Should return an array of routes', () => {
    // prepare  
    const routes = ['v1/example']

    // execute
    const actual = loadEndpoints(routes)

    // assert
    expect(actual).not.toBeUndefined()
  })
})

describe('notFoundEndpoint', () => {
  let res: any = {
    status: mock(() => {
      return res
    }),
    json: mock(() => {
      return res
    })
  }

  test('Should throw an error', () => {
    const response = spyOn(res, 'status').mockReturnValue(res)
    const json = spyOn(res, 'json').mockReturnValue(res)
    const mockResponse = {
      statusCode: 404,
      statusMessage: 'Not Found',
      errorMessage: 'Route not found',
      data: null
    }


    notFoundEndpoint({}, res, {})

    expect(response).toHaveBeenCalledWith(404)
    expect(json).toHaveBeenCalledWith(mockResponse)
  })
});

describe('setRateLimit', () => {
  test('should return a RateLimitRequestHandler', () => {
    const limiter = setRateLimit();
    expect(limiter).toBeInstanceOf(rateLimit().constructor);
  });
});