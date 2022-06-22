<template>
  <header class="p-3 text-white">
    <div class="container pt-3">
      <div class="d-flex flex-wrap align-items-center justify-content-center">

        <ul class="nav col-12 col-lg-auto mb-2 justify-content-center mb-md-0">
          <li><router-link to="/" class="nav-link px-2 me-3">Home</router-link></li>
          <li><router-link to="/trending" class="nav-link px-2 me-3">Trending</router-link></li>
          <li><router-link to="/historic" class="nav-link px-2">Historic</router-link></li>
        </ul>

      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'AppHeader'
}
</script>

<style scoped>
  .router-link-active {
    border: 2px solid #eb4a4a;
    border-radius: 15px;
    color: #eb4a4a;
  }
  .nav-link {
    color: #FFF;
    font-size: 1.5rem;
  }
  .nav-link:hover {
    color: #eb4a4a !important;
  }
  header {
    z-index: 9999;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }
</style>
