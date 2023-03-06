<script setup lang="ts">
import { ref, onBeforeMount } from "vue";
import { useStore } from "vuex";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import { ChevronDownIcon } from "@heroicons/vue/20/solid";
import ResetCredentialsModal from "@/components/ResetCredentialsModal.vue";
import { useRoles } from "@/Roles/composables/useRoles";
import { useUsers } from "@/Users/composables/useUsers";

const props = defineProps<{
  refId: string;
}>();

const { fetchUserRoles, userRoles } = useRoles();
const { user, fetchUser, syncUser, enableOrDisableUser } = useUsers();

const store = useStore();

const loading = ref(false);

const resetCredentialModalOpen = ref(false);

type ResetCredentialsAction = null | "USSD" | "WEB";
const resetCredentialsAction = ref<ResetCredentialsAction>(null);

function openResetCredentialsModal() {
  resetCredentialModalOpen.value = true;
}

function closeResetCredentialsModal() {
  resetCredentialsAction.value = null;
  resetCredentialModalOpen.value = false;
}

function getInitials(fullName: string) {
  let initials = "";
  const names = fullName.split(" ");
  if (names.length > 1) {
    initials += names[0].charAt(0).toUpperCase();
    initials += names[names.length - 1].charAt(0).toUpperCase();
  } else {
    initials += names[0].substring(0, 2).toUpperCase();
  }

  return initials;
}

const fetchUserData = async () => {
  await fetchUser(props.refId).then(async data => {
    if (data && user.value?.keycloakId)
      await fetchUserRoles(user.value.keycloakId);
  });
};

function resetWebPassword() {
  resetCredentialsAction.value = "WEB";
  openResetCredentialsModal();
}

function resetUSSDPin() {
  resetCredentialsAction.value = "USSD";
  openResetCredentialsModal();
}

const synchronizeUser = async () => {
  loading.value = true;
  if (!user.value) return;
  await syncUser(`${user.value.id}`)
    .then(async response => {
      if (response) {
        await store.dispatch("defineNotification", {
          message: "User Account Synchronised",
          success: true,
        });
      }
    })
    .catch(async e => {
      await store.dispatch("defineNotification", {
        message: e.message,
        error: true,
      });
    })
    .finally(() => (loading.value = false));
};

const enableUser = async () => {
  if (!user.value) return;
  if (confirm(`You are about to enable user ${user.value.firstName}`)) {
    loading.value = true;
    const payload: { userRefId: string; isEnabled: boolean } = {
      userRefId: props.refId,
      isEnabled: true,
    };
    await enableOrDisableUser(payload)
      .then(async response => {
        if (response) {
          await store.dispatch("defineNotification", {
            message: "User Account Enabled",
            success: true,
          });
          await fetchUserData();
        }
      })
      .catch(async e => {
        await store.dispatch("defineNotification", {
          message: e.message,
          error: true,
        });
      })
      .finally(() => (loading.value = false));
  }
};

const disableUser = async () => {
  if (!user.value) return;
  if (confirm(`You are about to disable user ${user.value.firstName}`)) {
    loading.value = true;
    const payload: { userRefId: string; isEnabled: boolean } = {
      userRefId: props.refId,
      isEnabled: false,
    };
    await enableOrDisableUser(payload)
      .then(async response => {
        if (response) {
          await store.dispatch("defineNotification", {
            message: "User Account Disabled",
            success: true,
          });
          await fetchUserData();
        }
      })
      .catch(async e => {
        await store.dispatch("defineNotification", {
          message: e.message,
          error: true,
        });
      })
      .finally(() => (loading.value = false));
  }
};

onBeforeMount(async () => await fetchUserData());
</script>

<template>
  <div class="min-h-full py-3 w-full">
    <div class="ml-6 flex items-center border-b border-gray-200">
      <nav
        class="flex space-x-4 items-center w-full"
        aria-label="Breadcrumb"
      >
        <ol
          role="list"
          class="flex items-center space-x-4"
        >
          <li>
            <div class="flex items-center">
              <router-link
                to="/users"
                class="text-base font-semibold leading-7 text-gray-900 sm:leading-9 sm:truncate"
                style="color: rgb(158, 158, 158)"
                >Users
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
                ></path>
              </svg>
              <h1
                class="text-base font-semibold leading-7 text-gray-900 sm:leading-9 sm:truncate"
              >
                User Profile
              </h1>
            </div>
          </li>
        </ol>
        <button
          type="button"
          class="relative inline-flex items-center px-2.5 py-1.5 rounded-md border border-gray-300 bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          @click="synchronizeUser"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </button>
      </nav>
    </div>
    <main
      v-if="user"
      class="py-10"
    >
      <!-- Page header -->
      <div
        class="px-4 sm:px-6 md:flex md:items-center md:justify-between md:space-x-5 lg:px-8"
      >
        <div class="flex items-center space-x-5">
          <div class="flex-shrink-0">
            <div class="relative">
              <span class="h-24 w-24 rounded-full border-2 p-2 border-black/50">
                {{ getInitials(user.firstName + " " + user.lastName) }}
              </span>
            </div>
          </div>
          <div class="space-y-2">
            <div class="flex space-x-4">
              <h1 class="text-2xl font-bold text-gray-900">
                {{ user.firstName + " " + user.lastName }}
              </h1>
              <span
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                :class="
                  user.isEnabled
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                "
              >
                {{ user.isEnabled ? "Enabled" : "Disabled" }}
              </span>
            </div>
            <p class="text-sm font-medium text-gray-500">
              Keycloak Id:
              <span class="text-gray-900">
                {{ user.keycloakId }}
              </span>
            </p>
          </div>
        </div>
        <div
          class="justify-stretch mt-6 flex flex-col-reverse space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-y-0 sm:space-x-3 sm:space-x-reverse md:mt-0 md:flex-row md:space-x-3"
        >
          <Menu
            as="div"
            class="relative inline-block text-left"
          >
            <div>
              <MenuButton
                class="inline-flex justify-center items-center items-center px-3 py-2 border border-red-300 leading-4 shadow-sm text-sm font-medium rounded-md text-red-700 bg-red-200 hover:bg-red-400 hover:text-white focus:outline-none focus:ring-0"
              >
                Reset Credentials
                <ChevronDownIcon
                  class="-mr-1 ml-2 h-5 w-5"
                  aria-hidden="true"
                />
              </MenuButton>
            </div>

            <transition
              enter-active-class="transition ease-out duration-100"
              enter-from-class="transform opacity-0 scale-95"
              enter-to-class="transform opacity-100 scale-100"
              leave-active-class="transition ease-in duration-75"
              leave-from-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95"
            >
              <MenuItems
                class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
              >
                <div class="p-1">
                  <MenuItem
                    v-slot="{ active }"
                    class="rounded-md hover:text-red-700 hover:font-medium hover:bg-red-200"
                  >
                    <a
                      :class="[
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                        'block px-4 py-2 text-sm hover:cursor-pointer',
                      ]"
                      @click.prevent="resetUSSDPin"
                    >
                      Reset USSD Pin
                    </a>
                  </MenuItem>
                  <MenuItem
                    v-slot="{ active }"
                    class="rounded-md hover:text-red-700 hover:font-medium hover:bg-red-200"
                  >
                    <a
                      :class="[
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                        'block px-4 py-2 text-sm hover:cursor-pointer',
                      ]"
                      @click.prevent="resetWebPassword"
                    >
                      Reset Web Password
                    </a>
                  </MenuItem>
                </div>
              </MenuItems>
            </transition>
          </Menu>

          <Menu
            as="div"
            class="relative inline-block text-left"
          >
            <div>
              <MenuButton
                class="inline-flex justify-center items-center px-3 py-2 border border-teal-300 leading-4 shadow-sm text-sm font-medium rounded-md text-teal-700 bg-teal-100 hover:bg-teal-200 focus:outline-none focus:ring-0"
              >
                Edit
                <ChevronDownIcon
                  class="-mr-1 ml-2 h-5 w-5"
                  aria-hidden="true"
                />
              </MenuButton>
            </div>

            <transition
              enter-active-class="transition ease-out duration-100"
              enter-from-class="transform opacity-0 scale-95"
              enter-to-class="transform opacity-100 scale-100"
              leave-active-class="transition ease-in duration-75"
              leave-from-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95"
            >
              <MenuItems
                class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
              >
                <div class="p-1">
                  <MenuItem
                    v-slot="{ active }"
                    class="rounded-md hover:text-teal-700 hover:font-medium hover:bg-teal-100"
                  >
                    <router-link
                      :to="`/users/${refId}/edit`"
                      :class="[
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                        'block px-4 py-2 text-sm',
                      ]"
                    >
                      Edit User
                    </router-link>
                  </MenuItem>
                  <MenuItem
                    v-if="user.isEnabled"
                    v-slot="{ active }"
                    class="rounded-md hover:text-red-700 hover:font-medium hover:bg-red-200"
                  >
                    <a
                      :class="[
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                        'block px-4 py-2 text-sm hover:cursor-pointer',
                      ]"
                      @click.prevent="disableUser"
                    >
                      Disable User
                    </a>
                  </MenuItem>
                  <MenuItem
                    v-else
                    v-slot="{ active }"
                    class="rounded-md hover:text-teal-700 hover:font-medium hover:bg-teal-100"
                  >
                    <a
                      :class="[
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                        'block px-4 py-2 text-sm hover:cursor-pointer',
                      ]"
                      @click.prevent="enableUser"
                    >
                      Enable User
                    </a>
                  </MenuItem>
                </div>
              </MenuItems>
            </transition>
          </Menu>
        </div>
      </div>

      <div
        class="mt-8 grid grid-cols-1 gap-6 sm:px-6 lg:grid-flow-col-dense lg:grid-cols-4"
      >
        <div class="space-y-6 lg:col-span-3 lg:col-start-1">
          <!-- Description list-->
          <section aria-labelledby="applicant-information-title">
            <div class="bg-white shadow sm:rounded-lg">
              <div class="px-4 py-5 sm:px-6">
                <h2
                  id="applicant-information-title"
                  class="text-lg font-medium leading-6 text-gray-900"
                >
                  User Information
                </h2>
                <p class="mt-1 max-w-2xl text-sm text-gray-500">
                  Personal details and roles.
                </p>
              </div>
              <div class="border-t border-gray-200 px-4 py-5 sm:px-6">
                <dl class="grid grid-cols-1 gap-x-4 gap-y-12 sm:grid-cols-2">
                  <div class="sm:col-span-1">
                    <dt class="text-sm font-medium text-gray-500">Name</dt>
                    <dd class="mt-1 text-sm text-gray-900">
                      {{ user.firstName + " " + user.lastName }}
                    </dd>
                  </div>
                  <div class="sm:col-span-1">
                    <dt class="text-sm font-medium text-gray-500">Username</dt>
                    <dd class="mt-1 text-sm text-gray-900">
                      {{ user.username }}
                    </dd>
                  </div>
                  <div class="sm:col-span-1">
                    <dt class="text-sm font-medium text-gray-500">Email</dt>
                    <dd class="mt-1 text-sm text-gray-900">
                      {{ user.email }}
                    </dd>
                  </div>
                  <div class="sm:col-span-1">
                    <dt class="text-sm font-medium text-gray-500">
                      USSD Phone No.
                    </dt>
                    <dd class="mt-1 text-sm text-gray-900">
                      {{ user.ussdPhoneNumber }}
                    </dd>
                  </div>
                  <div class="sm:col-span-1">
                    <dt class="text-sm font-medium text-gray-500">
                      Ussd Details
                    </dt>
                    <dd class="mt-1 text-sm text-gray-900">
                      <ul
                        role="list"
                        class="rounded-md border border-gray-200"
                      >
                        <li
                          class="flex items-center justify-between py-3 pl-3 pr-4 text-sm"
                        >
                          <div class="flex w-0 flex-1 items-center">
                            <span class="ml-2 w-0 flex-1 truncate"
                              >USSD Status
                            </span>
                          </div>
                          <div class="ml-4 flex-shrink-0">
                            <span
                              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                              :class="
                                user.isUSSDDisabled
                                  ? 'bg-red-100 text-red-700'
                                  : 'bg-green-100 text-green-800'
                              "
                            >
                              {{
                                user.isUSSDDisabled === true
                                  ? "Disabled"
                                  : "Enabled"
                              }}
                            </span>
                          </div>
                        </li>
                        <li
                          class="flex items-center justify-between py-3 pl-3 pr-4 text-sm"
                        >
                          <div class="flex w-0 flex-1 items-center">
                            <span class="ml-2 w-0 flex-1 truncate"
                              >Pin Status
                            </span>
                          </div>
                          <div class="ml-4 flex-shrink-0">
                            <span
                              class="font-medium text-blue-600 hover:text-blue-500"
                            >
                              {{ user.pinStatus }}
                            </span>
                          </div>
                        </li>
                        <li
                          class="flex items-center justify-between py-3 pl-3 pr-4 text-sm"
                        >
                          <div class="flex w-0 flex-1 items-center">
                            <span class="ml-2 w-0 flex-1 truncate"
                              >Remaining Pin Attempts
                            </span>
                          </div>
                          <div class="ml-4 flex-shrink-0">
                            <p
                              class="font-medium text-blue-600 hover:text-blue-500"
                            >
                              {{ user.pinAttempts ?? 0 }}
                            </p>
                          </div>
                        </li>
                      </ul>
                    </dd>
                  </div>
                  <div class="sm:col-span-1">
                    <dt class="text-sm font-medium text-gray-500">
                      Web Details
                    </dt>
                    <dd class="mt-1 text-sm text-gray-900">
                      <ul
                        role="list"
                        class="rounded-md border border-gray-200"
                      >
                        <li
                          class="flex items-center justify-between py-3 pl-3 pr-4 text-sm"
                        >
                          <div class="flex w-0 flex-1 items-center">
                            <span class="ml-2 w-0 flex-1 truncate">
                              Web Access
                            </span>
                          </div>
                          <div class="ml-4 flex-shrink-0">
                            <span
                              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                              :class="
                                user.isEnabled
                                  ? user.email
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-700'
                                  : 'bg-red-100 text-red-700'
                              "
                            >
                              {{
                                user.isEnabled
                                  ? user.email
                                    ? "Yes"
                                    : "No"
                                  : "No"
                              }}
                            </span>
                          </div>
                        </li>
                        <li
                          class="flex items-center justify-between py-3 pl-3 pr-4 text-sm"
                        >
                          <div class="flex w-0 flex-1 items-center">
                            <span class="ml-2 w-0 flex-1 truncate"
                              >Username
                            </span>
                          </div>
                          <div class="ml-4 flex-shrink-0">
                            <span
                              class="font-medium text-blue-600 hover:text-blue-500"
                            >
                              {{ user.email }}
                            </span>
                          </div>
                        </li>
                        <li
                          class="flex items-center justify-between py-3 pl-3 pr-4 text-sm"
                        >
                          <div class="flex w-0 flex-1 items-center">
                            <span class="ml-2 w-0 flex-1 truncate"
                              >Password Status
                            </span>
                          </div>
                          <div class="ml-4 flex-shrink-0">
                            <span
                              class="font-medium text-blue-600 hover:text-blue-500"
                            >
                              {{ user.passwordStatus }}
                            </span>
                          </div>
                        </li>
                      </ul>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </section>
        </div>

        <section
          aria-labelledby="timeline-title"
          class="lg:col-span-1 lg:col-start-4"
        >
          <div class="bg-white px-4 py-5 shadow sm:rounded-lg sm:px-6">
            <h2
              id="timeline-title"
              class="text-lg font-medium text-gray-900"
            >
              Roles
            </h2>
            <p class="mt-1 max-w-2xl text-sm text-gray-500">
              User assigned roles.
            </p>

            <div class="mt-6 flow-root">
              <ul
                role="list"
                class="space-y-2 list-decimal list-inside"
              >
                <li
                  v-for="role in userRoles"
                  :key="role.id"
                  class="text-sm text-gray-500"
                >
                  <router-link
                    :to="`/roles/${role.keycloakRoleId}`"
                    class="hover:text-blue-600"
                  >
                    {{ role.name }}
                  </router-link>
                </li>
              </ul>
            </div>
            <div class="justify-stretch mt-6 flex flex-col">
              <router-link
                :to="`/users/${refId}/assign-roles`"
                class="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-0"
              >
                Assign Roles
              </router-link>
            </div>
          </div>
        </section>
      </div>
    </main>
  </div>
  <Teleport to="body">
    <ResetCredentialsModal
      v-if="resetCredentialsAction && user"
      :open="resetCredentialModalOpen"
      :action="resetCredentialsAction"
      :user="user"
      @close="closeResetCredentialsModal"
    />
  </Teleport>
</template>
