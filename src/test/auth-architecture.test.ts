import { describe, it, expect } from 'vitest'
import {isValidEmail, validatePasswordStrength,sanitizeName } from '@/lib/auth.utils'
import { env } from '@/config/env.config'

describe('Auth Utils', () => {
  describe('Email Validation', () => {
    it('should validate correct email formats', () => {
      expect(isValidEmail('test@example.com')).toBe(true)
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true)
    })

    it('should reject invalid email formats', () => {
      expect(isValidEmail('invalid-email')).toBe(false)
      expect(isValidEmail('test@')).toBe(false)
      expect(isValidEmail('@domain.com')).toBe(false)
    })
  })

  describe('Password Validation', () => {
    it('should assess password strength correctly', () => {
      const weak = validatePasswordStrength('123')
      expect(weak.strength).toBe('weak')

      const strong = validatePasswordStrength('StrongPass123!')
      expect(strong.strength).toBe('strong')
    })
  })

  describe('Name Sanitization', () => {
    it('should sanitize names properly', () => {
      expect(sanitizeName('  João   Silva  ')).toBe('João Silva')
      expect(sanitizeName('Maria\t\tSantos')).toBe('Maria Santos')
    })
  })
})

describe('Environment Config', () => {
  it('should have required environment variables', () => {
    expect(env.API_BASE_URL).toBeDefined()
    expect(env.API_BASE_URL).toMatch(/^https?:\/\//)
    expect(env.APP_NAME).toBeDefined()
  })
})
