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
  requireSpace: {
    type: Boolean,
    default: true,
  },
});
</script>

<template>
  <v-col class="h-100">
    <v-col class="bg-white border-none rounded-sm h-100">
      <v-col v-if="requireSpace">
        <div class="flex flex-wrap items-center justify-between">
          <div
            v-if="title !== '' || subTitle !== ''"
            class="pb-3"
          >
            <h1
              v-if="title !== ''"
              class="text-h6 font-weight-regular"
            >
              {{ title }}
            </h1>
            <h2
              v-if="subTitle !== ''"
              class="text-grey-darken-1 font-weight-regular"
              :class="subTitleClasses ? subTitleClasses : ''"
            >
              {{ subTitle }}
              <slot name="information" />
            </h2>
          </div>
          <slot name="search"></slot>
        </div>
        <slot></slot>
      </v-col>
      <div v-else>
        <div class="flex flex-wrap items-center justify-between">
          <div class="pb-3">
            <h1 class="text-h6 font-weight-regular">{{ title }}</h1>
            <h2
              class="text-grey-darken-1 font-weight-regular"
              :class="subTitleClasses ? subTitleClasses : ''"
            >
              {{ subTitle }}
              <slot name="information" />
            </h2>
          </div>
          <slot name="search"></slot>
        </div>
        <slot></slot>
      </div>
    </v-col>
  </v-col>
</template>
