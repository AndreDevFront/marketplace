<template>
  <div>
    <AppSuspense>
      <router-view />
    </AppSuspense>

    <Toaster position="top-right" :duration="4000" :close-button="true" rich-colors />
  </div>
</template>

<script setup lang="ts">
import { Toaster } from 'vue-sonner'
import AppSuspense from '@/components/AppSuspense.vue'
import { useApiKeepAlive } from '@/composables/useApiKeepAlive'

const { startKeepAlive } = useApiKeepAlive()

startKeepAlive()
</script>
