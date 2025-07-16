<template>
  <div
    class="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4"
  >
    <div class="absolute inset-0 bg-grid-pattern opacity-5"></div>

    <div class="relative z-10 w-full">
      <LoginForm />
    </div>
  </div>
</template>

<script setup lang="ts">
import LoginForm from '@/components/forms/LoginForm.vue'
</script>
