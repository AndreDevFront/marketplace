import { describe, it, expect } from 'vitest'
import { loginSchema, registerSchema } from '@/schemas/auth.schemas'


describe('loginSchema', () => {
  describe('Casos válidos', () => {
    it('deve validar dados de login corretos', () => {
      const validData = {
        email: 'user@example.com',
        password: '123456'
      }

      const result = loginSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('deve validar email com formato complexo', () => {
      const validData = {
        email: 'user.test+tag@domain.co.uk',
        password: 'senhaSegura123'
      }

      const result = loginSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })
  })

  describe('Email inválido', () => {
    it('deve falhar com email vazio', () => {
      const invalidData = {
        email: '',
        password: '123456'
      }

      const result = loginSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Email obrigatório')
      }
    })

    it('deve falhar com email sem @', () => {
      const invalidData = {
        email: 'useremail.com',
        password: '123456'
      }

      const result = loginSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Email inválido')
      }
    })

    it('deve falhar com email malformado', () => {
      const invalidData = {
        email: 'user@',
        password: '123456'
      }

      const result = loginSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe('Senha inválida', () => {
    it('deve falhar com senha muito curta', () => {
      const invalidData = {
        email: 'user@example.com',
        password: '12345'
      }

      const result = loginSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Mínimo 6 caracteres')
      }
    })

    it('deve falhar com senha vazia', () => {
      const invalidData = {
        email: 'user@example.com',
        password: ''
      }

      const result = loginSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe('Campos ausentes', () => {
    it('deve falhar sem email', () => {
      const invalidData = {
        password: '123456'
      }

      const result = loginSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('deve falhar sem password', () => {
      const invalidData = {
        email: 'user@example.com'
      }

      const result = loginSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })
})

describe('registerSchema', () => {
  describe('Casos válidos', () => {
    it('deve validar dados de registro corretos', () => {
      const validData = {
        name: 'João Silva',
        email: 'joao@example.com',
        password: 'MinhaSenh@1',
        confirmPassword: 'MinhaSenh@1'
      }

      const result = registerSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('deve validar senha com maiúscula e número', () => {
      const validData = {
        name: 'Maria',
        email: 'maria@test.com',
        password: 'Senha123',
        confirmPassword: 'Senha123'
      }

      const result = registerSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })
  })

  describe('Transformações', () => {
    it('deve fazer trim no nome', () => {
      const dataWithSpaces = {
        name: '  João Silva  ',
        email: 'joao@example.com',
        password: 'Senha123',
        confirmPassword: 'Senha123'
      }

      const result = registerSchema.safeParse(dataWithSpaces)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.name).toBe('João Silva')
      }
    })

    it('deve fazer toLowerCase no email', () => {
      const dataWithUppercase = {
        name: 'João',
        email: 'JOAO@EXAMPLE.COM',
        password: 'Senha123',
        confirmPassword: 'Senha123'
      }

      const result = registerSchema.safeParse(dataWithUppercase)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.email).toBe('joao@example.com')
      }
    })
  })

  describe('Nome inválido', () => {
    it('deve falhar com nome muito curto', () => {
      const invalidData = {
        name: 'A',
        email: 'joao@example.com',
        password: 'Senha123',
        confirmPassword: 'Senha123'
      }

      const result = registerSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Nome muito curto')
      }
    })

    it('deve falhar com nome muito longo', () => {
      const longName = 'A'.repeat(51)
      const invalidData = {
        name: longName,
        email: 'joao@example.com',
        password: 'Senha123',
        confirmPassword: 'Senha123'
      }

      const result = registerSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Nome muito longo')
      }
    })
  })

  describe('Email inválido', () => {
    it('deve falhar com email vazio', () => {
      const invalidData = {
        name: 'João',
        email: '',
        password: 'Senha123',
        confirmPassword: 'Senha123'
      }

      const result = registerSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Email obrigatório')
      }
    })

    it('deve falhar com email inválido', () => {
      const invalidData = {
        name: 'João',
        email: 'email-invalido',
        password: 'Senha123',
        confirmPassword: 'Senha123'
      }

      const result = registerSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Email inválido')
      }
    })
  })

  describe('Senha inválida', () => {
    it('deve falhar com senha muito curta', () => {
      const invalidData = {
        name: 'João',
        email: 'joao@example.com',
        password: '12345',
        confirmPassword: '12345'
      }

      const result = registerSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Mínimo 6 caracteres')
      }
    })

    it('deve falhar com senha sem maiúscula', () => {
      const invalidData = {
        name: 'João',
        email: 'joao@example.com',
        password: 'senha123',
        confirmPassword: 'senha123'
      }

      const result = registerSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Precisa de 1 maiúscula')
      }
    })

    it('deve falhar com senha sem número', () => {
      const invalidData = {
        name: 'João',
        email: 'joao@example.com',
        password: 'SenhaForte',
        confirmPassword: 'SenhaForte'
      }

      const result = registerSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Precisa de 1 número')
      }
    })
  })

  describe('Confirmação de senha', () => {
    it('deve falhar quando senhas não coincidem', () => {
      const invalidData = {
        name: 'João',
        email: 'joao@example.com',
        password: 'Senha123',
        confirmPassword: 'Senha456'
      }

      const result = registerSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        const confirmPasswordError = result.error.issues.find(
          issue => issue.path.includes('confirmPassword')
        )
        expect(confirmPasswordError?.message).toBe('Senhas não coincidem')
      }
    })

    it('deve falhar com confirmPassword vazio', () => {
      const invalidData = {
        name: 'João',
        email: 'joao@example.com',
        password: 'Senha123',
        confirmPassword: ''
      }

      const result = registerSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe('Campos ausentes', () => {
    it('deve falhar sem name', () => {
      const invalidData = {
        email: 'joao@example.com',
        password: 'Senha123',
        confirmPassword: 'Senha123'
      }

      const result = registerSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('deve falhar sem email', () => {
      const invalidData = {
        name: 'João',
        password: 'Senha123',
        confirmPassword: 'Senha123'
      }

      const result = registerSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('deve falhar sem password', () => {
      const invalidData = {
        name: 'João',
        email: 'joao@example.com',
        confirmPassword: 'Senha123'
      }

      const result = registerSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('deve falhar sem confirmPassword', () => {
      const invalidData = {
        name: 'João',
        email: 'joao@example.com',
        password: 'Senha123'
      }

      const result = registerSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe('Casos edge', () => {
    it('deve validar nome no limite mínimo', () => {
      const validData = {
        name: 'Jo',
        email: 'jo@example.com',
        password: 'Senha123',
        confirmPassword: 'Senha123'
      }

      const result = registerSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('deve validar nome no limite máximo', () => {
      const maxName = 'A'.repeat(50)
      const validData = {
        name: maxName,
        email: 'test@example.com',
        password: 'Senha123',
        confirmPassword: 'Senha123'
      }

      const result = registerSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('deve validar senha no limite mínimo', () => {
      const validData = {
        name: 'João',
        email: 'joao@example.com',
        password: 'Senh@1',
        confirmPassword: 'Senh@1'
      }

      const result = registerSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })
  })
})
