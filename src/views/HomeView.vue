<template>
  <div class="px-4 text-center" style="padding-top: 150px;">
    <h1 class="display-5 fw-bold" style="color: lightgray;">Trending Movies Top 20</h1>
  </div>
  <div class="container main-container px-0">
    <div class="accordion-container">
      <div v-for="(movie, index) in topTenMovies" :key="index" class="accordion position-relative"
           :class="{ active: index === 0}" @click="toggleActiveMovie" :style="{ backgroundImage: `url(${getBackdropPath(movie.backdrop_path)})` }">
        <div class="movie-info">
          <h5 class="ranking">{{ index + 1 }}</h5>
          <div class="movie-data">
            <router-link :to="{name: 'movie', params: {id: movie.id}}"><h2 class="movie-name">{{ getMovieName(movie) }}</h2></router-link>
            <h4 class="movie-vote-count"><b>{{ movie.vote_count }} votes</b></h4>
            <h2 class="movie-avg">{{ movie.vote_average }} <br>Score</h2>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="container">
    <div class="row">
      <div class="col-4 offset-4">
        <select name="" id="" class="form-select bg-transparent text-white" v-model="currentHistoric" @change="currentHistoricChange">
          <option v-for="(item, index) in historic" :key="index" :value="item.id">
            {{ getDateString(item.creationDate) }}
          </option>
        </select>
      </div>
    </div>
  </div>
  <div class="container">
    <table class="table table-hover">
      <thead>
      <tr>
        <th scope="col">#</th>
        <th scope="col">Movie</th>
        <th scope="col">Votes</th>
        <th scope="col">Score</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(movie, index) in otherMovies" :key="index">
        <td scope="row">{{ index + 11 }}</td>
        <td><router-link :to="{name: 'movie', params: {id: movie.id}}"><h2>{{ getMovieName(movie) }}</h2></router-link></td>
        <td>{{ movie.vote_count }}</td>
        <td class="d-flex align-items-baseline">
          <div class="progress">
            <div :class="getMovieScoreColor(movie.vote_average)" role="progressbar" :style="getMovieScore(movie.vote_average)" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
          </div>
          {{ movie.vote_average }}
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
export default {
  name: 'HomeView',
  data () {
    return {
      movies: null,
      topTenMovies: null,
      otherMovies: null,
      historic: null,
      currentHistoric: null
    }
  },
  mounted () {
    this.getHistoric()
  },
  methods: {
    getMovies: async function () {
      let fetchApiFail = false;
      let response;

      if (this.currentHistoric) {
        let apiInfographicsUrl = process.env.VUE_APP_API_BASE_URL + 'infographics/' + this.currentHistoric + '/movies?page=1&size=20'
        response = await fetch(apiInfographicsUrl).catch(error => {
          console.log('There was an error!', error);
          fetchApiFail = true;
        })
      }

      if(fetchApiFail || response.status === 404)
        response = await fetch('trending_' + this.historic[this.currentHistoric - 1].creationDate + '.json')

      const data = await response.json()
      this.movies = JSON.parse(JSON.stringify(data))
      this.getTopTen()
      this.getOtherTenMovies()
    },
    getTopTen () {
      this.topTenMovies = this.movies.slice(0, 10)
    },
    getOtherTenMovies () {
      this.otherMovies = this.movies.slice(10, 20)
    },
    getBackdropPath (path) {
      return process.env.VUE_APP_TMDB_BACKDROP_PATH + path
    },
    getMovieName (movie) {
      movie = JSON.parse(JSON.stringify(movie))
      if (movie.name) { return movie.name }
      if (movie.original_name) { return movie.original_name } else { return movie.original_title }
    },
    getHistoric: async function () {
      let fetchApiFail = false;
      let apiInfographicsUrl = process.env.VUE_APP_API_BASE_URL + 'infographics'
      let response = await fetch(apiInfographicsUrl).catch(error => {
        console.log('There was an error!', error);
        fetchApiFail = true;
      })

      if(fetchApiFail || response.status === 404)
        response = await fetch('/historic.json')

      const data = await response.json()
      this.historic = data.reverse()
      this.currentHistoric = this.historic[0].id
      await this.getMovies()
    },
    currentHistoricChange () {
      this.getMovies()
    },
    toggleActiveMovie (event) {
      document.querySelectorAll('.accordion-container .accordion').forEach(accordion => {
        accordion.classList.remove('active')
      })
      event.target.classList.toggle('active')
    },
    getMovieScore (score) {
      return {
        'width': parseInt(score * 10) + '%'
      }
    },
    getMovieScoreColor (score) {
      let movieScore = parseInt(score * 10)
      if(movieScore <= 50)
        return 'progress-bar bg-danger'
      if(movieScore <= 70)
        return 'progress-bar bg-warning'
      return 'progress-bar bg-success'
    },
    getDateString (date) {
      let myDate = new Date(date)
      return myDate.toDateString()
    }
  }
}
</script>

<style>
.main-container {
  width: 1400px;
  max-width: initial;
  overflow: hidden;
  border-radius: 20px;
  margin-bottom: 50px;
  border: 3px solid #eb4a4a;
}
.accordion-container {
  display: flex;
  height: 55vh;
  max-height: 570px;
}
.accordion-container .accordion {
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  flex: 1;
  margin: 0;
  padding: 0;
  transition: all 600ms cubic-bezier(0.075, 0.82, 0.165, 1);
  cursor: pointer;
  border-right: 0.5px solid #eb4a4a;
}

.accordion-container .accordion:hover {
  flex-basis: 15%;
}
.accordion-container .accordion:hover .movie-info {
  width: 100%;
  height: 200px;
  background: rgba(0,0,0,.5);
  bottom: 0;
}
.accordion-container .accordion:not(.active):hover .movie-info .ranking {
  font-size: 70px;
  text-align: center;
  position: absolute;
  bottom: 50px;
}
.accordion-container .accordion.active {
  flex-basis: 70%;
  cursor: auto;
}
.container table {
  margin-top: 50px;
}
.accordion-container .accordion .movie-info {
  position: absolute;
  bottom: 60px;
  left: 0;
  width: 100%;
  background: rgba(0,0,0,.5);
  height: 43px;
}
.accordion-container .accordion .movie-info .ranking {
  color: #FFF;
  font-size: 1.5rem;
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 0;
  margin-top: 7px;
}
.accordion-container .accordion .movie-info .movie-data {
  display: none;
}
.accordion-container .accordion.active .movie-info {
  width: 100%;
  height: 200px;
  bottom: 0;
  left: 0;
  top: initial;
  background-color: rgba(0,0,0,.5);
}
.accordion-container .accordion.active .movie-info .ranking {
  font-size: 70px;
  text-align: center;
  margin: 0;
  width: 100px;
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
}
.accordion-container .accordion.active .movie-info .movie-data {
  display: flex;
  flex-direction: column;
  color: lightgray;
  position: absolute;
  left: 120px;
  top: 50%;
  transform: translateY(-50%);
  width: calc(100% - 120px);
}
.accordion-container .accordion.active .movie-info .movie-data a {
  color: lightgray;
  text-decoration: none;
}
.accordion-container .accordion.active .movie-info .movie-data a:hover {
  text-decoration: underline;
  text-decoration-color: #eb4a4a;
}
.accordion-container .accordion.active .movie-info .movie-data .movie-name {
  margin: 0;
}
.accordion-container .accordion.active .movie-info .movie-data .movie-avg {
  position: absolute;
  right: 50px;
  top: 50%;
  transform: translateY(-50%);
  text-align: center;
}
.table {
  margin-bottom: 100px;
}
.table thead tr th {
  color: #eb4a4a;
}
.table tbody tr td {
  color: lightgray;
}
.table tbody tr td a {
  color: lightgray;
  text-decoration: none;
}
.table tbody tr td a h2 {
  font-size: 1rem;
}
.table-hover>tbody>tr:hover>*, .table-hover>tbody>tr:hover a {
  color: #eb4a4a;
}

.form-select {
  border-color: #eb4a4a;
  color: rgba(255,255,255,.55) !important;
}
.form-select:focus {
  border-color: #eb4a4a;
  box-shadow: none;
}
.progress {
  height: .7rem;
  width: 90%;
  margin-left: auto;
  margin-right: 15px;
  margin-bottom: 10px;
}
</style>
