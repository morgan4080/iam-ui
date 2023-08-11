<script setup lang="ts">
import { ref } from "vue";
import AddRemoveRoles from "@/components/forms/AddRemoveRoles.vue";

const emit = defineEmits(["inheritRole"]);

const loading = ref(false);

const newSelectedRoles = ref([]);

const setRolesToAssign = roles => {
  newSelectedRoles.value = roles;
};
</script>

<template>
  <v-divider
    color="secondary"
    class="-mx-6"
  />
  <form class="py-4">
    <div
      class="text-subtitle-1 text-sm-caption mt-2 font-weight-bold text-gray-400 py-2"
    >
      Role Names
    </div>
    <AddRemoveRoles
      :user="null"
      :active="true"
      @assign-roles="setRolesToAssign"
    />

    <v-btn
      :loading="loading"
      :disabled="loading"
      variant="flat"
      color="primary"
      class="rounded-0 w-full text-none mt-10"
      type="button"
      @click="emit('inheritRole', newSelectedRoles)"
    >
      Inherit Role
    </v-btn>
  </form>
</template>
