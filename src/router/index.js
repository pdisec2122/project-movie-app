import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import TrendingMovies from "@/views/TrendingMovies";
import TrendingHistoric from "@/views/TrendingHistoric";
import MovieDetail from "@/views/MovieDetail";

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/trending',
    name: 'trending',
    component: TrendingMovies
  },
  {
    path: '/historic',
    name: 'historic',
    component: TrendingHistoric
  },
  {
    path: '/movie/:id/:type',
    name: 'movie',
    component: MovieDetail
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
