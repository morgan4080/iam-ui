<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import NavBar from './components/NavBar.vue'
import Footer from './components/Footer.vue'
import SideBar from './components/SideBar.vue'

</script>

<template>
  <NavBar v-if="$route.name !== 'Landing'" />
  <div class="flex" >
    <SideBar v-if="$route.name !== 'Landing'" />
    <router-view></router-view>
  </div>
  <Footer />
</template>

<style scoped>

</style>
