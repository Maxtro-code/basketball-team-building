<script setup lang="ts">
import { ref } from 'vue'
import { useTeamStore } from '../stores/teams'

const store = useTeamStore()
const newTeamName = ref('')
const editingTeamId = ref<string | null>(null)
const editingTeamName = ref('')

const createTeam = () => {
  if (newTeamName.value.trim()) {
    store.createTeam(newTeamName.value)
    newTeamName.value = ''
  }
}

const startEditing = (team: { id: string, name: string }) => {
  editingTeamId.value = team.id
  editingTeamName.value = team.name
}

const saveTeamName = () => {
  if (editingTeamId.value && editingTeamName.value.trim()) {
    store.updateTeamName(editingTeamId.value, editingTeamName.value)
    editingTeamId.value = null
  }
}

const deleteTeam = (teamId: string) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette équipe ? Les joueurs seront retirés de l\'équipe et les matchs associés seront supprimés.')) {
    store.deleteTeam(teamId)
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
        <div class="flex justify-between items-center mb-4">
          <div v-if="editingTeamId === team.id" class="flex-1 mr-2">
            <input 
              v-model="editingTeamName"
              type="text"
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              @keyup.enter="saveTeamName"
              @blur="saveTeamName"
            >
          </div>
          <h3 v-else class="text-xl font-semibold cursor-pointer" @click="startEditing(team)">
            {{ team.name }}
          </h3>
          <button 
            @click="deleteTeam(team.id)"
            class="text-red-600 hover:text-red-800"
          >
            Supprimer
          </button>
        </div>
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