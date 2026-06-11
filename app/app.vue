<script setup lang="ts">
import { PwaPrompt } from '~/widgets/pwa-prompt'
</script>

<template>
  <div class="min-h-screen">
    <NuxtRouteAnnouncer />
    <NuxtPage />
    <PwaPrompt />
  </div>
</template>
