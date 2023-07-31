<script setup lang="ts">
import { useSnackbarStore } from "@/store/snackbarStore";
const snackbarStore = useSnackbarStore();

const getIcon = (type: any) => {
  const icon = {
    info: "mdi-information",
    success: "mdi-check-circle",
    error: "mdi-alert-circle",
    warning: "mdi-alert",
  };

  return (icon as any)[type];
};
</script>
<template>
  <div>
    <v-snackbar
      v-model="snackbarStore.isShow"
      timeout="3000"
      :color="snackbarStore.type"
      location="bottom"
      variant="outlined"
      size="x-small"
    >
      <div class="d-flex align-center">
        <v-icon class="mr-2">{{ getIcon(snackbarStore.type) }}</v-icon>
        <span> {{ snackbarStore.message }}</span>
      </div>

      <template #actions>
        <v-btn
          icon
          variant="text"
          @click="snackbarStore.isShow = false"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>
