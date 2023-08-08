<script setup lang="ts">
import { AlertTypes, useAuthStore } from "@/store/auth-store";
const authStore = useAuthStore();

const getIcon = (type: AlertTypes): string => {
  const icon: {
    info: string;
    success: string;
    error: string;
    warning: string;
  } = {
    info: "mdi-information",
    success: "mdi-check-circle",
    error: "mdi-alert-circle",
    warning: "mdi-alert",
  };

  return icon[type];
};
</script>
<template>
  <div>
    <v-snackbar
      v-for="(alert, i) in authStore.getAlerts"
      :key="i"
      v-model="alert.show"
      timeout="5000"
      :color="alert.alertType"
      location="bottom"
      variant="flat"
      size="x-small"
    >
      <div class="d-flex align-center">
        <v-icon class="mr-2">{{ getIcon(alert.alertType) }}</v-icon>
        <span> {{ alert.alertMessage }}</span>
      </div>

      <template #actions>
        <v-btn
          icon
          variant="text"
          @click="authStore.removeAlert(alert.id)"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>
