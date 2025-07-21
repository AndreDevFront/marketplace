import {
  isTokenExpired,
  validatePasswordStrength,
  normalizeApiError,
  isValidEmail,
  sanitizeName,
  AUTH_ERRORS
} from '@/lib/auth.utils'
import { describe, expect, it } from 'vitest'


const createMockJWT = (expirationTime: number): string => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const payload = btoa(JSON.stringify({
    exp: expirationTime,
    sub: 'user123'
  }))
  return `${header}.${payload}.signature`
}

describe('isTokenExpired', () => {
  it('deve retornar false para token válido', () => {
    const futureTime = Math.floor(Date.now() / 1000) + 3600
    const token = createMockJWT(futureTime)
    expect(isTokenExpired(token)).toBe(false)
  })

  it('deve retornar true para token expirado', () => {
    const pastTime = Math.floor(Date.now() / 1000) - 3600
    const token = createMockJWT(pastTime)
    expect(isTokenExpired(token)).toBe(true)
  })

  it('deve retornar true para token inválido', () => {
    expect(isTokenExpired('token-invalido')).toBe(true)
    expect(isTokenExpired('')).toBe(true)
  })

  it('deve retornar true para token mal formado', () => {
    expect(isTokenExpired('header.payload-ruim.signature')).toBe(true)
  })
})

describe('validatePasswordStrength', () => {
  it('deve classificar senha forte corretamente', () => {
    const result = validatePasswordStrength('MinhaSenh@123')

    expect(result.strength).toBe('strong')
    expect(result.score).toBe(5)
    expect(result.checks.minLength).toBe(true)
    expect(result.checks.hasUpperCase).toBe(true)
    expect(result.checks.hasLowerCase).toBe(true)
    expect(result.checks.hasNumbers).toBe(true)
    expect(result.checks.hasSpecialChar).toBe(true)
  })

  it('deve classificar senha média corretamente', () => {
    const result = validatePasswordStrength('senha123')

    expect(result.strength).toBe('medium')
    expect(result.score).toBe(3)
  })

  it('deve classificar senha fraca corretamente', () => {
    const result = validatePasswordStrength('123')

    expect(result.strength).toBe('weak')
    expect(result.score).toBeLessThanOrEqual(2)
  })

  it('deve retornar score 0 para string vazia', () => {
    const result = validatePasswordStrength('')

    expect(result.score).toBe(0)
    expect(result.strength).toBe('weak')
  })

  it('deve detectar caracteres especiais', () => {
    const result = validatePasswordStrength('senha@123')
    expect(result.checks.hasSpecialChar).toBe(true)
  })

  it('deve detectar números', () => {
    const result = validatePasswordStrength('senha123')
    expect(result.checks.hasNumbers).toBe(true)
  })

  it('deve detectar maiúsculas', () => {
    const result = validatePasswordStrength('SenhaTest')
    expect(result.checks.hasUpperCase).toBe(true)
  })

  it('deve verificar tamanho mínimo', () => {
    const result1 = validatePasswordStrength('12345')
    const result2 = validatePasswordStrength('123456')

    expect(result1.checks.minLength).toBe(false)
    expect(result2.checks.minLength).toBe(true)
  })
})


describe('normalizeApiError', () => {
  it('deve normalizar erro da API com response completo', () => {
    const apiError = {
      response: {
        data: {
          message: 'Email já existe',
          code: 'EMAIL_ALREADY_EXISTS',
          field: 'email'
        },
        status: 409
      }
    }

    const result = normalizeApiError(apiError)

    expect(result.message).toBe('Email já existe')
    expect(result.code).toBe('EMAIL_ALREADY_EXISTS')
    expect(result.statusCode).toBe(409)
    expect(result.field).toBe('email')
  })

  it('deve usar valores padrão quando response.data está vazio', () => {
    const apiError = {
      response: {
        data: {},
        status: 400
      }
    }

    const result = normalizeApiError(apiError)

    expect(result.message).toBe('Erro desconhecido')
    expect(result.code).toBe('UNKNOWN_ERROR')
    expect(result.statusCode).toBe(400)
  })

  it('deve tratar erro de rede', () => {
    const networkError = {
      code: 'NETWORK_ERROR'
    }

    const result = normalizeApiError(networkError)

    expect(result.message).toBe('Erro de conexão')
    expect(result.code).toBe(AUTH_ERRORS.NETWORK_ERROR)
    expect(result.statusCode).toBe(0)
  })

  it('deve tratar erro sem response como erro de rede', () => {
    const errorWithoutResponse = {
      message: 'Algum erro'
    }

    const result = normalizeApiError(errorWithoutResponse)

    expect(result.message).toBe('Erro de conexão')
    expect(result.code).toBe(AUTH_ERRORS.NETWORK_ERROR)
    expect(result.statusCode).toBe(0)
  })

  it('deve tratar objeto vazio como erro de rede', () => {
    const result = normalizeApiError({})

    expect(result.message).toBe('Erro de conexão')
    expect(result.code).toBe(AUTH_ERRORS.NETWORK_ERROR)
    expect(result.statusCode).toBe(0)
  })

  it('deve tratar null como erro de rede', () => {
    const result = normalizeApiError(null)

    expect(result.message).toBe('Erro de conexão')
    expect(result.code).toBe(AUTH_ERRORS.NETWORK_ERROR)
    expect(result.statusCode).toBe(0)
  })
})

describe('isValidEmail', () => {
  it('deve validar emails corretos', () => {
    expect(isValidEmail('user@example.com')).toBe(true)
    expect(isValidEmail('test.email@domain.co.uk')).toBe(true)
    expect(isValidEmail('user+tag@example.org')).toBe(true)
    expect(isValidEmail('numbers123@domain.net')).toBe(true)
  })

  it('deve invalidar emails incorretos', () => {
    expect(isValidEmail('')).toBe(false)
    expect(isValidEmail('sem-arroba.com')).toBe(false)
    expect(isValidEmail('@domain.com')).toBe(false)
    expect(isValidEmail('user@')).toBe(false)
    expect(isValidEmail('user@.com')).toBe(false)
    expect(isValidEmail('user@domain')).toBe(false)
    expect(isValidEmail('user@@domain.com')).toBe(false)
    expect(isValidEmail('user @domain.com')).toBe(false)
  })

  it('deve validar email com caracteres especiais', () => {
    expect(isValidEmail('user_test@example.com')).toBe(true)
    expect(isValidEmail('user-test@example.com')).toBe(true)
  })
})

describe('sanitizeName', () => {
  it('deve remover espaços extras', () => {
    expect(sanitizeName('João    Silva')).toBe('João Silva')
    expect(sanitizeName('Maria   da    Silva')).toBe('Maria da Silva')
  })

  it('deve remover espaços no início e fim', () => {
    expect(sanitizeName('  João Silva  ')).toBe('João Silva')
    expect(sanitizeName('\t João Silva \n')).toBe('João Silva')
  })

  it('deve converter múltiplos espaços em um só', () => {
    expect(sanitizeName('João\t\tSilva')).toBe('João Silva')
    expect(sanitizeName('João\n\nSilva')).toBe('João Silva')
  })

  it('deve retornar string vazia para input só com espaços', () => {
    expect(sanitizeName('   ')).toBe('')
    expect(sanitizeName('\t\n')).toBe('')
  })

  it('deve manter nomes já limpos', () => {
    expect(sanitizeName('João Silva')).toBe('João Silva')
    expect(sanitizeName('Maria')).toBe('Maria')
  })

  it('deve lidar com string vazia', () => {
    expect(sanitizeName('')).toBe('')
  })

  it('deve preservar caracteres especiais', () => {
    expect(sanitizeName('José   de   Oliveira-Santos')).toBe('José de Oliveira-Santos')
    expect(sanitizeName("Mary  O'Connor")).toBe("Mary O'Connor")
  })

  it('deve preservar acentos', () => {
    expect(sanitizeName('José   María')).toBe('José María')
    expect(sanitizeName('François   Müller')).toBe('François Müller')
  })
})
