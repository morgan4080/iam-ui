<script setup lang="ts">
import { getRole } from "@/modules/all";
import { useRoute } from "vue-router";
import { ref } from "vue";
const route = useRoute();

const role = ref(<any>{});
getRole(route.params.id).then((r: any) => {
  role.value = r;
});
</script>
<template>
  <div
    class="w-full h-screen bg-white pb-28 overflow-y-auto"
    style="min-height: 640px"
  >
    <div class="pt-3 flex items-center w-full px-4 sm:px-6 lg:px-8">
      <nav
        class="mt-0 flex justify-between items-center w-full"
        aria-label="Breadcrumb"
      >
        <ol
          role="list"
          class="flex items-center space-x-4"
        >
          <li>
            <div class="flex items-center">
              <router-link
                :to="`/roles/`"
                class="text-base font-semibold leading-7 text-gray-900 sm:leading-9 sm:truncate"
                style="color: #9e9e9e"
              >
                Roles
              </router-link>
            </div>
          </li>

          <li>
            <div class="flex items-center">
              <svg
                class="flex-shrink-0 h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
              <h1
                class="text-base font-semibold leading-7 text-gray-900 sm:leading-9 sm:truncate"
              >
                {{ role.name }} : {{ role.id }}
              </h1>
            </div>
          </li>
        </ol>
        <button
          type="button"
          class="inline-flex justify-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          @click="$router.push(`/roles/${role.keycloakRoleId}/edit`)"
        >
          Edit Role
          <svg
            class="ml-2 -mr-0.5 h-4 w-4 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
            />
          </svg>
        </button>
      </nav>
    </div>
    <div class="w-full pb-20 px-4 sm:px-6 pt-4 lg:pb-28 lg:px-8">
      <div class="relative w-full divide-y-2 divide-gray-200">
        <div>
          <h2
            class="text-2xl tracking-tight font-extrabold text-gray-900 sm:text-2xl"
          >
            Role Description
          </h2>
          <div class="flex justify-around pb-3">
            <div class="min-w-0 flex-1">
              <h3 class="text-base font-medium text-gray-900">
                <span
                  class="rounded-sm focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                >
                  <span class="focus:outline-none">
                    <span aria-hidden="true" />
                    Name
                  </span>
                </span>
              </h3>
              <p class="text-base text-gray-500">
                {{ role.name }}
              </p>
            </div>
            <div class="min-w-0 flex-1">
              <h3 class="text-base font-medium text-gray-900">
                <span
                  class="rounded-sm focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                >
                  <span class="focus:outline-none">
                    <span aria-hidden="true" />
                    Role Type
                  </span>
                </span>
              </h3>
              <p class="text-base text-gray-500">
                {{ role.roleType }}
              </p>
            </div>
            <div class="min-w-0 flex-1">
              <h3 class="text-base font-medium text-gray-900">
                <span
                  class="rounded-sm focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                >
                  <span class="focus:outline-none">
                    <span aria-hidden="true" />
                    Role Description
                  </span>
                </span>
              </h3>
              <p class="text-base text-gray-500">
                {{ role.description }}
              </p>
            </div>
          </div>
        </div>
        <div v-if="role.services">
          <h2
            class="text-3xl tracking-tight pt-4 font-extrabold text-gray-900 sm:text-xl"
          >
            Permissions
          </h2>
          <div
            class="mt-2 grid gap-16 pt-4 lg:grid-cols-3 lg:gap-x-5 lg:gap-y-12"
          >
            <div
              v-for="post in role.services"
              :key="post.id"
              class="border border-gray-300 rounded-md p-2"
            >
              <p class="text-xl font-semibold text-gray-900">
                {{ post.clientId }}
              </p>
              <div
                v-for="(permission, i) in post.permissions"
                class="p-1 rounded"
                :class="{ 'bg-gray-100': i % 2 === 0 }"
              >
                <div class="flex">
                  <p class="mt-3 text-xs text-gray-800">
                    Name:
                    <span class="mt-3 mx-2 text-xs text-gray-500">{{
                      permission.name
                    }}</span>
                  </p>
                </div>
                <div class="flex">
                  <p class="mt-3 text-xs text-gray-800">
                    Role Type:
                    <span class="mt-3 mx-2 text-xs text-gray-500">{{
                      permission.roleType
                    }}</span>
                  </p>
                </div>
                <div class="flex">
                  <p class="mt-3 text-xs text-gray-800">
                    Description:
                    <span class="mt-3 text-xs text-gray-500">{{
                      permission.description
                    }}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
