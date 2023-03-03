<script setup lang="ts">
import { toRefs } from "vue";
interface permissionInterface {
  id: number;
  checked: boolean;
  name: string;
  description: string;
  keycloakRoleId: string;
  roleType: string;
  clientName: string;
  clientId: string;
}

const props = defineProps<{
  permission: permissionInterface;
  existing: string[];
}>();

const { permission, existing } = toRefs(props);

const emit = defineEmits(["change"]);

const doReturn = (i: string): boolean => {
  return i === permission.value.keycloakRoleId;
};
</script>
<template>
  <li class="flex items-center justify-between">
    <label :for="`permission${permission.id}`">{{ permission.name }}</label>
    <input
      @change="$emit('change', $event, permission)"
      :checked="existing ? existing.findIndex(doReturn) !== -1 : false"
      v-model="permission.checked"
      :id="`permission${permission.id}`"
      aria-describedby="service-permissions"
      type="checkbox"
    />
  </li>
</template>
