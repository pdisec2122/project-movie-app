<template>
  <div v-if="movie" class="container-fluid bg-movie" :style="{ backgroundImage: `url(${backgroundCover})` }">
  </div>
  <div class="container-fluid" v-if="movie" style="padding-top: 200px; max-width: 1600px;" >
    <div class="row">
      <div class="col-12 col-lg-4">
        <img :src="getPosterPath(movie.poster_path)" alt="" style="border-radius: 20px; width: 100%; max-width: 500px;">
      </div>
      <div class="col-12 col-lg-8" style="    display: flex;
    flex-direction: column;
    justify-content: center;">
        <h1 class="text-white mb-2" style="font-size: 70px;">{{ getMovieName(movie) }}</h1>
        <div class="d-flex flex-row">
          <span class="text-white" style="margin-right: 10px; font-size: 1.5rem;" v-for="(genre, index) in movie.genres" :key="index">{{ genre.name }}</span>
        </div>
        <br>
        <h2 class="text-white" style="font-size: 45px;">Overview</h2>
        <p class="text-white" style="font-size: 1.5rem; text-align: justify;">{{ movie.overview }}</p>
        <h2 class="text-white" style="font-size: 35px;">Score</h2>
        <p class="text-white" style="font-size: 1.5rem; text-align: justify;">{{ movie.vote_average }}</p>
        <h2 class="text-white" style="font-size: 35px;">Votes</h2>
        <p class="text-white" style="font-size: 1.5rem; text-align: justify;">{{ movie.vote_count }}</p>

      </div>
    </div>
  </div>

</template>

<script>
export default {
  name: "MovieDetail",
  data () {
    return {
      mediaType: null,
      mediaId: null,
      movie: null,
      backgroundCover: null
    }
  },
  mounted() {
    this.mediaId = this.$route.params.id
    this.mediaType = this.$route.params.type
    this.getMovieData()
  },
  methods: {
    getMovieData: async function () {
      let url = process.env.VUE_APP_TMDB_BASE_URL + this.mediaType + '/' + this.mediaId + '?api_key=' + process.env.VUE_APP_TMDB_API_KEY
      const response = await fetch(url)
      this.movie = await response.json()
      this.backgroundCover = this.getBackdropPath(this.movie.backdrop_path)
    },
    getBackdropPath (path) {
      return process.env.VUE_APP_TMDB_BACKDROP_ORIGINAL_PATH + path
    },
    getPosterPath (path) {
      return process.env.VUE_APP_TMDB_POSTER_ENDPOINT + path
    },
    getMovieName (movie) {
      movie = JSON.parse(JSON.stringify(movie))
      if (typeof movie.name !== 'undefined') { return movie.name }
      if (typeof movie.original_name !== 'undefined') { return movie.original_name } else { return movie.original_title }
    },
  }
}
</script>

<style scoped>
 .bg-movie {
    padding: 0;
    margin: 0;
    width: 100vw;
    height: 100vh;
    position: absolute;
    top: 0;
    left: 0;
    background-repeat: no-repeat;
    background-size: cover;
   z-index: -1;
  }
  .bg-movie:after {
    content: "";
    width: 100vw;
    height: 100vh;
    background: rgba(0,0,0,.5);
    position: absolute;
  }
</style>
