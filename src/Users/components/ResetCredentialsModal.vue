<script setup lang="ts">
import { computed, ref } from "vue";
import {
  CheckCircleIcon,
  DocumentDuplicateIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/vue/24/outline";
import type { User } from "@users/types";
import { useUsers } from "@users/composables/useUsers";
import { useBreakpoints } from "@vueuse/core";
import { useAuthStore } from "@/store/auth-store";
const { resetWebPassword } = useUsers();
const authStore = useAuthStore();

const props = defineProps<{
  open: boolean;
  action: "USSD" | "WEB";
  user: User;
}>();
const emit = defineEmits(["close"]);
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

const tenantId = computed(() => authStore.getLoggedInUser?.tenantId);

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

function pinChange(payload: any) {
  const url = `${
    import.meta.env.VITE_APP_ROOT_AUTH
  }/users-admin/api/v1/auth/ussd/pin?notifyUser=${payload.notifyUser}`;
  delete payload.notifyUser;
  return fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .catch(error => {
      throw new Error(error);
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
      authStore.addAlerts("error", "Something went wrong");
    }
  } catch (e: any) {
    loading.value = false;
    authStore.addAlerts("error", e.messages);
  }
}

async function copyToClipboard(type: "EMAIL" | "NAME" | "PASSWORD") {
  try {
    if (type === "EMAIL") {
      await navigator.clipboard
        .writeText(props.user.email)
        .then(() => {
          showEmailCopied.value = true;
          setTimeout(() => (showEmailCopied.value = false), 2000);
        })
        .catch(() => {
          authStore.addAlerts("error", "Could not copy");
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
          authStore.addAlerts("error", "Could not copy");
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
          authStore.addAlerts("error", "Could not copy");
        });
    }
  } catch (e) {
    console.log(e);
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

const breakpoints = useBreakpoints({
  mobile: 320,
  tablet: 600,
  laptop: 960,
  desktop: 1280,
  large_desktop: 1920,
  extra_large_desktop: 2560,
});

const mobile = breakpoints.between("mobile", "tablet");
</script>

<template>
  <v-overlay
    v-model="isOpen"
    :contained="true"
    class="pt-16 align-start justify-center"
    scroll-strategy="block"
    :width="mobile ? '95%' : '25%'"
  >
    <v-card
      v-if="resetSuccessful"
      :title="`Successfully reset
              ${action === 'USSD' ? 'USSD Pin' : 'Web Password'}`"
    >
      <template #prepend>
        <div
          class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10"
        >
          <CheckCircleIcon
            class="h-6 w-6 text-green-600"
            aria-hidden="true"
          />
        </div>
      </template>
      <template #text>
        <div class="pb-4">
          <p class="">
            {{
              action === "USSD"
                ? "Please note that the next time they access the USSD service,\n" +
                  "                they will be prompted to set a new pin."
                : `A password reset email has been sent to
                (${user.email})
                Once they click on the email or access the web service, they
                will be prompted to set a new password.`
            }}
          </p>
        </div>
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
      </template>
      <v-card-actions class="px-4">
        <v-btn
          variant="outlined"
          color="secondary"
          type="button"
          class="text-none"
          @click="closeModal"
        >
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-card
      v-else
      :title="action === 'USSD' ? 'Reset USSD Pin' : 'Reset Web Password'"
      prepend-icon="mdi-alert-circle"
    >
      <template #text>
        <div v-html="message" />
      </template>
      <v-card-actions class="px-4">
        <v-btn
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
          color="error"
          type="button"
          class="text-none"
          @click.prevent="reset"
        >
          <span :class="{ invisible: loading }"> Reset</span>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-overlay>
</template>
