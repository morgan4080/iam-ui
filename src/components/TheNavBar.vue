<script setup lang="ts">
import TheLogo from "./TheLogo.vue";
import { computed, ref } from "vue";
import { useStore } from "vuex";
const servicesMenu = ref(false);
const accountMenu = ref(false);
const mobileMenu = ref(false);

const store = useStore();
// defineProps<{ user: object }>()

const user = computed(() => {
  return store.state.user ? store.state.user : null;
});
console.log(store.state.user);

const organisation = computed(() =>
  store.state.user ? store.state.user.companyName : null
);

async function doLogout() {
  try {
    await fetch(`${import.meta.env.VITE_APP_ROOT_AUTH}/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (e: any) {
    console.log(e.message);
  } finally {
    window.location.reload();
  }
}

const theUrl: any = import.meta.env.VITE_APP_ROOT_AUTH;
</script>
<template>
  <nav class="bg-gray-800">
    <div class="mx-auto px-2 sm:px-6 lg:px-8">
      <div class="relative flex items-center justify-between h-16">
        <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
          <!-- Mobile menu button-->
          <button
            type="button"
            class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-400 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            aria-controls="mobile-menu"
            aria-expanded="false"
            @click="mobileMenu = !mobileMenu"
          >
            <span class="sr-only">Open main menu</span>
            <!--
              Icon when menu is closed.

              Heroicon name: outline/menu

              Menu open: "hidden", Menu closed: "block"
            -->
            <svg
              class="block h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            <!--
              Icon when menu is open.

              Heroicon name: outline/x

              Menu open: "block", Menu closed: "hidden"
            -->
            <svg
              class="hidden h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div
          class="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start"
        >
          <div class="flex-shrink-0 flex items-center">
            <a
              :href="theUrl"
              class="navbar p-1 flex items-center justify-center"
              style="background: transparent"
            >
              <TheLogo class="h-8 w-auto" />
              <span
                class="text-white ml-4 mt-2 hidden sm:block font-semibold"
                >{{ organisation }}</span
              >
            </a>
          </div>
          <!--          sm:block-->
          <div class="hidden sm:ml-6">
            <div class="flex space-x-4">
              <div class="ml-6 relative">
                <div>
                  <button
                    id="services-menu-button"
                    type="button"
                    class="inline-flex items-center px-3 py-2 text-sm leading-4 font-medium rounded-md text-gray-100 bg-gray-800 hover:text-gray-400 focus:outline-none focus:ring-1 transition"
                    aria-expanded="false"
                    aria-haspopup="true"
                    @click="servicesMenu = !servicesMenu"
                  >
                    <span class="sr-only">Open services menu</span>
                    Services
                    <svg
                      class="mt-1 rotate-90 flex-shrink-0 h-5 w-5 transform group-hover:text-gray-400 transition-colors ease-in-out duration-150 text-gray-300 text-gray-300"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path
                        d="M6 6L14 10L6 14V6Z"
                        fill="currentColor"
                      />
                    </svg>
                  </button>
                </div>

                <transition
                  enter-active-class="transition ease-out duration-100"
                  leave-active-class="transition ease-in duration-75"
                  enter-class="transform opacity-0 scale-95"
                  enter-to-class="transform opacity-100 scale-100"
                  leave-class="transform opacity-100 scale-100"
                  leave-to-class="transform opacity-0 scale-95"
                >
                  <div
                    v-if="servicesMenu"
                    class="bg-gray-800 origin-top-left absolute left-0 mt-2 w-48 rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 focus:outline-none z-20"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu-button"
                    tabindex="-1"
                  >
                    <!-- Active: "bg-gray-100", Not Active: "" -->
                    <a
                      id="service-menu-item-0"
                      href="#"
                      class="navbar block px-4 py-2 text-sm text-gray-100 hover:bg-gray-700"
                      role="menuitem"
                      tabindex="-1"
                      >Service 1</a
                    >
                    <a
                      id="service-menu-item-2"
                      href="#"
                      class="navbar block px-4 py-2 text-sm text-gray-100 hover:bg-gray-700"
                      role="menuitem"
                      tabindex="-1"
                      >Service 2</a
                    >
                  </div>
                </transition>
              </div>
            </div>
          </div>
        </div>
        <div
          class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0"
        >
          <!-- Profile dropdown -->
          <div class="ml-3 relative">
            <div>
              <button
                id="user-menu-button"
                type="button"
                class="inline-flex items-center px-3 py-2 text-sm leading-4 font-medium rounded-md text-gray-100 bg-gray-800 hover:text-gray-400 focus:outline-none focus:ring-1 transition"
                aria-expanded="false"
                aria-haspopup="true"
                @click="accountMenu = !accountMenu"
              >
                <span class="sr-only">Open user menu</span>
                {{ user ? user.firstName + " " + user.lastName : "loading.." }}
                <svg
                  class="mt-1 rotate-90 flex-shrink-0 h-5 w-5 transform group-hover:text-gray-400 transition-colors ease-in-out duration-150 text-gray-300 text-gray-300"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path
                    d="M6 6L14 10L6 14V6Z"
                    fill="currentColor"
                  />
                </svg>
              </button>
            </div>

            <transition
              enter-active-class="transition ease-out duration-100"
              leave-active-class="transition ease-in duration-75"
              enter-class="transform opacity-0 scale-95"
              enter-to-class="transform opacity-100 scale-100"
              leave-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95"
            >
              <div
                v-if="accountMenu"
                class="bg-gray-800 origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 focus:outline-none z-20"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="user-menu-button"
                tabindex="-1"
              >
                <!-- Active: "bg-gray-100", Not Active: "" -->
                <!--              <router-link :to="`/profiles/${user.id}`" @click="accountMenu = !accountMenu" class="navbar block px-4 py-2 text-sm text-gray-100 hover:bg-gray-700" role="menuitem" tabindex="-1" id="user-menu-item-0">Your Profile</router-link>-->
                <a
                  id="user-menu-item-2"
                  class="navbar cursor-pointer block px-4 py-2 text-sm text-gray-100 hover:bg-gray-700"
                  role="menuitem"
                  tabindex="-1"
                  @click="doLogout"
                  >Sign out</a
                >
              </div>
            </transition>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile menu, show/hide based on menu state. -->
    <div
      v-if="mobileMenu"
      id="mobile-menu"
      class="sm:hidden"
    >
      <div class="px-2 pt-2 pb-3 space-y-1">
        <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-gray-400" -->
        <a
          href="#"
          class="bg-gray-900 text-white block px-3 py-2 rounded-md text-base font-medium"
          aria-current="page"
          >Dashboard</a
        >

        <a
          href="#"
          class="text-gray-300 hover:bg-gray-700 hover:text-gray-400 block px-3 py-2 rounded-md text-base font-medium"
          >Users</a
        >

        <a
          href="#"
          class="text-gray-300 hover:bg-gray-700 hover:text-gray-400 block px-3 py-2 rounded-md text-base font-medium"
          >Roles</a
        >

        <a
          href="#"
          class="text-gray-300 hover:bg-gray-700 hover:text-gray-400 block px-3 py-2 rounded-md text-base font-medium"
          >Customers</a
        >
      </div>
    </div>
  </nav>
</template>
