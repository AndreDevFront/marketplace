<template>
  <Card class="w-full max-w-md mx-auto">
    <div class="p-6">
      <!-- Header -->
      <div class="text-center mb-6">
        <h2 class="text-2xl font-bold">Entrar</h2>
        <p class="text-muted-foreground">Acesse sua conta</p>
      </div>

      <!-- Form -->
      <form @submit="onSubmit" class="space-y-4">
        <!-- Email -->
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

        <!-- Password -->
        <div class="space-y-2">
          <label class="text-sm font-medium">Senha</label>
          <Input
            v-model="password"
            v-bind="passwordAttrs"
            type="password"
            placeholder="Sua senha"
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

        <!-- Submit -->
        <Button type="submit" :disabled="isLoading || !meta.valid" class="w-full">
          <span v-if="isLoading">Entrando...</span>
          <span v-else>Entrar</span>
        </Button>
      </form>

      <!-- Link para registro -->
      <div class="text-center mt-4">
        <p class="text-sm text-muted-foreground">
          Não tem conta?
          <router-link to="/auth/register" class="text-primary hover:underline">
            Registre-se
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

import { loginSchema, type LoginForm } from '@/schemas/auth.schemas'
import { useAuth } from '@/composables/useAuth'
import { useToast } from '@/composables/useToast'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'

const router = useRouter()
const { login, isLoading } = useAuth()
const toast = useToast()

const { handleSubmit, errors, meta, defineField } = useForm<LoginForm>({
  validationSchema: toTypedSchema(loginSchema),
})

const [email, emailAttrs] = defineField('email')
const [password, passwordAttrs] = defineField('password')

const isRequiredError = (error: string): boolean => {
  return error === 'Required' || error === 'Campo obrigatório'
}

const onSubmit = handleSubmit(async (values) => {
  try {
    await login(values)

    toast.success('Login realizado com sucesso!')
    const redirect = router.currentRoute.value.query.redirect as string

    const redirectPath =
      redirect && redirect.startsWith('/') && !redirect.startsWith('//') ? redirect : '/'

    router.push(redirectPath)
  } catch (error) {
    console.error('Erro ao fazer login:', error)
  }
})
</script>
