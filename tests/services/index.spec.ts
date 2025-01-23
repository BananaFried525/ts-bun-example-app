import { describe, expect, test } from 'bun:test'
import { add } from '../../src/services'

describe('index', () => {
  describe('add', () => {
    test('2 + 3, Should return 5', () => {
      // prepare  
      const a = 2
      const b = 3
      const expected = 5
    
      // execute
      const actual = add(a, b)
    
      // assert
      expect(actual).not.toBeNull()
      expect(actual).not.toBeUndefined()
      expect(actual).not.toBeNaN()
      expect(actual).toBeNumber()
      expect(actual).toEqual(expected)
    })

    test('1 + 0, Should not equal 5', () => {
      // prepare  
      const a = 1
      const b = 0
      const expected = 5
    
      // execute
      const actual = add(a, b)
    
      // assert
      expect(actual).not.toBeNull()
      expect(actual).not.toBeUndefined()
      expect(actual).not.toBeNaN()
      expect(actual).toBeNumber()
      expect(actual).not.toEqual(expected)
    })
  })
})
