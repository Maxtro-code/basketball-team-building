<script setup lang="ts">
import { ref } from 'vue'
import { useTeamStore } from '../stores/teams'

const store = useTeamStore()

const newPlayer = ref({
  name: '',
  position: '',
  height: 0,
  skills: [],
  teamId: ''
})

const positions = ['Meneur', 'Arrière', 'Ailier', 'Ailier fort', 'Pivot']

const addPlayer = () => {
  store.addPlayer({
    id: Date.now(),
    name: newPlayer.value.name,
    position: newPlayer.value.position,
    height: newPlayer.value.height,
    skills: newPlayer.value.skills,
    teamId: newPlayer.value.teamId
  })
  
  newPlayer.value = {
    name: '',
    position: '',
    height: 0,
    skills: [],
    teamId: ''
  }
}

const updatePlayerTeam = (playerId: number, teamId: string) => {
  store.assignPlayerToTeam(playerId, teamId)
}

const deletePlayer = (playerId: number) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce joueur ?')) {
    store.deletePlayer(playerId)
  }
}
</script>

<template>
  <div class="bg-white rounded-lg shadow p-6">
    <h2 class="text-xl font-semibold mb-4">Ajouter un joueur</h2>
    
    <form @submit.prevent="addPlayer" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">Nom</label>
        <input 
          v-model="newPlayer.name"
          type="text"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        >
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Position</label>
        <select 
          v-model="newPlayer.position"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        >
          <option value="">Sélectionner une position</option>
          <option v-for="position in positions" :key="position" :value="position">
            {{ position }}
          </option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Taille (cm)</label>
        <input 
          v-model.number="newPlayer.height"
          type="number"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        >
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Équipe</label>
        <select 
          v-model="newPlayer.teamId"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Sans équipe</option>
          <option v-for="team in store.teams" :key="team.id" :value="team.id">
            {{ team.name }}
          </option>
        </select>
      </div>

      <button 
        type="submit"
        class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
      >
        Ajouter le joueur
      </button>
    </form>

    <div class="mt-8">
      <h2 class="text-xl font-semibold mb-4">Liste des joueurs</h2>
      <div class="space-y-4">
        <div v-for="player in store.players" :key="player.id" class="border rounded-lg p-4">
          <div class="flex justify-between items-start">
            <div>
              <h3 class="font-semibold">{{ player.name }}</h3>
              <p>Position: {{ player.position }}</p>
              <p>Taille: {{ player.height }} cm</p>
            </div>
            <button 
              @click="deletePlayer(player.id)"
              class="text-red-600 hover:text-red-800"
            >
              Supprimer
            </button>
          </div>
          <div class="mt-2">
            <label class="block text-sm font-medium text-gray-700">Équipe:</label>
            <select 
              :value="player.teamId"
              @change="updatePlayerTeam(player.id, $event.target.value)"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Sans équipe</option>
              <option v-for="team in store.teams" :key="team.id" :value="team.id">
                {{ team.name }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>