<template>
  <Card class="w-full max-w-md mx-auto">
    <div class="p-6">
      <div class="text-center mb-6">
        <h2 class="text-2xl font-bold">Criar Conta</h2>
        <p class="text-muted-foreground">Junte-se ao marketplace</p>
      </div>

      <form @submit="onSubmit" class="space-y-4">
        <div class="space-y-2">
          <label class="text-sm font-medium">Nome</label>
          <Input
            v-model="name"
            v-bind="nameAttrs"
            placeholder="Seu nome completo"
            :class="{ 'border-red-500': errors.name }"
          />
          <div v-if="errors.name" class="flex items-center gap-2">
            <TriangleAlert v-if="isRequiredError(errors.name)" class="text-red-500" :size="16" />
            <p v-else class="text-sm text-red-500">
              {{ errors.name }}
            </p>
          </div>
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium">Email</label>
          <Input
            v-model="email"
            v-bind="emailAttrs"
            type="email"
            placeholder="seu@email.com"
            :class="{ 'border-red-500': errors.email }"
          />
          <div v-if="errors.email" class="flex items-center gap-2">
            <TriangleAlert v-if="isRequiredError(errors.email)" class="text-red-500" :size="16" />
            <p v-else class="text-sm text-red-500">
              {{ errors.email }}
            </p>
          </div>
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium">Senha</label>
          <Input
            v-model="password"
            v-bind="passwordAttrs"
            type="password"
            placeholder="Crie uma senha"
            :class="{ 'border-red-500': errors.password }"
          />
          <div v-if="errors.password" class="flex items-center gap-2">
            <TriangleAlert
              v-if="isRequiredError(errors.password)"
              class="text-red-500"
              :size="16"
            />
            <p v-else class="text-sm text-red-500">
              {{ errors.password }}
            </p>
          </div>
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium">Confirmar Senha</label>
          <Input
            v-model="confirmPassword"
            v-bind="confirmPasswordAttrs"
            type="password"
            placeholder="Confirme sua senha"
            :class="{ 'border-red-500': errors.confirmPassword }"
          />
          <div v-if="errors.confirmPassword" class="flex items-center gap-2">
            <TriangleAlert
              v-if="isRequiredError(errors.confirmPassword)"
              class="text-red-500"
              :size="16"
            />
            <p v-else class="text-sm text-red-500">
              {{ errors.confirmPassword }}
            </p>
          </div>
        </div>

        <Button type="submit" :disabled="isLoading || !meta.valid" class="w-full">
          <span v-if="isLoading">Criando conta...</span>
          <span v-else>Criar conta</span>
        </Button>
      </form>

      <div class="text-center mt-4">
        <p class="text-sm text-muted-foreground">
          Já tem conta?
          <router-link to="/auth/login" class="text-primary hover:underline font-semibold">
            Entre aqui
          </router-link>
          <span>ou</span>
          <router-link to="/" class="text-primary hover:underline text-cyan-500 font-medium">
            Home
          </router-link>
        </p>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { TriangleAlert } from 'lucide-vue-next'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { useRouter } from 'vue-router'

import { registerSchema, type RegisterForm } from '@/schemas/auth.schemas'
import { useAuth } from '@/composables/useAuth'
import { useToast } from '@/composables/useToast'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'

const router = useRouter()
const { register, isLoading } = useAuth()
const toast = useToast()

const { handleSubmit, errors, meta, defineField } = useForm<RegisterForm>({
  validationSchema: toTypedSchema(registerSchema),
})

const [name, nameAttrs] = defineField('name')
const [email, emailAttrs] = defineField('email')
const [password, passwordAttrs] = defineField('password')
const [confirmPassword, confirmPasswordAttrs] = defineField('confirmPassword')

const isRequiredError = (error: string): boolean => {
  return error === 'Required' || error === 'Campo obrigatório'
}

const onSubmit = handleSubmit(async (values) => {
  try {
    await register(values)

    toast.success('Conta criada com sucesso!')
    toast.info('Faça login para continuar')

    router.push('/auth/login')
  } catch (error) {
    console.error('Erro ao criar conta:', error)
  }
})
</script>
