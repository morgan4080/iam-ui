<script setup lang="ts">
defineEmits(["selected"]);
defineProps<{
  selected: { name: string };
  groups: { name: string }[];
}>();
</script>

<template>
  <v-menu transition="slide-y-transition">
    <template #activator="{ props }">
      <v-btn
        class="v-btn--size-default text-caption text-capitalize"
        density="default"
        append-icon="mdi:mdi-chevron-down"
        v-bind="props"
        :flat="true"
        style="border: 1px solid rgba(128, 128, 128, 0.25)"
      >
        {{ selected.name }}
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
      >
        <v-list-item
          v-for="(group, it) in groups"
          :key="it"
          :value="it"
          density="compact"
          @click="$emit('selected', group)"
        >
          {{ group.name }}
        </v-list-item>
      </v-list>
    </v-sheet>
  </v-menu>
</template>

<style scoped></style>
