<script setup lang="ts">
import { computed, ref } from "vue";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import {
  ExclamationTriangleIcon,
  CheckCircleIcon,
  DocumentDuplicateIcon,
} from "@heroicons/vue/24/outline";
import type { User } from "@/Users/types";
import { useStore } from "vuex";
import { mapActions } from "@/modules/mapStore";

const { passReset, pinChange, defineNotification } = mapActions();

const props = defineProps<{
  open: boolean;
  action: "USSD" | "WEB";
  user: User;
}>();
const emit = defineEmits(["close"]);
const store = useStore();
const resetSuccessful = ref(false);
const loading = ref(false);

const message = computed(() => {
  if (props.action === "USSD") {
    return ` Are you sure you want to reset USSD pin for <strong>${props.user.firstName} ${props.user.lastName}</strong> - <strong>${props.user.ussdPhoneNumber}</strong> ?`;
  } else if (props.action === "WEB") {
    return `Are you sure you want to reset web password for <strong>${props.user.firstName} ${props.user.lastName}</strong> - <strong>${props.user.email}</strong> ?`;
  }
});

const tenantId = computed(() =>
  store.state.user ? store.state.user.tenantId : null
);

async function resetWebPassword() {
  const payload = {
    username: props.user.username,
    userRefId: props.user.keycloakId,
    tenantId: tenantId.value,
  };

  await passReset(payload)
    .then((response: any) => {
      if (response.messages.some((message: any) => message.type === "SUCCESS")) {
        loading.value = false;
        resetSuccessful.value = true;
      }else {
        loading.value = false;
        defineNotification({ message: "Something went wrong", error: true });
      }
    })
    .catch((error: string) => {
      loading.value = false;
      console.log(error);
      defineNotification({ message: error, error: true });
    });
}

async function resetUSSDPin() {
  try {
    const payload = {
      ussdPhoneNumberOrKeycloakId: props.user.keycloakId,
      pinStatus: "TEMPORARY",
      pin: "0000",
      notifyUser: true,
    };
    const response = await pinChange(payload);
    if (response.messages.some((message: any) => message.type === "SUCCESS")) {
      loading.value = false;
      resetSuccessful.value = true;
    }else {
      loading.value = false;
      await defineNotification({ message: "Something went wrong", error: true });
    }
  } catch (e: any) {
    console.log(e);
    loading.value = false;
    await defineNotification({ message: e.messages, error: true });
  }
}

async function copyToClipboard(type: "EMAIL" | "NAME") {
  if (type === "EMAIL") {
    await navigator.clipboard
      .writeText(props.user.email)
      .then(() => {
        defineNotification({ message: "copied" });
      })
      .catch(() => {
        defineNotification({ message: "Could not copy", error: true });
      });
  }
  if (type === "NAME") {
    const name = props.user.firstName + " " + props.user.lastName;
    await navigator.clipboard
      .writeText(name)
      .then(() => {
        defineNotification({ message: "copied" });
      })
      .catch(() => {
        defineNotification({ message: "Could not copy", error: true });
      });
  }
}

async function reset() {
  if (props.action === "USSD") {
    loading.value = true;
    resetUSSDPin();
  } else if (props.action === "WEB") {
    loading.value = true;
    resetWebPassword();
  }
}
</script>

<template>
  <TransitionRoot
    as="template"
    :show="open"
  >
    <Dialog
      as="div"
      class="relative z-10"
      @close="emit('close')"
    >
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div
          class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        />
      </TransitionChild>

      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div
          class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
        >
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel
              class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all p-2 sm:my-8 sm:w-full sm:max-w-xl"
            >
              <div
                class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 border rounded-sm m-2"
                :class="resetSuccessful ? 'border-green-500' : 'border-red-500'"
              >
                <div class="sm:flex sm:items-start">
                  <div
                    v-if="resetSuccessful"
                    class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10"
                  >
                    <CheckCircleIcon
                      class="h-6 w-6 text-green-600"
                      aria-hidden="true"
                    />
                  </div>
                  <div
                    v-else
                    class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10"
                  >
                    <ExclamationTriangleIcon
                      class="h-6 w-6 text-red-600"
                      aria-hidden="true"
                    />
                  </div>
                  <div
                    v-if="resetSuccessful"
                    class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left"
                  >
                    <DialogTitle
                      as="h3"
                      class="text-base font-noemal leading-6 text-gray-900"
                    >
                      Successfully reset
                      {{ action === "USSD" ? "USSD Pin" : "Web Password" }}
                    </DialogTitle>
                    <div class="mt-2">
                      <p
                        v-if="action === 'USSD'"
                        class="text-sm text-gray-500"
                      >
                        Please note that the next time they access the USSD
                        service, they will be prompted to set a new pin.
                      </p>
                      <p
                        v-else
                        class="text-gray-500 text-sm"
                      >
                        A password reset email has been sent to
                        <strong>{{ user.email }}</strong
                        >. <br />
                        Once they click on the email or access the web service,
                        they will be prompted to set a new password.
                      </p>
                    </div>
                  </div>
                  <div
                    v-else
                    class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left"
                  >
                    <DialogTitle
                      as="h3"
                      class="text-base font-semibold leading-6 text-gray-900"
                    >
                      {{
                        action === "USSD"
                          ? "Reset USSD Pin"
                          : "Reset Web Password"
                      }}
                    </DialogTitle>
                    <div class="mt-2">
                      <p
                        class="text-gray-500 leading-7 text-sm"
                        v-html="message"
                      ></p>
                    </div>
                  </div>
                </div>
              </div>
              <div
                v-if="resetSuccessful"
                class="mt-2 px-4 text-sm space-y-4"
              >
                <div class="space-y-1">
                  <p class="text-gray-600">Name</p>
                  <div class="ml-1 flex space-x-2">
                    <DocumentDuplicateIcon
                      @click.prevent="copyToClipboard('NAME')"
                      class="h-5 w-5 hover:cursor-pointer"
                    />
                    <p>{{ user.firstName + " " + user.lastName }}</p>
                  </div>
                </div>
                <div class="space-y-1">
                  <p class="text-gray-600">
                    {{ action === "USSD" ? "Phone number" : "Email" }}
                  </p>
                  <div class="ml-1 flex space-x-2">
                    <DocumentDuplicateIcon
                      @click.prevent="copyToClipboard('EMAIL')"
                      class="h-5 w-5 hover:cursor-pointer"
                    />
                    <p>
                      {{
                        action === "USSD" ? user.ussdPhoneNumber : user.email
                      }}
                    </p>
                  </div>
                </div>
              </div>
              <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse">
                <button
                  v-if="!resetSuccessful"
                  @click.prevent="reset"
                  type="button"
                  class="inline-flex w-full justify-center relative rounded-md border border-transparent bg-red-600 px-4 py-1.5 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  <svg
                    v-show="loading"
                    class="w-5 h-5 text-white animate-spin absolute left-1/2 -ml-2.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
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
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      fill="currentColor"
                    ></path>
                  </svg>
                  <span :class="{ invisible: loading }"> Reset</span>
                </button>
                <button
                  type="button"
                  class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-1.5 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-0 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  @click="emit('close')"
                >
                  Close
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
