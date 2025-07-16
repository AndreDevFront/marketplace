<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
    <AppNavigation />

    <div class="max-w-7xl mx-auto px-6 py-12">
      <Card class="p-8 text-center">
        <h1 class="text-3xl font-bold mb-4">👤 Perfil</h1>
        <p class="text-muted-foreground mb-6">Gerencie suas informações pessoais</p>
        <Button>Em breve...</Button>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppNavigation from '@/components/AppNavigation.vue'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
</script>
