<template>
  <div id="app">
    <router-view />

    <!-- Teste temporário - REMOVER depois -->
    <div class="fixed bottom-4 right-4 z-50">
      <AuthTest />
    </div>
  </div>
</template>

<script setup lang="ts">
import AuthTest from '@/components/AuthTest.vue'
</script>
