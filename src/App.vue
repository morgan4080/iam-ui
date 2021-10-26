<script setup lang="ts">
import TheNavBar from './components/TheNavBar.vue'
import TheFooter from './components/TheFooter.vue'
import TheSideBar from './components/TheSideBar.vue'

</script>

<template>
  <TheNavBar v-if="$route.name !== 'Landing'" />
  <div class="flex" >
    <TheSideBar v-if="$route.name !== 'Landing' && $route.name !== 'NewUsers'" />
    <router-view></router-view>
  </div>
  <TheFooter />
</template>
