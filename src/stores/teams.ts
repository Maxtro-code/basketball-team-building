import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

interface Player {
  id: number
  name: string
  position: string
  height: number
  skills: string[]
  teamId?: string
}

interface Team {
  id: string
  name: string
  players: Player[]
}

interface Match {
  id: number
  team1Id: string
  team2Id: string
  team1Score: number
  team2Score: number
  date: string
}

// Charger les données depuis le localStorage
const savedTeams = localStorage.getItem('basketball-teams')
const savedPlayers = localStorage.getItem('basketball-players')
const savedMatches = localStorage.getItem('basketball-matches')

export const useTeamStore = defineStore('teams', () => {
  const teams = ref<Team[]>(savedTeams ? JSON.parse(savedTeams) : [])
  const players = ref<Player[]>(savedPlayers ? JSON.parse(savedPlayers) : [])
  const matches = ref<Match[]>(savedMatches ? JSON.parse(savedMatches) : [])

  // Sauvegarder les données dans le localStorage quand elles changent
  watch(
    teams,
    (newTeams) => {
      localStorage.setItem('basketball-teams', JSON.stringify(newTeams))
    },
    { deep: true }
  )

  watch(
    players,
    (newPlayers) => {
      localStorage.setItem('basketball-players', JSON.stringify(newPlayers))
    },
    { deep: true }
  )

  watch(
    matches,
    (newMatches) => {
      localStorage.setItem('basketball-matches', JSON.stringify(newMatches))
    },
    { deep: true }
  )

  function createTeam(name: string) {
    teams.value.push({
      id: Date.now().toString(),
      name,
      players: []
    })
  }

  function addPlayer(player: Player) {
    players.value.push(player)
  }

  function assignPlayerToTeam(playerId: number, teamId: string) {
    const player = players.value.find(p => p.id === playerId)
    if (player) {
      player.teamId = teamId
    }
  }

  function getTeamPlayers(teamId: string) {
    return players.value.filter(player => player.teamId === teamId)
  }

  function addMatch(match: Match) {
    matches.value.push(match)
  }

  function updateMatchScore(matchId: number, team: 1 | 2, points: number) {
    const match = matches.value.find(m => m.id === matchId)
    if (match) {
      if (team === 1) {
        match.team1Score += points
      } else {
        match.team2Score += points
      }
    }
  }

  return {
    teams,
    players,
    matches,
    createTeam,
    addPlayer,
    assignPlayerToTeam,
    getTeamPlayers,
    addMatch,
    updateMatchScore
  }
})