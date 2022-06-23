<template>
  <div class="container" style="padding-bottom: 50px; padding-top: 150px;">
    <div class="row justify-content-end">
      <div class="col-lg-12 d-flex justify-content-between">
        <h1 class="mb-0" style="color: lightgray">Trending Historic</h1>
        <button class="btn btn-lg btn-outline-primary" @click="updateList">Update Trending List</button>
      </div>
    </div>
  </div>
  <div class="container">
    <div class="row">

      <div class="col-12" v-for="(item, index) in historic" :key="index">
        <div class="box">
          <div class="d-flex align-items-center">
            <div class="text-white me-3">{{ index + 1 }}</div>
            <h4 class="m-0">{{ getDateString(item.creationDate) }}</h4>
          </div>
          <div class="movie">
            <p class="text-white">
              <span class="me-3">The Unbearable Weight of Massive Talent</span>
              <span class="me-3"><b>Score: </b>7.2</span>
              <span><b>Votes: </b>298</span>
            </p>
          </div>
          <div class="actions">
            <button class="btn btn-sm btn-outline-primary" @click="removeTrendingItem(item.id)">Remove</button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: "TrendingHistoric",
  data () {
    return {
      historic: null
    }
  },
  mounted() {
    this.getHistoric()
  },
  methods: {
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
      this.historic = data.results
    },
    getDateString (date) {
      let myDate = new Date(date)
      return myDate.toDateString()
    },
    updateList () {
      let url = process.env.VUE_APP_API_BASE_URL + 'infographics/create'
      let response = fetch(url,{method: "POST"}).then((result) => {
        if (result.status !== 200) { throw new Error("Bad Server Response"); }
        return result.text();
      }).then((response) => {
        this.getHistoric()
      }).catch((error) => { console.log(error); });
    },
    removeTrendingItem (trendingId) {
      let url = process.env.VUE_APP_API_BASE_URL + 'infographics/' + trendingId
      let response = fetch(url,{method: "DELETE"}).then((result) => {
        if (result.status !== 200) { throw new Error("Bad Server Response"); }
        return result.text();
      }).then((response) => {
        this.getHistoric()
      }).catch((error) => { console.log(error); });
    }
  }
}
</script>

<style scoped>
  .box {
    display: flex;
    background: #171f38;
    border: 1px solid transparent;
    border-radius: 15px;
    padding: 1.5rem;
    margin: 1rem 0;
    -webkit-transition: .3s ease-in-out;
    transition: .3s ease-in-out;
    justify-content: space-between;
  }
  .box h4 {
    color: #FFFFFF;
    font-size: 1.3rem;
  }
  p {
    margin: 0;
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
</style>
