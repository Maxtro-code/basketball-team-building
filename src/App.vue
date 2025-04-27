<script setup lang="ts">
import { RouterView, RouterLink } from 'vue-router'
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <header class="bg-blue-600 text-white p-4">
      <h1 class="text-2xl font-bold mb-4">Basketball Team Builder</h1>
      <nav class="space-x-4">
        <RouterLink 
          v-for="link in [
            { to: '/', text: 'Joueurs' },
            { to: '/teams', text: 'Équipes' },
            { to: '/matches', text: 'Matchs' }
          ]"
          :key="link.to"
          :to="link.to"
          class="text-white hover:text-blue-200"
          active-class="font-bold"
        >
          {{ link.text }}
        </RouterLink>
      </nav>
    </header>
    <main class="container mx-auto p-4">
      <RouterView />
    </main>
  </div>
</template>