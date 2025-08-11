import { beforeEach, describe, expect, mock, spyOn, test } from 'bun:test'

import { unhandledError } from '../../src/utils/error'

describe('unhandledError', () => {
  let res: any = {
    status: mock(() => {
      return res
    }),
    json: mock(() => {
      return res
    })
  }

  test('Should throw an error', () => {
      const error = new Error('Test error')
      const response = spyOn(res, 'status').mockReturnValue(res)

      unhandledError(error, res)

      expect(response).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({ statusCode: 500, statusMessage: 'Internal Server Error', errorMessage: error.message })
  })
});
