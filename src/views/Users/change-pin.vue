<script setup lang="ts">
import { useRoute } from "vue-router";
import { ref, computed } from "vue";
import { getUser } from "@/modules/all";
import {
  mapState,
  mapGetters,
  mapMutations,
  mapActions,
} from "@/modules/mapStore";
import router from "@/router";

const { pinChange, defineNotification, verifyUnique } = mapActions();

const route = useRoute();

const loading = ref(<boolean>false);

const userData = ref({
  firstName: "",
  lastName: "",
  email: "",
  id: "",
  isEnabled: "",
  keycloakId: "",
  phoneNumber: "",
  ussdPhoneNumber: "",
  tenantId: "",
  userAssignedRolesId: [],
  userType: "",
  username: "",
});

type PinStates = "SET" | "NOT-SET" | "TEMPORARY";

const formPinStatus = ref(<PinStates>"TEMPORARY");

const formNotificationStatus = ref(<boolean>true);

getUser(route)
  .then(data => {
    const { user } = data;
    userData.value = {
      ...userData.value,
      ...user,
    };
    userData.value.ussdPhoneNumber = user.ussdPhoneNumber;
    form.value.ussdPhoneNumber = user.ussdPhoneNumber;
  })
  .catch((e: any) => {
    alert(e.message);
  });
const form = ref(<
  { pin: string; pinConfirmation: string; ussdPhoneNumber: string }
>{
  pin: "",
  pinConfirmation: "",
  ussdPhoneNumber: "",
});

async function changePin() {
  if (form.value.pin !== form.value.pinConfirmation) {
    await defineNotification({
      message: "Make Sure the pins are the same",
      error: true,
    });
    return;
  }
  loading.value = true;
  try {
    const payload = {
      ussdPhoneNumberOrKeycloakId: userData.value.keycloakId,
      newUSSDPhoneNumber: form.value.ussdPhoneNumber,
      pinStatus: formPinStatus.value,
      notifyUser: formNotificationStatus.value,
      pin: form.value.pin,
    };
    const response = await pinChange(payload);
    console.log(response);
    form.value = {
      pin: "",
      pinConfirmation: "",
      ussdPhoneNumber: "",
    };
    await defineNotification({
      message: "Pin Change Successful",
      success: true,
    });
    await router.push(`/users/${route.params.id}`);
  } catch (e: any) {
    await defineNotification({ message: e.messages, error: true });
  } finally {
    loading.value = false;
    await router.push(`/users/${route.params.id}`);
  }
}

const validatePin = async (e: any) => {
  let numRegex = /^\d+$/;
  if (!e.target.value.match(numRegex)) {
    e.target.classList.add("focus:ring-red-400");
    e.target.classList.add("focus:border-red-400");
    e.target.onblur = () => {
      e.target.classList.remove("focus:ring-red-400");
      e.target.classList.remove("focus:border-red-400");
    };
    e.target.value = e.target.value.slice(0, -1);
    await defineNotification({ message: "Pin must be a number", error: true });
  }
  if (e.target.value.length > 4) {
    e.target.classList.add("focus:ring-red-400");
    e.target.classList.add("focus:border-red-400");
    e.target.onblur = () => {
      e.target.classList.remove("focus:ring-red-400");
      e.target.classList.remove("focus:border-red-400");
    };
    e.target.value = e.target.value.slice(0, 4);
    await defineNotification({
      message: "No more than 4 characters",
      error: true,
    });
  }
};

const validatePhone = async (e: any) => {
  let response = await verifyUnique(`?ussdPhoneNumber=${e.target.value}`);

  if (response !== "unique") {
    e.target.value = userData.value.ussdPhoneNumber;
    e.target.classList.add("focus:ring-red-400");
    e.target.classList.add("focus:border-red-400");
    e.target.onblur = () => {
      e.target.classList.remove("focus:ring-red-400");
      e.target.classList.remove("focus:border-red-400");
    };
    await defineNotification({
      message: "USSD Phone Number Number already taken",
      error: true,
    });
  }
};

const setPinStatus = (e: any): void => {
  if (e.target.checked) {
    formPinStatus.value = "TEMPORARY";
  } else {
    formPinStatus.value = "SET";
  }
};

const setNotificationStatus = (e: any): void => {
  formNotificationStatus.value = !!e.target.checked;
};
</script>
<template>
  <div class="w-full max-h-screen overflow-y-scroll">
    <form @submit.prevent="changePin">
      <div class="space-y-6 sm:px-6 lg:px-0 lg:col-span-9">
        <section>
          <div class="shadow bg-white sm:overflow-hidden">
            <nav
              class="mt-4 flex px-5"
              aria-label="Breadcrumb"
            >
              <ol
                role="list"
                class="flex items-center space-x-4"
              >
                <li>
                  <div class="flex items-center">
                    <router-link
                      :to="`/users/${route.params.id}`"
                      class="text-base font-semibold leading-7 text-gray-900 sm:leading-9 sm:truncate"
                      style="color: #9e9e9e"
                      >User Profile</router-link
                    >
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
                      Change Pin
                    </h1>
                  </div>
                </li>
              </ol>
            </nav>
            <div class="py-6 px-4 sm:p-6">
              <div>
                <h3 class="text-lg leading-6 font-medium text-gray-900">
                  Change pin
                </h3>
                <p class="mt-1 max-w-2xl text-sm text-gray-500">
                  Provide a new pin for
                  <span class="font-bold">
                    {{ userData.firstName }} {{ userData.lastName }}</span
                  >
                </p>
              </div>
              <div class="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                <div
                  class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5"
                >
                  <div>
                    <label
                      for="phone"
                      class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                    >
                      USSD Phone number
                    </label>
                  </div>
                  <div class="mt-1 sm:mt-0 sm:col-span-2">
                    <div class="max-w-lg flex rounded-md shadow-sm">
                      <input
                        @input="validatePhone($event)"
                        v-model.lazy="form.ussdPhoneNumber"
                        type="text"
                        name="phone"
                        id="phone"
                        class="flex-1 bg-gray-50 block w-full focus:ring-blue-500 focus:border-blue-500 min-w-0 rounded-md sm:text-sm border-gray-300"
                        required
                      />
                    </div>
                  </div>
                </div>
                <div
                  class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5"
                >
                  <div>
                    <label
                      for="notificationStatus"
                      class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                    >
                      Notify User On Pin Change
                    </label>
                    <p class="mt-2 text-xs text-gray-500">
                      Default is set to notify.
                    </p>
                  </div>
                  <div class="mt-1 sm:mt-0 sm:col-span-2">
                    <div
                      class="max-w-lg flex items-center rounded-md shadow-sm"
                    >
                      <div class="flex-1 flex items-center h-12">
                        <input
                          @change="setNotificationStatus"
                          type="checkbox"
                          name="notificationStatus"
                          id="notificationStatus"
                          class="flex-none block w-4 focus:ring-blue-500 focus:border-blue-500 min-w-0 rounded-md sm:text-sm border-gray-300"
                          checked
                        />
                        <p class="text-xs text-gray-500 ml-2">Notify User</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5"
                >
                  <div>
                    <label
                      for="pinStatus"
                      class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                    >
                      Pin Status
                    </label>
                    <p class="mt-2 text-xs text-gray-500">Default is SET.</p>
                  </div>
                  <div class="mt-1 sm:mt-0 sm:col-span-2">
                    <div
                      class="max-w-lg flex items-center rounded-md shadow-sm"
                    >
                      <div class="flex-1 flex items-center h-12">
                        <input
                          @change="setPinStatus"
                          type="checkbox"
                          name="pinStatus"
                          id="pinStatus"
                          class="flex-none block w-4 focus:ring-blue-500 focus:border-blue-500 min-w-0 rounded-md sm:text-sm border-gray-300"
                          checked
                        />
                        <p class="text-xs text-gray-500 ml-2">
                          Set as temporary
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5"
                >
                  <div>
                    <label
                      for="pin"
                      class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                    >
                      Pin
                    </label>
                    <p class="mt-2 text-xs text-gray-500">
                      Maximum of 4 numbers
                    </p>
                  </div>
                  <div class="mt-1 sm:mt-0 sm:col-span-2">
                    <div class="max-w-lg flex rounded-md shadow-sm">
                      <input
                        @input="validatePin($event)"
                        v-model.lazy="form.pin"
                        type="password"
                        name="pin"
                        id="pin"
                        pattern="[0-9]{4,4}"
                        class="flex-1 block w-full focus:ring-blue-500 focus:border-blue-500 min-w-0 rounded-md sm:text-sm border-gray-300"
                        required
                      />
                    </div>
                  </div>
                </div>
                <div
                  class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5"
                >
                  <div>
                    <label
                      for="pin-confirmation"
                      class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                    >
                      Pin Confirmation
                    </label>
                    <p class="mt-2 text-xs text-gray-500">
                      Ensure it matches the pin above
                    </p>
                  </div>
                  <div class="mt-1 sm:mt-0 sm:col-span-2">
                    <div class="max-w-lg flex rounded-md shadow-sm">
                      <input
                        @input="validatePin($event)"
                        v-model.lazy="form.pinConfirmation"
                        type="password"
                        name="pin-confirmation"
                        pattern="[0-9]{4,4}"
                        id="pin-confirmation"
                        class="flex-1 block w-full focus:ring-blue-500 focus:border-blue-500 min-w-0 rounded-md sm:text-sm border-gray-300"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <div class="flex pb-20 bg-gray-100">
        <div class="ml-auto pt-5 pb-8 px-4">
          <div class="space-x-3">
            <button
              type="submit"
              class="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-blue-500"
            >
              <svg
                v-if="loading"
                class="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
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
              Save: Pin
            </button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>
