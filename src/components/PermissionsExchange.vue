<template>
  <div class="flex items-start col-span-4">
    <div class="mt-1 sm:mt-0 flex-1">
      <div
        class="p-4 max-w-lg shadow-sm block w-full focus:ring-blue-500 focus:border-blue-500 sm:text-sm border border-gray-300 rounded-md"
      >
        <p
          v-if="nonAssociatedServicePermissions.length > 0"
          class="-mt-1 mb-2 text-sm font-medium text-gray-700 bg-gray-100"
        >
          Available
          {{
            services[selectedService] ? services[selectedService].clientId : ""
          }}
          Permissions
        </p>
        <div
          v-if="nonAssociatedServicePermissions.length === 0"
          class="flex items-center space-x-4 px-2 text-amber-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
            />
          </svg>
          <p>
            Permissions not available for service
            <span class="font-bold">{{
              services[selectedService].clientId
            }}</span>
          </p>
        </div>
        <ul
          v-if="nonAssociatedServicePermissions.length > 0"
          class="list-decimal list-inside space-y-2"
        >
          <li
            v-for="(permission, index) in nonAssociatedServicePermissions"
            :key="`${index}`"
            class="flex items-center justify-between"
          >
            <label :for="`allPermission${permission.id}`">{{
              permission.name
            }}</label>
            <input
              :id="`allPermission${permission.id}`"
              v-model="permission.checked"
              aria-describedby="all-service-permissions"
              type="checkbox"
              @change="setPermissionToService($event, permission)"
            />
          </li>
        </ul>
      </div>
      <p class="mt-2 text-sm text-gray-500">
        {{
          services[selectedService].description
            ? services[selectedService].description
            : ""
        }}
      </p>
    </div>

    <div class="flex flex-col items-center space-y-3 my-2">
      <button
        :disabled="services[selectedService].permissions.length === 0"
        :class="{
          'cursor-not-allowed':
            services[selectedService].permissions.length === 0,
        }"
        type="button"
        class="mx-4"
      >
        <ArrowRightCircleIcon class="w-6 h-6" />
      </button>

      <button
        :disabled="services[selectedService].permissions.length === 0"
        :class="{
          'cursor-not-allowed':
            services[selectedService].permissions.length === 0,
        }"
        type="button"
        class="mx-4"
      >
        <ArrowLeftCircleIcon class="w-6 h-6" />
      </button>
    </div>

    <div class="mt-1 sm:mt-0 flex-1">
      <div
        class="p-4 max-w-lg shadow-sm block w-full focus:ring-blue-500 focus:border-blue-500 sm:text-sm border border-gray-300 rounded-md"
      >
        <p
          v-if="existingServicePermissions.length > 0"
          class="-mt-1 mb-2 text-sm font-medium text-gray-700 bg-gray-100"
        >
          Associated To {{ services[selectedService].clientId }}
        </p>
        <div
          v-if="existingServicePermissions.length === 0"
          class="flex items-center space-x-4 px-2 text-amber-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
            />
          </svg>
          <p>
            Permissions not associated to service
            <span class="font-bold">{{
              services[selectedService].clientId
            }}</span>
          </p>
        </div>
        <ul
          v-if="existingServicePermissions.length > 0"
          class="list-decimal list-inside space-y-2"
        >
          <li
            v-for="(permission, index) in existingServicePermissions"
            :key="`${index}`"
            class="flex items-center justify-between"
          >
            <label :for="`existingPermission${permission.id}`">{{
              permission.name
            }}</label>
            <input
              :id="`existingPermission${permission.id}`"
              v-model="permission.checked"
              aria-describedby="existing-service-permissions"
              type="checkbox"
              @change="setPermissionToService($event, permission)"
            />
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ArrowRightCircleIcon,
  ArrowLeftCircleIcon,
} from "@heroicons/vue/24/solid";
import { computed, toRefs } from "vue";
import { permissionInterface, serviceInterface } from "@/types/roleTypes";

const props = defineProps<{
  existing: string[];
  selectedService: number | null;
  role_name: string;
  services: serviceInterface[];
}>();

const { existing, role_name, services, selectedService } = toRefs(props);

const existingServicePermissions = computed(() => {
  if (selectedService.value) {
    return services.value[selectedService.value].permissions.filter(
      permission =>
        existing.value.findIndex(
          index => index === permission.keycloakRoleId
        ) !== -1
    );
  }
  return [];
});

const nonAssociatedServicePermissions = computed(() => {
  if (selectedService.value) {
    return services.value[selectedService.value].permissions.filter(
      permission => {
        return (
          existing.value.findIndex(
            index => index === permission.keycloakRoleId
          ) === -1
        );
      }
    );
  }
  return [];
});

const setPermissionToService = (e: Event, permission: permissionInterface) => {
  console.log(e, permission);
};
</script>
