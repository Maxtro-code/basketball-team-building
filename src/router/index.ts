import { createRouter, createWebHistory } from 'vue-router'
import TeamBuilder from '../components/TeamBuilder.vue'
import Teams from '../components/Teams.vue'
import Matches from '../components/Matches.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'players',
      component: TeamBuilder
    },
    {
      path: '/teams',
      name: 'teams',
      component: Teams
    },
    {
      path: '/matches',
      name: 'matches',
      component: Matches
    }
  ]
})

export default router