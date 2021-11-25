<script setup lang="ts">
  import TheNavBar from './components/TheNavBar.vue'
  import TheFooter from './components/TheFooter.vue'
  import TheSideBar from './components/TheSideBar.vue'
  import { getAccessToken, getAuthentication } from '@/modules/all'
  import { useStore } from "vuex"

  const store = useStore()

  getAccessToken()
      .then(getAuthentication)
      .then((data: any) => store.commit('set_current_user', data))
      .catch((e: any) => console.log(e))

</script>

<template>
  <TheNavBar v-if="$route.name !== 'Landing' && $route.name !== 'Password-Reset'" />
  <div class="flex min-h-screen" >
    <TheSideBar v-if="$route.name !== 'Landing' && $route.name !== 'NewUsers' && $route.name !== 'Password-Reset'" />
    <router-view></router-view>
  </div>
  <TheFooter />
</template>
