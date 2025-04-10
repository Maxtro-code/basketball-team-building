<script setup lang="ts">
import { ref } from 'vue'
import { useTeamStore } from '../stores/teams'

const store = useTeamStore()
const newTeamName = ref('')

const createTeam = () => {
  if (newTeamName.value.trim()) {
    store.createTeam(newTeamName.value)
    newTeamName.value = ''
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-xl font-semibold mb-4">Créer une équipe</h2>
      <form @submit.prevent="createTeam" class="flex gap-4">
        <input 
          v-model="newTeamName"
          type="text"
          placeholder="Nom de l'équipe"
          class="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        >
        <button 
          type="submit"
          class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Créer
        </button>
      </form>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div v-for="team in store.teams" :key="team.id" class="bg-white rounded-lg shadow p-6">
        <h3 class="text-xl font-semibold mb-4">{{ team.name }}</h3>
        <div class="space-y-2">
          <div v-for="player in store.getTeamPlayers(team.id)" :key="player.id" class="p-2 bg-gray-50 rounded">
            {{ player.name }} - {{ player.position }}
          </div>
          <p v-if="store.getTeamPlayers(team.id).length === 0" class="text-gray-500 italic">
            Aucun joueur dans l'équipe
          </p>
        </div>
      </div>
    </div>
  </div>
</template>