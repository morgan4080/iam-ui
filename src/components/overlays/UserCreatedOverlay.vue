<script setup lang="ts">
import {
  DocumentDuplicateIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/vue/24/outline";
import { ref, toRef, watch } from "vue";
import { useBreakpoints } from "@vueuse/core";
import { useAuthStore } from "@/store/auth-store";
import CustomCard from "@/components/common/CustomCard.vue";
const authStore = useAuthStore();
const emit = defineEmits(["close"]);
const props = defineProps<{
  open: boolean;
  firstName: string;
  lastName: string;
  username: string;
  temporaryPassword: string;
}>();
const isOpen = toRef(props, "open");
const firstName = toRef(props, "firstName");
const lastName = toRef(props, "lastName");
const username = toRef(props, "username");
const temporaryPassword = toRef(props, "temporaryPassword");
const showEmailCopied = ref(false);
const showPasswordCopied = ref(false);
const showNameCopied = ref(false);
const formattedPassword = ref<string | null>(null);
const passwordType = ref<"password" | "text">("password");
const breakpoints = useBreakpoints({
  mobile: 320,
  tablet: 600,
  laptop: 960,
  desktop: 1280,
  large_desktop: 1920,
  extra_large_desktop: 2560,
});

const mobile = breakpoints.between("mobile", "tablet");
function closeModal() {
  emit("close");
}

const copyToClipboard = async (type: "USERNAME" | "NAME" | "PASSWORD") => {
  try {
    if (type === "USERNAME") {
      await navigator.clipboard
        .writeText(username.value)
        .then(() => {
          showEmailCopied.value = true;
          setTimeout(() => (showEmailCopied.value = false), 2000);
        })
        .catch(() => {
          authStore.addAlerts("error", "Could not copy");
        });
    }
    if (type === "NAME") {
      const name = firstName.value + " " + lastName.value;
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
    if (type === "PASSWORD" && temporaryPassword.value) {
      await navigator.clipboard
        .writeText(temporaryPassword.value)
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
    authStore.addAlerts(
      "error",
      "Could not copy, clipboard only works in a secure context"
    );
  }
};

function formatPassword(value: "password" | "text") {
  if (temporaryPassword.value) {
    passwordType.value = value;
    if (value === "password") {
      formattedPassword.value = "*".repeat(temporaryPassword.value.length);
    } else {
      formattedPassword.value = temporaryPassword.value;
    }
  }
}

watch(isOpen, () => {
  formatPassword("password");
});
</script>

<template>
  <v-overlay
    v-model="isOpen"
    :contained="true"
    class="pt-16 align-start justify-center"
    scroll-strategy="block"
    :width="mobile ? '95%' : '35%'"
  >
    <CustomCard
      title="Successfully Created Web User"
      sub-title=""
    >
      <div>
        <div class="pb-4 flex">
          <p>
            {{
              `A temporary password has been sent to
                (${username})
                Once they click on the email or access the web service, they
                will be prompted to set a new password.`
            }}
          </p>
        </div>
        <div>
          <div class="space-y-1 pb-2">
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
              <p>{{ firstName + " " + lastName }}</p>
            </div>
          </div>
          <div class="space-y-1 pb-2">
            <div class="flex space-x-4">
              <p class="text-gray-600">
                {{ "Username" }}
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
                @click.prevent="copyToClipboard('USERNAME')"
              />
              <p>
                {{ username }}
              </p>
            </div>
          </div>
          <div class="space-y-1 pb-2">
            <div class="flex space-x-4">
              <p class="text-gray-600">Temporary Password</p>
              <div
                v-if="showPasswordCopied"
                class="z-10 bg-green-200 text-green-700 px-1.5 rounded border"
              >
                Copied
              </div>
            </div>
            <div class="ml-1 flex space-x-4">
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
      </div>
      <v-card-actions class="justify-center pt-6 -mx-3 -mb-2">
        <v-btn
          variant="elevated"
          class="bg-green-lighten-1 w-100"
          @click="closeModal"
          >CLOSE</v-btn
        >
      </v-card-actions>
    </CustomCard>
  </v-overlay>
</template>
