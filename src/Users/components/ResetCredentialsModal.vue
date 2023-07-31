<script setup lang="ts">
import { computed, ref } from "vue";
import {
  ExclamationTriangleIcon,
  CheckCircleIcon,
  DocumentDuplicateIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/vue/24/outline";
import type { User } from "@users/types";
import { useStore } from "vuex";
import { mapActions } from "@/modules/mapStore";
import { useUsers } from "@users/composables/useUsers";

const { pinChange, defineNotification } = mapActions();
const { resetWebPassword } = useUsers();

const props = defineProps<{
  open: boolean;
  action: "USSD" | "WEB";
  user: User;
}>();
const emit = defineEmits(["close"]);
const store = useStore();
const resetSuccessful = ref(false);
const loading = ref(false);
const password = ref<string | null>(null);
const formattedPassword = ref<string | null>(null);
const passwordType = ref<"password" | "text">("password");
const showEmailCopied = ref(false);
const showPasswordCopied = ref(false);
const showNameCopied = ref(false);

const message = computed(() => {
  if (props.action === "USSD") {
    return ` Are you sure you want to reset USSD pin for <strong>${props.user.firstName} ${props.user.lastName}</strong> - <strong>${props.user.ussdPhoneNumber}</strong> ?`;
  } else if (props.action === "WEB") {
    return `Are you sure you want to reset web password for <strong>${props.user.firstName} ${props.user.lastName}</strong> - <strong>${props.user.email}</strong> ?`;
  }
  return "";
});

const tenantId = computed(() =>
  store.state.user ? store.state.user.tenantId : null
);

function closeModal() {
  emit("close");
}

async function resetWebPass() {
  const payload = {
    username: props.user.username,
    userRefId: props.user.keycloakId,
    tenantId: tenantId.value,
  };

  await resetWebPassword(payload).then(response => {
    if (response) {
      password.value = response.temporaryPassword;
      formatPassword("password");
      loading.value = false;
      resetSuccessful.value = true;
    } else {
      loading.value = false;
    }
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
    } else {
      loading.value = false;
      await defineNotification({
        message: "Something went wrong",
        error: true,
      });
    }
  } catch (e: any) {
    console.log(e);
    loading.value = false;
    await defineNotification({ message: e.messages, error: true });
  }
}

async function copyToClipboard(type: "EMAIL" | "NAME" | "PASSWORD") {
  if (type === "EMAIL") {
    await navigator.clipboard
      .writeText(props.user.email)
      .then(() => {
        showEmailCopied.value = true;
        setTimeout(() => (showEmailCopied.value = false), 2000);
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
        showNameCopied.value = true;
        setTimeout(() => (showNameCopied.value = false), 2000);
      })
      .catch(() => {
        defineNotification({ message: "Could not copy", error: true });
      });
  }
  if (type === "PASSWORD" && password.value) {
    await navigator.clipboard
      .writeText(password.value)
      .then(() => {
        showPasswordCopied.value = true;
        setTimeout(() => (showPasswordCopied.value = false), 2000);
      })
      .catch(() => {
        defineNotification({ message: "Could not copy", error: true });
      });
  }
}

async function reset() {
  if (props.action === "USSD") {
    loading.value = true;
    await resetUSSDPin();
  } else if (props.action === "WEB") {
    loading.value = true;
    await resetWebPass();
  }
}

function formatPassword(value: "password" | "text") {
  if (password.value) {
    passwordType.value = value;
    if (value === "password") {
      formattedPassword.value = "*".repeat(password.value.length);
    } else {
      formattedPassword.value = password.value;
    }
  }
}

const isOpen = ref(props.open);
</script>

<template>
  <v-overlay
    v-model="isOpen"
    :contained="true"
    class="pt-16 align-start justify-center"
    scroll-strategy="block"
  >
    <v-card>
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
            <h3 class="text-base font-bold leading-6 text-gray-900">
              Successfully reset
              {{ action === "USSD" ? "USSD Pin" : "Web Password" }}
            </h3>
            <div class="mt-2">
              <p
                v-if="action === 'USSD'"
                class="text-sm text-gray-500"
              >
                Please note that the next time they access the USSD service,
                they will be prompted to set a new pin.
              </p>
              <p
                v-else
                class="text-gray-500 text-sm"
              >
                A password reset email has been sent to
                <strong>{{ user.email }}</strong
                >. <br />
                Once they click on the email or access the web service, they
                will be prompted to set a new password.
              </p>
            </div>
          </div>
          <div
            v-else
            class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left"
          >
            <h3 class="text-base font-semibold leading-6 text-gray-900">
              {{ action === "USSD" ? "Reset USSD Pin" : "Reset Web Password" }}
            </h3>
            <div class="mt-2">
              <p
                class="text-gray-500 leading-7 text-sm"
                v-html="message"
              />
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="resetSuccessful"
        class="my-2 px-4 text-sm space-y-4"
      >
        <div class="space-y-1">
          <div class="flex space-x-4">
            <p class="text-gray-600">Name</p>
            <div
              v-if="showNameCopied"
              class="z-10 bg-green-200 text-green-700 px-1.5 rounded border"
            >
              Copied
            </div>
          </div>
          <div class="ml-1 flex space-x-2">
            <DocumentDuplicateIcon
              class="h-5 w-5 hover:cursor-pointer"
              @click.prevent="copyToClipboard('NAME')"
            />
            <p>{{ user.firstName + " " + user.lastName }}</p>
          </div>
        </div>
        <div class="space-y-1">
          <div class="flex space-x-4">
            <p class="text-gray-600">
              {{ action === "USSD" ? "Phone number" : "Email" }}
            </p>
            <div
              v-if="showEmailCopied"
              class="z-10 bg-green-200 text-green-700 px-1.5 rounded border"
            >
              Copied
            </div>
          </div>
          <div class="ml-1 flex space-x-2">
            <DocumentDuplicateIcon
              class="h-5 w-5 hover:cursor-pointer"
              @click.prevent="copyToClipboard('EMAIL')"
            />
            <p>
              {{ action === "USSD" ? user.ussdPhoneNumber : user.email }}
            </p>
          </div>
        </div>
        <div
          v-if="action === 'WEB'"
          class="space-y-1"
        >
          <div class="flex space-x-4">
            <p class="text-gray-600">Temporary Password</p>
            <div
              v-if="showPasswordCopied"
              class="z-10 bg-green-200 text-green-700 px-1.5 rounded border"
            >
              Copied
            </div>
          </div>
          <div
            v-if="password"
            class="ml-1 flex space-x-4"
          >
            <DocumentDuplicateIcon
              class="h-5 w-5 hover:cursor-pointer"
              @click.prevent="copyToClipboard('PASSWORD')"
            />
            <p>{{ formattedPassword }}</p>
            <EyeIcon
              v-if="passwordType === 'password'"
              class="h-5 w-5 hover:cursor-pointer"
              @click.prevent="formatPassword('text')"
            />
            <EyeSlashIcon
              v-else
              class="h-5 w-5 hover:cursor-pointer"
              @click.prevent="formatPassword('password')"
            />
          </div>
        </div>
      </div>
      <template #actions>
        <v-row class="justify-end px-8">
          <v-btn
            variant="outlined"
            color="secondary"
            type="button"
            class="text-none"
            @click="closeModal"
          >
            Close
          </v-btn>

          <v-btn
            v-if="!resetSuccessful"
            :loading="loading"
            variant="flat"
            color="error"
            type="button"
            class="text-none"
            @click.prevent="reset"
          >
            <span :class="{ invisible: loading }"> Reset</span>
          </v-btn>
        </v-row>
      </template>
    </v-card>
  </v-overlay>
</template>
