<script setup lang="ts">
import DefaultLayout from "@/layouts/default/Default.vue";
import BackToTop from "@/components/common/BackToTop.vue";
import Snackbar from "@/components/common/Snackbar.vue";
import { useRoute } from "vue-router";
import { computed } from "vue";
const route = useRoute();

const currentLayout = computed(() => {
  return DefaultLayout;
});

const isRouterLoaded = computed(() => {
  return route.name !== null;
});
</script>

<template>
  <v-app>
    <v-layout>
      <component
        :is="currentLayout"
        v-if="isRouterLoaded"
      >
        <router-view />
      </component>
    </v-layout>
    <BackToTop />
    <Snackbar />
  </v-app>
</template>
