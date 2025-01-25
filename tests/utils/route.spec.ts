import { describe, expect, test, mock } from 'bun:test'

import { loadEndpoints, loadRoutesPath } from '../../src/utils/route'
import path from 'path'
import type { Router } from 'express';

const router = mock((): Router => {return {} as Router})

describe('route', () => {
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
});