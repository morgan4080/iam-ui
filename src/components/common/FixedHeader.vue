<script setup lang="ts">
import {toRef} from "vue";

const props = defineProps<{
  title: string;
  subTitle: string;
}>()

const title = toRef(props, "title")
const subTitle = toRef(props, "subTitle")
</script>

<template>
  <v-responsive>
    <div class="bg-white border-none position-sticky">
      <v-container fluid>
        <v-row class="d-flex pb-4">
          <v-col>
            <h1 class="text-h6 font-weight-regular">{{ title }}</h1>
            <h2 class="text-caption text-grey-darken-1 font-weight-regular">
              {{ subTitle }}
            </h2>
          </v-col>
          <v-col
              cols="auto"
              class="d-flex align-center"
          >
            <v-row class="d-flex px-4 justify-end">
              <slot name="buttons"></slot>
            </v-row>
          </v-col>
        </v-row>
        <v-row class="d-flex">
          <slot name="tabs"></slot>
        </v-row>
      </v-container>
    </div>
  </v-responsive>
</template>

<style scoped>

</style>