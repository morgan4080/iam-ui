<script setup lang="ts">
import { useRouter } from "vue-router";
import { computed, onBeforeMount, reactive, ref } from "vue";
import { useStore } from "vuex";
import { useUsers } from "@/Users/composables/useUsers";
import { QrInterface, EditUserPayload } from "@/Users/types";
import { mapActions } from "@/modules/mapStore";

const props = defineProps<{
  refId: string;
}>();
const { defineNotification } = mapActions();
const router = useRouter();
const store = useStore();
const { user, isLoading, fetchUser, verifyUnique, editUser } = useUsers();

const query = ref("?");

const form = reactive({
  username: "",
  firstName: "",
  lastName: "",
  emailAddress: "",
  company: "",
  phoneNumber: "",
  ussdPhoneNumber: "",
  password: "",
  passwordConfirmation: "",
  pinSecret: "",
  pinSecretConfirmation: "",
  user_roles: [],
});

const organisation = computed(() =>
  store.state.user ? store.state.user.companyName : null
);

const qrObject: QrInterface = {
  phoneNumber: "",
  ussdPhoneNumber: "",
  email: "",
  username: "",
};

async function byIdentifier() {
  for (const [key, value] of Object.entries(qrObject)) {
    if (value && query.value === "?") {
      query.value += `${key}=${value}`;
    } else if (value && query.value !== "?") {
      query.value += `&${key}=${value}`;
    }
  }

  const response = await verifyUnique(query.value);
  query.value = "?";

  return response === "unique";
}

async function setQuery(e: Event) {
  const el = e.target as HTMLInputElement;
  if (el.id === "email") {
    qrObject.phoneNumber = "";
    qrObject.email = form.emailAddress;
    qrObject.username = "";
  }
  if (el.id === "phone-number") {
    qrObject.phoneNumber = form.phoneNumber;
    qrObject.email = "";
    qrObject.username = "";
  }
  if (el.id === "phone-number") {
    if (el.value.length > 12) {
      el.classList.add("focus:ring-red-400");
      el.classList.add("focus:border-red-400");
      el.onblur = () => {
        el.classList.remove("focus:ring-red-400");
        el.classList.remove("focus:border-red-400");
      };
      el.value = el.value.slice(0, 4);
      await defineNotification({
        message: "No more than 12 characters",
        error: true,
      });
    }
    qrObject.phoneNumber = form.phoneNumber;
    qrObject.email = "";
    qrObject.username = "";
  }
  if (el.id === "ussd-phone-number") {
    if (el.value.length > 12) {
      el.classList.add("focus:ring-red-400");
      el.classList.add("focus:border-red-400");
      el.onblur = () => {
        el.classList.remove("focus:ring-red-400");
        el.classList.remove("focus:border-red-400");
      };
      el.value = el.value.slice(0, 4);
      await defineNotification({
        message: "No more than 12 characters",
        error: true,
      });
    }
    const response0 = await verifyUnique(`?ussdPhoneNumber=${form.ussdPhoneNumber}`);
    if (response0 !== "unique") {
      form.ussdPhoneNumber = "";
      await defineNotification({
        message: `User with that phone number already exists`,
        error: true,
      });
    }
    return;
  }
  if (el.id === "username") {
    qrObject.phoneNumber = "";
    qrObject.email = "";
    qrObject.username = form.username;
  }

  const response = await byIdentifier();

  if (!response) {
    for (const [key, value] of Object.entries(qrObject)) {
      if (value) {
        if (key === "email") {
          form.emailAddress = "";
        }
        if (key === "phoneNumber") {
          form.phoneNumber = "";
        }
        if (key === "username") {
          form.username = "";
        }
        await defineNotification({
          message: `User with that ${key} already exists`,
          error: true,
        });
      }
    }
  }
}

async function edit() {
  if (!user.value) return;
  const payload: EditUserPayload = {
    userRefId: user.value.id,
    userName: form.username,
    firstName: form.firstName,
    lastName: form.lastName,
    email: form.emailAddress,
    phoneNumber: form.phoneNumber,
    ussdPhoneNumber: form.ussdPhoneNumber,
    isEnabled: true,
  };

  if (form.emailAddress === "") {
    delete payload.email;
  }
  if (form.phoneNumber === "") {
    delete payload.phoneNumber;
  }

  await editUser(payload)
    .then(async response => {
      if (response) {
        await defineNotification({
          message: `User Edited successfully`,
          success: true,
        });
        await router.push(`/users/${props.refId}/view`);
      }
    })
    .catch(async (error: string) => {
      await defineNotification({
        message: error,
        error: true,
      });
    });
}

onBeforeMount(async () => {
  await fetchUser(props.refId).then(() => {
    if (!user.value) return;
    form.username = user.value.username;
    form.firstName = user.value.firstName;
    form.lastName = user.value.lastName;
    form.emailAddress = user.value.email;
    form.username = user.value.username;
    form.phoneNumber = user.value.phoneNumber;
    form.ussdPhoneNumber = user.value.ussdPhoneNumber;
    form.company = organisation.value;
  });
});
</script>

<template>
  <div class="w-full bg-white">
    <div class="flex-col w-full pb-28">
      <div class="px-4 pb-6 sm:px-6 lg:mx-auto lg:px-8">
        <div class="pt-3 flex items-center">
          <nav
            class="flex"
            aria-label="Breadcrumb"
          >
            <ol
              role="list"
              class="flex items-center space-x-4"
            >
              <li>
                <div class="flex items-center">
                  <router-link
                    :to="`/users/${refId}/view`"
                    class="text-base font-semibold leading-7 text-gray-900 sm:leading-9 sm:truncate"
                    style="color: #9e9e9e"
                    >User Profile
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
                    Edit User
                  </h1>
                </div>
              </li>
            </ol>
          </nav>
        </div>
        <form
          v-if="user"
          method="POST"
          @submit.prevent="edit"
        >
          <div class="md:flex md:flex-col md:justify-between">
            <div class="flex-1 min-w-0">
              <div
                class="text-xl font-semibold leading-7 text-gray-900 py-2 sm:leading-9 sm:truncate border-b border-gray-200"
              >
                {{ user.firstName + " " + user.lastName }}
              </div>
              <div class="py-3 md:flex md:justify-between">
                <div class="text-sm block w-full">
                  <div class="space-y-2">
                    <div
                      class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5"
                    >
                      <label
                        for="username"
                        class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                      >
                        Username
                      </label>
                      <div class="mt-1 sm:mt-0 sm:col-span-2">
                        <div class="max-w-lg flex rounded-md shadow-sm">
                          <input
                            id="username"
                            v-model="form.username"
                            type="text"
                            name="username"
                            class="flex-1 block w-full focus:ring-blue-500 focus:border-blue-500 min-w-0 rounded-md sm:text-sm border-gray-300"
                            required
                          />
                        </div>
                      </div>
                    </div>
                    <div
                      class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5"
                    >
                      <label
                        for="first-name"
                        class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                      >
                        First Name
                      </label>
                      <div class="mt-1 sm:mt-0 sm:col-span-2">
                        <div class="max-w-lg flex rounded-md shadow-sm">
                          <input
                            id="first-name"
                            v-model="form.firstName"
                            type="text"
                            name="first-name"
                            class="flex-1 block w-full focus:ring-blue-500 focus:border-blue-500 min-w-0 rounded-md sm:text-sm border-gray-300"
                            required
                          />
                        </div>
                      </div>
                    </div>
                    <div
                      class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5"
                    >
                      <label
                        for="last-name"
                        class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                      >
                        Last Name
                      </label>
                      <div class="mt-1 sm:mt-0 sm:col-span-2">
                        <div class="max-w-lg flex rounded-md shadow-sm">
                          <input
                            id="last-name"
                            v-model="form.lastName"
                            type="text"
                            name="last-name"
                            class="flex-1 block w-full focus:ring-blue-500 focus:border-blue-500 min-w-0 rounded-md sm:text-sm border-gray-300"
                            required
                          />
                        </div>
                      </div>
                    </div>
                    <div
                      class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5"
                    >
                      <label
                        for="email"
                        class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                      >
                        Email
                      </label>
                      <div class="mt-1 sm:mt-0 sm:col-span-2">
                        <div class="max-w-lg flex rounded-md shadow-sm">
                          <input
                            id="email"
                            v-model="form.emailAddress"
                            type="email"
                            name="email"
                            class="flex-1 block w-full focus:ring-blue-500 focus:border-blue-500 min-w-0 rounded-md sm:text-sm border-gray-300"
                            required
                            @change="setQuery($event)"
                          />
                        </div>
                      </div>
                    </div>
                    <div
                      class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5"
                    >
                      <label
                        for="ussd-phone-number"
                        class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                      >
                        USSD Phone number
                      </label>
                      <div class="mt-1 sm:mt-0 sm:col-span-2">
                        <div class="max-w-lg relative rounded-md shadow-sm">
                          <div
                            class="absolute inset-y-0 left-0 flex items-center"
                          >
                            <label
                              for="country"
                              class="sr-only"
                              >Country
                            </label>
                            <select
                              id="country"
                              class="h-full py-0 pl-4 pr-8 border-transparent bg-transparent text-gray-500 focus:ring-blue-500 focus:border-blue-500 rounded-md"
                            >
                              <option>KE</option>
                            </select>
                          </div>
                          <input
                            id="ussd-phone-number"
                            v-model="form.ussdPhoneNumber"
                            type="number"
                            class="py-1 px-4 block w-full pl-20 focus:ring-blue-500 focus:border-indigo-500 border-gray-300 rounded-md"
                            required
                            @change="setQuery($event)"
                          />
                        </div>
                      </div>
                    </div>
                    <div
                      class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5"
                    >
                      <label
                        for="phone-number"
                        class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                      >
                        Phone number
                      </label>
                      <div class="mt-1 sm:mt-0 sm:col-span-2">
                        <div class="max-w-lg relative rounded-md shadow-sm">
                          <div
                            class="absolute inset-y-0 left-0 flex items-center"
                          >
                            <label
                              for="country"
                              class="sr-only"
                              >Country
                            </label>
                            <select
                              id="country"
                              class="h-full py-0 pl-4 pr-8 border-transparent bg-transparent text-gray-500 focus:ring-blue-500 focus:border-blue-500 rounded-md"
                            >
                              <option>KE</option>
                            </select>
                          </div>
                          <input
                            id="phone-number"
                            v-model="form.phoneNumber"
                            type="number"
                            class="py-1 px-4 block w-full pl-20 focus:ring-blue-500 focus:border-indigo-500 border-gray-300 rounded-md"
                            required
                            @change="setQuery($event)"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="flex w-full">
            <button
              type="submit"
              :disabled="isLoading"
              class="inline-flex mt-4 ml-auto items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-indigo-500"
            >
              <svg
                v-if="isLoading"
                class="animate-spin -ml-1 mr-1 h-3 w-3 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Save user
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
