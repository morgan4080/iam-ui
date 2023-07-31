<script setup lang="ts">
defineProps({
  defaultText: {
    type: String,
    default: "",
  },
  groups: {
    type: Array,
    default: () => [],
  },
  variant: {
    type: String,
    default: "flat",
  },
  color: {
    type: String,
    default: "primary",
  },
  extraClasses: {
    type: String,
    default: "",
  },
});

defineEmits(["selected"]);
</script>

<template>
  <v-menu transition="slide-y-transition">
    <template #activator="{ props }">
      <v-btn
        class="v-btn--size-default text-caption text-capitalize"
        :class="extraClasses"
        append-icon="mdi:mdi-chevron-down"
        v-bind="props"
        :flat="true"
        style="border: 1px solid rgba(128, 128, 128, 0.25)"
        :variant="variant"
        :color="color"
      >
        {{ defaultText }}
      </v-btn>
    </template>
    <v-sheet
      border
      rounded
    >
      <v-list
        :nav="true"
        density="compact"
        role="listbox"
        size="small"
      >
        <v-list-item
          v-for="(group, it) in groups"
          :key="it"
          :value="it"
          density="compact"
          size="small"
          class="text-caption"
          @click="$emit('selected', group)"
        >
          {{ group.name }}
        </v-list-item>
      </v-list>
    </v-sheet>
  </v-menu>
</template>
