import { describe, expect, test } from 'bun:test'
import type { Request } from "express";
import { exampleController } from '../../src/controllers/example.controller';

describe('example.controller', () => {
  test('Should return a message', async () => {
    const req = {} as Request

    const actual = await exampleController(req)

    expect(actual).not.toBeNull()
    expect(actual).not.toBeUndefined()
    expect(actual).not.toBeNaN()
    expect(actual).toBeObject()
    expect(actual.message).toBe('Hello World')
  })
});
