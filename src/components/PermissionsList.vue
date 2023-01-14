<script setup lang="ts">
  import {toRefs} from "vue"
  interface permissionInterface { id: number, checked: boolean, name: string, description: string, keycloakRoleId: string, roleType: string, clientName: string, clientId: string }

  const props = defineProps<{
    permission: permissionInterface,
    existing: string[],
  }>()

  const { permission, existing } = toRefs(props);

  const emit = defineEmits(['change'])

  const doReturn = (i: string): boolean => {
    return i === permission.value.keycloakRoleId
  }

</script>
<template>
  <div class="relative flex items-start py-2 pl-4">
    <div class="flex">
      <input @change="$emit('change', $event, permission)" :checked="existing ? existing.findIndex(doReturn) !== -1 : false" v-model="permission.checked" :id="`permission${permission.id}`" aria-describedby="service-permissions" type="checkbox" class="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded">
    </div>
    <div class="ml-3 text-sm">
      <label :for="`permission${permission.id}`" class="font-medium text-gray-700">{{ permission.name }}</label>
      <p :id="`description${permission.id}`" class="text-gray-500 text-xs">
        <span class="sr-only">{{ permission.name }} </span>
        {{ permission.description }}
      </p>
    </div>
  </div>
</template>
