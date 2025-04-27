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
  status: 'en_cours' | 'termine' | 'a_venir'
  winner?: string
}

const savedTeams = localStorage.getItem('basketball-teams')
const savedPlayers = localStorage.getItem('basketball-players')
const savedMatches = localStorage.getItem('basketball-matches')

export const useTeamStore = defineStore('teams', () => {
  const teams = ref<Team[]>(savedTeams ? JSON.parse(savedTeams) : [])
  const players = ref<Player[]>(savedPlayers ? JSON.parse(savedPlayers) : [])
  const matches = ref<Match[]>(savedMatches ? JSON.parse(savedMatches) : [])

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

  function updateTeamName(teamId: string, newName: string) {
    const team = teams.value.find(t => t.id === teamId)
    if (team) {
      team.name = newName
    }
  }

  function deleteTeam(teamId: string) {
    players.value.forEach(player => {
      if (player.teamId === teamId) {
        player.teamId = ''
      }
    })

    matches.value = matches.value.filter(match => 
      match.team1Id !== teamId && match.team2Id !== teamId
    )

    teams.value = teams.value.filter(team => team.id !== teamId)
  }

  function addPlayer(player: Player) {
    players.value.push(player)
  }

  function deletePlayer(playerId: number) {
    players.value = players.value.filter(player => player.id !== playerId)
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
    matches.value.push({
      ...match,
      status: 'a_venir'
    })
  }

  function updateMatchScore(matchId: number, team: 1 | 2, points: number) {
    const match = matches.value.find(m => m.id === matchId)
    if (match) {
      if (team === 1) {
        match.team1Score = Math.max(0, match.team1Score + points)
      } else {
        match.team2Score = Math.max(0, match.team2Score + points)
      }
    }
  }

  function updateMatchStatus(matchId: number, status: 'en_cours' | 'termine' | 'a_venir') {
    const match = matches.value.find(m => m.id === matchId)
    if (match) {
      match.status = status
      if (status === 'termine') {
        if (match.team1Score > match.team2Score) {
          match.winner = match.team1Id
        } else if (match.team2Score > match.team1Score) {
          match.winner = match.team2Id
        }
      }
    }
  }

  return {
    teams,
    players,
    matches,
    createTeam,
    updateTeamName,
    deleteTeam,
    addPlayer,
    deletePlayer,
    assignPlayerToTeam,
    getTeamPlayers,
    addMatch,
    updateMatchScore,
    updateMatchStatus
  }
})