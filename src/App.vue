<template>
  <div id="app">
    <router-view />

    <!-- Toast notifications -->
    <UiToaster position="top-right" :duration="4000" close-button />
  </div>
</template>

<script setup lang="ts">
import UiToaster from './components/ui/toast/UiToaster.vue'
</script>
