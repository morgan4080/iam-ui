<script setup lang="ts">

defineProps({
  title: {
    type: String,
    required: true,
  },
  subTitle: {
    type: String,
    required: true,
  },
  subTitleClasses: {
    type: String,
    default: "text-caption",
  },
});
</script>

<template>
  <v-col class="h-100">
    <v-col class="bg-white border-none rounded-sm h-100">
      <v-col>
        <h1 class="text-h6 font-weight-regular">{{ title }}</h1>
        <h2
          class="text-grey-darken-1 font-weight-regular"
          :class="subTitleClasses ? subTitleClasses : ''"
        >
          {{ subTitle }}
        </h2>
        <slot></slot>
      </v-col>
    </v-col>
  </v-col>
</template>

<style scoped>

</style>