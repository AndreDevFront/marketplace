<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
    <div class="container mx-auto p-8">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-white mb-4">🃏 Cards Marketplace</h1>
        <Badge variant="secondary" class="text-sm"> ShadCN Vue + Tailwind CSS </Badge>
      </div>

      <!-- Cards Grid -->
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        <!-- Card 1 - Button Tests -->
        <Card class="p-6">
          <h3 class="text-xl font-semibold mb-4">Buttons</h3>
          <div class="space-y-3">
            <Button class="w-full">Primary Button</Button>
            <Button variant="secondary" class="w-full">Secondary</Button>
            <Button variant="outline" class="w-full">Outline</Button>
            <Button variant="ghost" class="w-full">Ghost</Button>
          </div>
        </Card>

        <!-- Card 2 - Input Tests -->
        <Card class="p-6">
          <h3 class="text-xl font-semibold mb-4">Inputs</h3>
          <div class="space-y-3">
            <Input placeholder="Nome do usuário" />
            <Input type="email" placeholder="email@exemplo.com" />
            <Input type="password" placeholder="Senha" />
          </div>
        </Card>

        <!-- Card 3 - Status -->
        <Card class="p-6">
          <h3 class="text-xl font-semibold mb-4">Status</h3>
          <div class="space-y-3">
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 bg-green-500 rounded-full"></div>
              <span class="text-sm">Tailwind CSS ✅</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 bg-green-500 rounded-full"></div>
              <span class="text-sm">ShadCN Vue ✅</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 bg-green-500 rounded-full"></div>
              <span class="text-sm">TypeScript ✅</span>
            </div>
            <Button size="sm" class="mt-4 w-full"> Prosseguir para Hero Section → </Button>
          </div>
        </Card>
      </div>

      <!-- Footer -->
      <div class="text-center mt-12">
        <p class="text-gray-400 text-sm">Stack: Vue 3 + TypeScript + Vite + Tailwind + ShadCN</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
</script>
