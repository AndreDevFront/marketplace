<template>
  <Suspense>
    <!-- Conteúdo principal -->
    <template #default>
      <slot />
    </template>

    <template #fallback>
      <div
        class="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center"
      >
        <Card class="p-8 text-center">
          <div
            class="animate-spin w-12 h-12 border-3 border-primary border-t-transparent rounded-full mx-auto mb-4"
          ></div>
          <h3 class="text-lg font-medium mb-2">Carregando...</h3>
          <p class="text-muted-foreground">Preparando a melhor experiência para você</p>
        </Card>
      </div>
    </template>
  </Suspense>
</template>

<script setup lang="ts">
import { Card } from '@/components/ui/card'
</script>
