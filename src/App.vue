<script setup lang="ts">
import TheNavBar from './components/TheNavBar.vue'
import TheFooter from './components/TheFooter.vue'
import TheSideBar from './components/TheSideBar.vue'
import Notification from './components/Notification.vue'
import {useStore} from "vuex"
import {computed} from "vue"

const store = useStore()
const notification = computed(() => store.getters.getNotification)
</script>

<template>
  <TheNavBar v-if="$route.name !== 'Landing' && $route.name !== 'Password-Reset'"/>
  <div class="flex flex-1">
    <TheSideBar v-if="$route.name !== 'Landing' && $route.name !== 'Password-Reset'"/>
    <div class="flex flex-col w-full">
      <Notification v-if="notification.message" :success="notification.success" :warning="notification.warning"
                    :error="!notification.error">
        <p>{{ notification.message }}</p>
      </Notification>
      <router-view></router-view>
    </div>
  </div>
  <TheFooter/>
</template>
