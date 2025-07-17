<template>
  <div
    class="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden"
  >
    <div class="absolute inset-0 bg-grid-pattern opacity-5"></div>
    <div
      class="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"
    ></div>
    <div
      class="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"
    ></div>

    <AppNavigation />

    <div class="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32">
      <div class="grid lg:grid-cols-2 gap-12 items-center">
        <div class="space-y-8">
          <Badge
            variant="secondary"
            class="bg-white/10 border-white/20 text-white backdrop-blur-sm"
          >
            ⭐ Marketplace #1 para Colecionadores
          </Badge>

          <div class="space-y-4">
            <h1 class="text-5xl lg:text-7xl font-bold text-white leading-tight">
              Troque suas
              <span
                class="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent block"
              >
                Cartas Favoritas
              </span>
            </h1>
            <p class="text-xl text-gray-300 leading-relaxed max-w-lg">
              O marketplace mais seguro para colecionadores. Encontre, troque e colecione cartas
              raras com outros entusiastas.
            </p>
          </div>

          <div class="flex flex-col sm:flex-row gap-4">
            <Button
              variant="outline"
              class="px-8 py-4 border-white/20 text-black hover:bg-white/20 backdrop-blur-sm"
            >
              <router-link to="/marketplace">Ver Marketplace</router-link>
            </Button>
          </div>

          <div class="flex gap-8 pt-8">
            <div class="text-center">
              <div class="text-3xl font-bold text-white">{{ stats.cards }}+</div>
              <div class="text-gray-400 text-sm">Cartas Registradas</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-white">{{ stats.users }}+</div>
              <div class="text-gray-400 text-sm">Usuários Ativos</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-white">{{ stats.trades }}+</div>
              <div class="text-gray-400 text-sm">Trocas Realizadas</div>
            </div>
          </div>
        </div>

        <div class="relative">
          <Card
            class="relative group cursor-pointer transform hover:scale-105 transition-all duration-500 bg-gradient-to-br from-gray-800 to-gray-900 border-white/10 p-8"
          >
            <div
              class="absolute inset-0 bg-gradient-to-r from-blue-500/50 to-purple-600/50 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-75"
            ></div>

            <div class="relative z-10">
              <div
                class="aspect-[3/4] bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl mb-6 flex items-center justify-center"
              >
                <div class="text-white text-center">
                  <div class="text-4xl mb-2">✨</div>
                  <div class="text-lg font-bold">Blue-Eyes</div>
                  <div class="text-sm opacity-75">White Dragon</div>
                </div>
              </div>

              <div class="space-y-3">
                <h3 class="text-xl font-bold text-white">Carta Lendária</h3>
                <p class="text-gray-400">Uma das cartas mais raras e poderosas do jogo.</p>
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <span class="text-sm text-gray-400">👥 12 interessados</span>
                  </div>
                  <div class="flex items-center gap-1">
                    <span class="text-yellow-400">⭐⭐⭐⭐⭐</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <div
            class="absolute -top-8 -left-8 w-24 h-32 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg opacity-75 transform rotate-12 hover:rotate-6 transition-transform duration-300"
          ></div>
          <div
            class="absolute -bottom-8 -right-8 w-24 h-32 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg opacity-75 transform -rotate-12 hover:-rotate-6 transition-transform duration-300"
          ></div>
          <div
            class="absolute top-1/2 -right-12 w-16 h-20 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg opacity-60 transform rotate-45 hover:rotate-12 transition-transform duration-300"
          ></div>
        </div>
      </div>
    </div>

    <div class="relative z-10 max-w-7xl mx-auto px-6 pb-20">
      <div class="grid md:grid-cols-3 gap-8">
        <Card
          class="bg-white/5 backdrop-blur-sm border-white/10 p-6 hover:bg-white/10 transition-all group"
        >
          <div class="text-4xl mb-4 group-hover:scale-110 transition-transform">🛡️</div>
          <h3 class="text-lg font-semibold text-white mb-2">Marketplace Seguro</h3>
          <p class="text-gray-400">Sistema de trocas verificado e seguro para todos os usuários.</p>
        </Card>

        <Card
          class="bg-white/5 backdrop-blur-sm border-white/10 p-6 hover:bg-white/10 transition-all group"
        >
          <div class="text-4xl mb-4 group-hover:scale-110 transition-transform">👥</div>
          <h3 class="text-lg font-semibold text-white mb-2">Comunidade Ativa</h3>
          <p class="text-gray-400">Conecte-se com colecionadores do mundo todo.</p>
        </Card>

        <Card
          class="bg-white/5 backdrop-blur-sm border-white/10 p-6 hover:bg-white/10 transition-all group"
        >
          <div class="text-4xl mb-4 group-hover:scale-110 transition-transform">✨</div>
          <h3 class="text-lg font-semibent text-white mb-2">Cartas Raras</h3>
          <p class="text-gray-400">Encontre cartas impossíveis de achar em outros lugares.</p>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import AppNavigation from '@/components/AppNavigation.vue'

const stats = ref({
  cards: '10K',
  users: '2.5K',
  trades: '500',
})
</script>

<style scoped>
.bg-grid-pattern {
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
  background-size: 50px 50px;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 0.7;
  }
  50% {
    opacity: 0.3;
  }
}
</style>
