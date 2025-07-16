import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().min(1, 'Email obrigatório').email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres')
})

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, 'Nome muito curto')
    .max(50, 'Nome muito longo')
    .transform(val => val.trim()),
  email: z
    .string()
    .min(1, 'Email obrigatório')
    .email('Email inválido')
    .transform(val => val.toLowerCase().trim()),
  password: z
    .string()
    .min(6, 'Mínimo 6 caracteres')
    .regex(/[A-Z]/, 'Precisa de 1 maiúscula')
    .regex(/[0-9]/, 'Precisa de 1 número'),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: 'Senhas não coincidem',
  path: ['confirmPassword']
})

export type LoginForm = z.infer<typeof loginSchema>
export type RegisterForm = z.infer<typeof registerSchema>
