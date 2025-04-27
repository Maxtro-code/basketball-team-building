<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTeamStore } from '../stores/teams'

const store = useTeamStore()

const newMatch = ref({
  team1Id: '',
  team2Id: '',
  date: new Date().toISOString().split('T')[0]
})

const createMatch = () => {
  store.addMatch({
    id: Date.now(),
    team1Id: newMatch.value.team1Id,
    team2Id: newMatch.value.team2Id,
    team1Score: 0,
    team2Score: 0,
    date: newMatch.value.date,
    status: 'a_venir'
  })
  
  newMatch.value = {
    team1Id: '',
    team2Id: '',
    date: new Date().toISOString().split('T')[0]
  }
}

const updateScore = (matchId: number, team: 1 | 2, points: number) => {
  store.updateMatchScore(matchId, team, points)
}

const getTeamName = (teamId: string) => {
  return store.teams.find(t => t.id === teamId)?.name || ''
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'en_cours': return 'En cours'
    case 'termine': return 'Terminé'
    case 'a_venir': return 'À venir'
    default: return status
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'en_cours': return 'bg-yellow-100 text-yellow-800'
    case 'termine': return 'bg-green-100 text-green-800'
    case 'a_venir': return 'bg-gray-100 text-gray-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-xl font-semibold mb-4">Créer un match</h2>
      <form @submit.prevent="createMatch" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Équipe 1</label>
            <select 
              v-model="newMatch.team1Id"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="">Sélectionner une équipe</option>
              <option v-for="team in store.teams" :key="team.id" :value="team.id">
                {{ team.name }}
              </option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700">Équipe 2</label>
            <select 
              v-model="newMatch.team2Id"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="">Sélectionner une équipe</option>
              <option 
                v-for="team in store.teams" 
                :key="team.id" 
                :value="team.id"
                :disabled="team.id === newMatch.team1Id"
              >
                {{ team.name }}
              </option>
            </select>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Date</label>
          <input 
            v-model="newMatch.date"
            type="date"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          >
        </div>

        <button 
          type="submit"
          class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          :disabled="!newMatch.team1Id || !newMatch.team2Id"
        >
          Créer le match
        </button>
      </form>
    </div>

    <div class="space-y-4">
      <h2 class="text-xl font-semibold">Matchs</h2>
      <div v-for="match in store.matches" :key="match.id" class="bg-white rounded-lg shadow p-6">
        <div class="flex justify-between items-center mb-4">
          <span :class="['px-2 py-1 rounded-full text-sm font-medium', getStatusColor(match.status)]">
            {{ getStatusLabel(match.status) }}
          </span>
          <select 
            v-model="match.status"
            class="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            @change="store.updateMatchStatus(match.id, $event.target.value)"
          >
            <option value="a_venir">À venir</option>
            <option value="en_cours">En cours</option>
            <option value="termine">Terminé</option>
          </select>
        </div>

        <div class="grid grid-cols-3 gap-4 items-center">
          <div class="text-center">
            <h3 class="font-semibold">{{ getTeamName(match.team1Id) }}</h3>
            <div class="text-3xl font-bold">{{ match.team1Score }}</div>
            <div class="space-x-2 mt-2">
              <button 
                @click="updateScore(match.id, 1, -1)"
                class="bg-red-500 text-white px-2 py-1 rounded"
                :disabled="match.status !== 'en_cours'"
              >
                -1
              </button>
              <button 
                @click="updateScore(match.id, 1, 1)"
                class="bg-green-500 text-white px-2 py-1 rounded"
                :disabled="match.status !== 'en_cours'"
              >
                +1
              </button>
              <button 
                @click="updateScore(match.id, 1, 2)"
                class="bg-green-500 text-white px-2 py-1 rounded"
                :disabled="match.status !== 'en_cours'"
              >
                +2
              </button>
              <button 
                @click="updateScore(match.id, 1, 3)"
                class="bg-green-500 text-white px-2 py-1 rounded"
                :disabled="match.status !== 'en_cours'"
              >
                +3
              </button>
            </div>
          </div>

          <div class="text-center text-xl font-bold">VS</div>

          <div class="text-center">
            <h3 class="font-semibold">{{ getTeamName(match.team2Id) }}</h3>
            <div class="text-3xl font-bold">{{ match.team2Score }}</div>
            <div class="space-x-2 mt-2">
              <button 
                @click="updateScore(match.id, 2, -1)"
                class="bg-red-500 text-white px-2 py-1 rounded"
                :disabled="match.status !== 'en_cours'"
              >
                -1
              </button>
              <button 
                @click="updateScore(match.id, 2, 1)"
                class="bg-green-500 text-white px-2 py-1 rounded"
                :disabled="match.status !== 'en_cours'"
              >
                +1
              </button>
              <button 
                @click="updateScore(match.id, 2, 2)"
                class="bg-green-500 text-white px-2 py-1 rounded"
                :disabled="match.status !== 'en_cours'"
              >
                +2
              </button>
              <button 
                @click="updateScore(match.id, 2, 3)"
                class="bg-green-500 text-white px-2 py-1 rounded"
                :disabled="match.status !== 'en_cours'"
              >
                +3
              </button>
            </div>
          </div>
        </div>

        <div class="text-center mt-4">
          <div class="text-gray-500">
            {{ new Date(match.date).toLocaleDateString() }}
          </div>
          <div v-if="match.status === 'termine'" class="mt-2 font-semibold">
            {{ match.winner ? `Gagnant : ${getTeamName(match.winner)}` : 'Match nul' }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>