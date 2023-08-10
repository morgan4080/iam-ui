<script setup lang="ts">
import FixedHeader from "@/components/common/FixedHeader.vue";
import { useRoles } from "@roles/composables/useRoles";
import { storeToRefs } from "pinia";
import RolesTable from "@/components/tables/RolesTable.vue";

const { syncRoles, syncServices } = useRoles();
const { isLoading } = storeToRefs(useRoles());

const roleSync = async () => {
  try {
    loading.value = true;
    await syncServices();
    const response: any = await syncRoles();
    authStore.addAlerts("success", response.message);
    await reFetch();
  } catch (e: any) {
    authStore.addAlerts("error", e.message);
  } finally {
    loading.value = false;
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
    <RolesTable />
  </v-container>
</template>
