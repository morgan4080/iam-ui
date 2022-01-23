<script setup lang="ts">
import {defineProps, ref, toRefs, watch} from "vue";
  interface permissionInterface { id: number, checked: boolean, name: string, description: string, keycloakRoleId: string, roleType: string, clientName: string, clientId: string }
  // services[currentServiceIndex].
  const props = defineProps<{
    permission: permissionInterface
  }>()

  const { permission } = toRefs(props);

  const emit = defineEmits(['change'])

</script>
<template>
  <div class="relative flex items-start py-4">
    <div class="min-w-0 flex-1 text-sm">
      <label :for="`permission${permission.id}`" class="font-medium text-gray-700">{{ permission.name }}</label>
      <p class="text-gray-500">{{ permission.description }}</p>
    </div>
    <div class="ml-3 flex items-center h-5">
      <input @change="$emit('change', $event, permission)" v-model="permission.checked" :id="`permission${permission.id}`" aria-describedby="service-permissions" type="checkbox" class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded">
    </div>
  </div>
</template>
