<template>
  <div class="container" style="padding-bottom: 100px; padding-top: 150px;">
    <div class="row justify-content-end">
      <div class="col-lg-9">
        <div class="row gutter-2 align-items-end my-5">
          <div class="col-md-6">
            <h1 class="mb-0" style="color: lightgray">Trending Movies</h1>
            <span class="eyebrow" style="color: lightgray">{{ showMovies }} Movies</span>
          </div>
          <div class="col-md-6 text-md-right">
          </div>
        </div>
      </div>
    </div>

    <div class="row gutter-4">

      <!-- sidebar -->
      <aside class="col-lg-3 sidebar sticky-top">

        <div class="widget">
          <span class="widget-title" style="color: #eb4a4a; font-size: 1.2rem;">Genres</span>
          <div class="d-lg-block collapse mt-3" id="collapse-1">
            <div class="widget-content">
              <div class="custom-control custom-checkbox mb-1" v-for="(genre, index) in genres" :key="index">
                <input type="checkbox" class="custom-control-input" :id="'genre_'+index" v-model="activeGenres" :value="genre.id" @change="filterByGenres">
                <label class="custom-control-label" :for="'genre_'+index" style="color: lightgray; margin-left: 10px;">{{ genre.name }}</label>
              </div>
            </div>
          </div>
        </div>

      </aside>

      <!-- content -->
      <div class="col-lg-9">
        <div class="row gutter-2 gutter-lg-3">
          <div class="col-6 col-md-4" v-for="(movie, index) in movies" :key="index">
            <div class="product">
              <figure class="product-image">
                <router-link :to="{name: 'movie', params: {id: movie.id, type: movie.media_type}}">
                  <img :src="getPosterPath(movie.poster_path)" alt="Image" style="width: 100%;" loading="lazy">
                </router-link>
              </figure>
              <div class="product-meta">
                <router-link :to="{name: 'movie', params: {id: movie.id, type: movie.media_type}}">
                  <h3 class="product-title">{{ getMovieName(movie) }}</h3>
                </router-link>
                <p class="movie-avg"><b>Movie score: </b>{{parseInt(movie.vote_average * 10)}}%</p>
                <div class="progress">
                  <div :class="getMovieScoreColor(movie.vote_average)" role="progressbar" :style="getMovieScore(movie.vote_average)" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row pb-5 justify-content-center">
          <div class="col text-center">
            <nav class="d-inline-block">
              <button class="btn btn-lg btn-outline-primary" id="loadMore" @click="loadMore">Load More Movies</button>
            </nav>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: "TrendingMovies",
  data () {
    return {
      movies: [],
      filteredMovies: [],
      genres: null,
      activeGenres: [],
      moviesLength: 9,
      filteredMoviesLength: 9,
      showMovies: 0
    }
  },
  mounted() {
    this.getHistoric()
  },
  methods: {
    getMovies: async function () {
      for (let i = 1; i <= 5; i++)
      {
        let fetchApiFail = false;
        let response;

        if (this.currentHistoric) {
          let apiInfographicsUrl = process.env.VUE_APP_API_BASE_URL + 'infographics/' + this.currentHistoric + '/movies?page=' + i
          response = await fetch(apiInfographicsUrl).catch(error => {
            console.log('There was an error!', error);
            fetchApiFail = true;
          })
        }
        
        if(fetchApiFail || response.status === 404)
          response = await fetch(process.env.VUE_APP_TMDB_TRENDING_URL + process.env.VUE_APP_TMDB_API_KEY + '&page=' + i)

        let data = await response.json()
        this.movies.push(JSON.parse(JSON.stringify(data)).results)
        this.movies = this.movies.flat(1)
        this.movies = this.movies.sort((a, b) => a.vote_average < b.vote_average ? -1 : (a.vote_average > b.vote_average ? 1 : 0)).reverse()
      }
      localStorage.setItem('movies', JSON.stringify(this.movies))
      this.movies = JSON.parse(localStorage.getItem('movies'))?.slice(0, this.moviesLength)
      await this.getGenres()
      this.getShowMoviesCount()
    },
    getHistoric: async function () {
      const response = await fetch('/historic.json')
      const data = await response.json()
      this.historic = data
      this.currentHistoric = this.historic[0].id
      await this.getMovies()
    },
    getMovieName (movie) {
      movie = JSON.parse(JSON.stringify(movie))
      if (typeof movie.name !== 'undefined') { return movie.name }
      if (typeof movie.original_name !== 'undefined') { return movie.original_name } else { return movie.original_title }
    },
    getPosterPath (path) {
      return process.env.VUE_APP_TMDB_POSTER_ENDPOINT + path
    },
    getGenres: async function () {
      let genresUrl = process.env.VUE_APP_TMDB_GENRES_ENDPOINT + process.env.VUE_APP_TMDB_API_KEY
      const response = await fetch(genresUrl)
      const data = await response.json()
      this.genres = data.genres.filter(genre => {
        return [...new Set(JSON.parse(localStorage.getItem('movies')).map(movie => {
          return movie.genre_ids;
        }).flat())].includes(genre.id)
      })
    },
    filterByGenres () {
      if(this.activeGenres.length === 0)
      {
        this.movies = JSON.parse(localStorage.getItem('movies'))?.slice(0, this.moviesLength)
        localStorage.setItem('filteredMovies', '')
        this.filteredMovies = []
        document.getElementById('loadMore').style.visibility = 'visible'
      }
      else
      {
        this.filteredMoviesLength = 9
        this.filteredMovies = JSON.parse(localStorage.getItem('movies')).filter(movie => {
          return movie.genre_ids.some(r=> JSON.parse(JSON.stringify(this.activeGenres)).includes(r))
        })
        localStorage.setItem('filteredMovies', JSON.stringify(this.filteredMovies))
        if(this.filteredMoviesLength < JSON.parse(localStorage.getItem('filteredMovies')).length) document.getElementById('loadMore').style.visibility = 'visible'
        this.movies = this.filteredMovies.slice(0, this.filteredMoviesLength);
      }
      this.getShowMoviesCount()
    },
    loadMore() {
      if(this.activeGenres.length === 0)
      {
        if (this.moviesLength > JSON.parse(localStorage.getItem('movies')).length) return;
        this.moviesLength = this.moviesLength + 9;
        if(this.moviesLength > JSON.parse(localStorage.getItem('movies')).length) document.getElementById('loadMore').style.visibility = 'hidden'
        this.movies = JSON.parse(localStorage.getItem('movies'))?.slice(0, this.moviesLength)
      }
      else
      {
        if (this.filteredMoviesLength > JSON.parse(localStorage.getItem('filteredMovies')).length) return;
        this.filteredMoviesLength = this.filteredMoviesLength + 9;
        if(this.filteredMoviesLength > JSON.parse(localStorage.getItem('filteredMovies')).length) document.getElementById('loadMore').style.visibility = 'hidden'
        this.movies = JSON.parse(localStorage.getItem('filteredMovies'))?.slice(0, this.filteredMoviesLength)
      }
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
    getShowMoviesCount () {
      if(this.activeGenres.length === 0)
        this.showMovies = JSON.parse(localStorage.getItem('movies')).length
      this.showMovies = JSON.parse(localStorage.getItem('filteredMovies'))?.length
    }
  }
}
</script>

<style scoped>
  .product {
    box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
    transition: all 0.3s cubic-bezier(.25,.8,.25,1);
    margin-bottom: 2rem;
    border-radius: 20px;
    overflow: hidden;
    background: #171f38;
    border: 2px solid lightgray;
  }
  .product:hover {
    box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
  }
  .product-title {
    font-size: 1.1rem;
    padding-left: 10px;
    height: 44px;
    margin-bottom: 0;
    color: #FFF;
  }
  .progress {
    height: .7rem;
    width: 90%;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 10px;
  }
  .product figure {
    max-height: 370px;
    margin-bottom: 0;
  }
  .product figure img {
    height: 370px;
  }
  .product .product-meta {
    margin-top: 10px;
  }
  .product .movie-avg {
    margin-bottom: 5px;
    text-align: center;
    font-size: .9rem;
    color: lightgray;
  }
  button {
    color: #eb4a4a;
    border-color: #eb4a4a;
  }
  button:hover, .btn:focus {
    color: lightgray;
    background: #eb4a4a !important;
    border-color: #eb4a4a !important;
    box-shadow: none;
  }
  .product .product-meta a {
    text-decoration: none;
  }
</style>
