<template>
  <AppHeader />
  <div class="container-fluid">
    <router-view/>
  </div>
</template>

<script>
import AppHeader from '@/components/AppHeader'
export default {
  components: { AppHeader }
}
</script>
