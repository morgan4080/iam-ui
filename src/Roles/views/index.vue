<script setup lang="ts">
import FixedHeader from "@/components/common/FixedHeader.vue";
import { useRoles } from "@roles/composables/useRoles";
import { storeToRefs } from "pinia";
import RolesTable from "@/components/tables/RolesTable.vue";
import { useAuthStore } from "@/store/auth-store";
import AssignRoleOverlay from "@/components/overlays/AssignRoleOverlay.vue";
import { ref } from "vue";
const authStore = useAuthStore();
const { syncRoles, syncServices } = useRoles();
const { isLoading } = storeToRefs(useRoles());
const showOverlay = ref(false);

const roleSync = async () => {
  try {
    isLoading.value = true;
    await syncServices();
    const response: any = await syncRoles();
    authStore.addAlerts("success", response.message);
  } catch (e: any) {
    authStore.addAlerts("error", e.message);
  } finally {
    isLoading.value = false;
  }
};
</script>
<template>
  <FixedHeader
    title="Roles Management"
    sub-title="Configuration For"
    highlighted="Roles Management"
  >
    <template #buttons>
      <v-btn
        :loading="isLoading"
        variant="outlined"
        color="info"
        class="text-none text-caption mx-2"
        @click="roleSync"
      >
        Sync
      </v-btn>
      <v-btn
        :loading="isLoading"
        variant="flat"
        color="primary"
        class="text-none text-caption mx-2"
        @click="$router.push('/roles/create')"
      >
        Add Role
      </v-btn>
    </template>
  </FixedHeader>
  <v-container :fluid="true">
    <RolesTable @select-role="showOverlay = true" />
  </v-container>
  <Teleport to="body">
    <AssignRoleOverlay
      :is-loading="isLoading"
      :show-overlay="showOverlay"
      :selected-user="null"
      :selected-role="null"
      @hide-roles-overlay="showOverlay = false"
    />
  </Teleport>
</template>
