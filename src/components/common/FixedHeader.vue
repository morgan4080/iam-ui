<script setup lang="ts">
import { toRef } from "vue";

const props = defineProps<{
  title: string;
  subTitle: string;
  highlighted?: string;
}>();

const title = toRef(props, "title");
const subTitle = toRef(props, "subTitle");
const highlighted = toRef(props, "highlighted");
</script>

<template>
  <div class="bg-white border-none sticky top-0 z-10 shadow-md">
    <v-container :fluid="true">
      <v-row class="d-flex pb-4 items-center space-y-2 md:space-y-0">
        <v-col class="space-y-2">
          <div class="flex items-center">
            <h4
              class="font-weight-medium leading-snug tracking-tight"
              style="text-transform: capitalize !important"
            >
              {{ title }}
            </h4>
            <slot name="refreshContent" />
          </div>
          <h2
            class="text-xs text-grey-darken-1 font-weight-regular text-no-wrap"
          >
            {{ subTitle }}
            <span class="text-gray-800 font-weight-medium text-caption">{{
              highlighted
            }}</span>
          </h2>
        </v-col>
        <v-row class="flex px-4 justify-self-start md:justify-end">
          <slot name="buttons" />
        </v-row>
      </v-row>
      <v-row class="d-flex">
        <slot name="tabs" />
      </v-row>
    </v-container>
  </div>
</template>

<style scoped></style>
