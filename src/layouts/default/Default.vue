<template>
  <NavDrawer />
  <v-main class="position-relative">
    <slot></slot>
  </v-main>
</template>

<script lang="ts" setup>
import NavDrawer from "@/components/NavDrawer.vue";
</script>
