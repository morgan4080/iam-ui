<script setup lang="ts">
import { useRouter } from "vue-router";
import { computed, onMounted, reactive, ref, watch } from "vue";
import { useUsers } from "@/Users/composables/useUsers";
import { QrInterface, EditUserPayload } from "@/Users/types";
import CustomCard from "@/components/common/CustomCard.vue";
import FixedHeader from "@/components/common/FixedHeader.vue";
import MobileCredentialsForm from "@/components/forms/MobileCredentialsForm.vue";
import WebCredentialsForm from "@/components/forms/WebCredentialsForm.vue";
import PersonalDetailsForm from "@/components/forms/PersonalDetailsForm.vue";
import AddRemoveRoles from "@/components/forms/AddRemoveRoles.vue";
import ResetCredentialsDropDown from "@/components/ButtonDropDown.vue";
import ResetCredentialsModal from "@users/components/ResetCredentialsModal.vue";
import { useAuthStore } from "@/store/auth-store";

const validateForms = ref(false);

const authStore = useAuthStore();

const kopeshaURL = ref(import.meta.env.VITE_KOPESHA_URL);

const { user, isLoading, fetchUser, verifyUnique, editUser, syncUser } =
  useUsers();

const props = defineProps<{
  refId: string;
}>();

const router = useRouter();

const query = ref("?");

const isError = ref(true);

const setError = (err: boolean) => {
  isError.value = err;
};

const form = reactive({
  username: "",
  firstName: "",
  lastName: "",
  emailAddress: "",
  phoneNumber: "",
  ussdPhoneNumber: "",
  isEnabled: false,
});

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

async function setQuery(obj: { value: string; context: string }) {
  const { value, context } = obj;
  if (context === "email") {
    qrObject.phoneNumber = "";
    qrObject.email = value;
    qrObject.username = "";
  }
  if (context === "phone-number") {
    qrObject.phoneNumber = value;
    qrObject.email = "";
    qrObject.username = "";
  }
  if (context === "username") {
    qrObject.phoneNumber = "";
    qrObject.email = "";
    qrObject.username = value;
  }

  const response = await byIdentifier();

  if (!response) {
    for (const [key, value] of Object.entries(qrObject)) {
      if (value) {
        authStore.addAlerts("warning", `User with that ${key} already exists`);
      }
    }
  }
}

const edit = async () => {
  if (!user.value) return;
  console.log(form, isError.value);
  if (!isError.value) {
    const payload: EditUserPayload = {
      userRefId: user.value.id,
      userName: form.username,
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.emailAddress,
      phoneNumber: form.phoneNumber,
      ussdPhoneNumber: form.ussdPhoneNumber,
      isEnabled: form.isEnabled,
    };

    for (const [key, value] of Object.entries(payload)) {
      if (!value || value == "") {
        authStore.addAlerts("warning", `Check form for errors on field ${key}`);
        return;
      }
    }

    await editUser(payload)
      .then(async response => {
        if (response) {
          // await router.push(`/users/${props.refId}/view`);
          authStore.addAlerts("success", "User Edited successfully");
        }
      })
      .catch((error: string) => {
        authStore.addAlerts("error", error);
      });
  } else {
    authStore.addAlerts("warning", `Data is Unchanged`);
  }
};

const tab = ref(null);

const tabs = ref(["User Details"]);

const resetCredentialsGroup = computed(() => {
  if (!user.value?.isUSSDDisabled) {
    return [
      {
        name: "Reset USSD Pin",
        value: "reset-pin",
      },
      {
        name: "Reset Web Password",
        value: "reset-password",
      },
    ];
  } else {
    return [
      {
        name: "Reset Web Password",
        value: "reset-password",
      },
    ];
  }
});

const resetCredentials = async (group: { name: string; value: string }) => {
  switch (group.value) {
    case "reset-pin":
      resetCredentialsAction.value = "USSD";
      openResetCredentialsModal();
      break;
    case "reset-password":
      resetCredentialsAction.value = "WEB";
      openResetCredentialsModal();
      break;
  }
  console.log(group);
};

const accountStatusGroup = computed(() => {
  return [
    {
      name: "Enabled",
      value: "enable",
    },
    {
      name: "Disabled",
      value: "disable",
    },
  ];
});

const accountStatus = ref<"Enabled" | "Disabled">("Disabled");
const accessType = ref<"Web & Mobile" | "Web">("Web");

watch(user, () => {
  accountStatus.value =
    user && user.value && user.value.isEnabled ? "Enabled" : "Disabled";
  accessType.value =
    user && user.value && !user.value.isUSSDDisabled ? "Web & Mobile" : "Web";

  if (user && user.value) {
    form.firstName = user.value.firstName ? user.value.firstName : "";
    form.lastName = user.value.lastName ? user.value.lastName : "";
    form.emailAddress = user.value.email ? user.value.email : "";
    form.username = user.value.username ? user.value.username : "";
    form.phoneNumber = user.value.phoneNumber ? user.value.phoneNumber : "";
    form.ussdPhoneNumber = user.value.ussdPhoneNumber
      ? user.value.ussdPhoneNumber
      : "";
    form.isEnabled =
      user.value.isEnabled !== undefined ? user.value.isEnabled : false;
  }
});

const roleGroups = computed(() => {
  return [];
});

const selectedGroup = ref(null);

const openKopesha = () => {
  window.open(`${kopeshaURL.value}#/customers/customer_listing`, "_blank");
};

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

watch(accountStatus, newStatus => {
  form.isEnabled = newStatus == "Enabled";
});

const setWebCredentials = (obj: { email: string; username: string }) => {
  const { email, username } = obj;
  if (username !== "") form.username = username;
  if (email !== "") form.emailAddress = email;
};

const setPersonalDetails = (obj: {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
}) => {
  const { firstName, lastName, phoneNumber, email } = obj;
  if (firstName !== "") form.firstName = firstName;
  if (lastName !== "") form.lastName = lastName;
  if (phoneNumber !== "") form.phoneNumber = phoneNumber;
  if (email !== "") form.emailAddress = email;
};

onMounted(async () => {
  await fetchUser(props.refId);
});

const submitUser = () => {
  validateForms.value = !validateForms.value;
  if (!isError.value) {
    console.log("submit user", form);
  }
};
</script>

<template>
  <FixedHeader
    :title="user ? user.firstName + ' ' + user.lastName : 'Create User'"
    :sub-title="
      user ? 'Keycloak ID: ' : 'Fill the details below to create a new user.'
    "
    :highlighted="user ? user.keycloakId : ''"
  >
    <template #refreshContent>
      <v-btn
        v-if="user"
        variant="outlined"
        density="compact"
        color="none"
        :loading="isLoading"
        class="text-none text-caption mx-2 ml-md-8"
        style="border-color: #e4e4e4 !important"
        @click="syncUser"
      >
        Refresh
      </v-btn>
    </template>
    <template #buttons>
      <v-btn
        variant="outlined"
        color="none"
        class="text-none text-caption mx-2"
        @click="$router.back()"
      >
        Go Back
      </v-btn>
      <ResetCredentialsDropDown
        v-if="user"
        default-text="Reset Credentials"
        extra-classes="mx-1"
        :groups="resetCredentialsGroup"
        @selected="resetCredentials"
      />
      <v-btn
        variant="flat"
        color="primary"
        class="text-none text-caption mx-2"
        type="button"
        @click="submitUser"
      >
        Save User
      </v-btn>
    </template>
    <template #tabs>
      <v-tabs
        v-model="tab"
        color="primary"
        align-tabs="start"
        density="comfortable"
        class="text-none px-3 -mb-1"
      >
        <v-tab
          v-for="(t, ind) in tabs"
          :key="ind"
          :value="t"
          class="text-none text-caption"
          >{{ t }}</v-tab
        >
      </v-tabs>
    </template>
  </FixedHeader>
  <v-window v-model="tab">
    <v-window-item
      v-for="n in tabs"
      :key="n"
      :value="n"
    >
      <v-container
        v-if="n == tabs[0]"
        :fluid="true"
      >
        <v-row no-gutters>
          <v-col
            cols="12"
            md="3"
            sm="12"
          >
            <CustomCard
              title=""
              sub-title="Assign Role"
              sub-title-classes="text-base"
            >
              <template #information>
                <v-icon
                  icon="mdi-information-outline"
                  color="primary"
                  size="small"
                  class="opacity-50 ml-1"
                />
              </template>
              <AddRemoveRoles
                :key="JSON.stringify(user)"
                :user="user"
                :active="true"
              />
            </CustomCard>
          </v-col>

          <v-col
            cols="12"
            md="3"
            sm="12"
          >
            <CustomCard
              title=""
              sub-title="Assign Label"
              sub-title-classes="text-base"
            >
              <template #information>
                <v-icon
                  icon="mdi-information-outline"
                  color="primary"
                  size="small"
                  class="opacity-50 ml-1"
                />
              </template>
              <div>
                <v-autocomplete
                  v-model="selectedGroup"
                  :items="roleGroups"
                  item-title="name"
                  item-value="id"
                  variant="outlined"
                  :density="'compact'"
                  :hide-details="true"
                  :flat="true"
                  bg-color="#F2F2F223"
                />
              </div>
            </CustomCard>
          </v-col>

          <v-col
            cols="12"
            md="3"
            sm="12"
          >
            <CustomCard
              title=""
              sub-title="Access"
              sub-title-classes="text-base"
            >
              <template #information>
                <v-icon
                  icon="mdi-information-outline"
                  color="primary"
                  size="small"
                  class="opacity-50 ml-1"
                />
              </template>
              <div>
                <v-text-field
                  v-model="accessType"
                  variant="outlined"
                  density="compact"
                  :hide-details="true"
                  :disabled="true"
                />
              </div>
            </CustomCard>
          </v-col>

          <v-col
            cols="12"
            md="3"
            sm="12"
          >
            <CustomCard
              title=""
              sub-title="Status"
              sub-title-classes="text-base"
            >
              <template #information>
                <v-icon
                  icon="mdi-information-outline"
                  color="primary"
                  size="small"
                  class="opacity-50 ml-1"
                />
              </template>
              <div>
                <v-select
                  v-model="accountStatus"
                  :items="accountStatusGroup"
                  item-title="name"
                  variant="outlined"
                  :density="'compact'"
                  :hide-details="true"
                  :flat="true"
                  bg-color="#F2F2F223"
                />
              </div>
            </CustomCard>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col
            cols="12"
            md="6"
            sm="12"
          >
            <CustomCard
              title="Personal Details"
              sub-title="Edit Your Personal Details"
              :require-space="true"
            >
              <PersonalDetailsForm
                v-if="user"
                :key="`${validateForms}`"
                :first-name="form.firstName"
                :last-name="form.lastName"
                :phone-number="form.phoneNumber"
                :email-address="form.emailAddress"
                @set-query="setQuery"
                @updated="setPersonalDetails"
                @is-error="setError"
              />
            </CustomCard>
          </v-col>

          <v-col
            cols="12"
            md="6"
            sm="12"
          >
            <v-col v-if="user && !user.isUSSDDisabled">
              <v-card
                color="surface"
                variant="flat"
              >
                <v-col>
                  <v-col>
                    <div class="flex flex-wrap items-center justify-between">
                      <div class="pb-3">
                        <h3 class="font-weight-regular">Mobile Credentials</h3>
                        <h5
                          class="text-grey-darken-1 text-caption font-weight-regular"
                        >
                          Edit Your Mobile Credentials
                        </h5>
                      </div>

                      <v-btn
                        variant="tonal"
                        size="x-small"
                        color="primary"
                        @click="openKopesha"
                      >
                        EDIT
                      </v-btn>
                    </div>
                    <MobileCredentialsForm :user="user" />
                  </v-col>
                </v-col>
              </v-card>
            </v-col>
            <v-col>
              <v-card
                color="surface"
                variant="flat"
              >
                <v-col>
                  <v-col>
                    <div class="flex flex-wrap items-center justify-between">
                      <div class="pb-3">
                        <h3 class="font-weight-regular">Web Credentials</h3>
                        <h5
                          class="text-grey-darken-1 text-caption font-weight-regular"
                        >
                          Edit Your Web Credentials
                        </h5>
                      </div>
                    </div>

                    <WebCredentialsForm
                      v-if="user"
                      :key="`${validateForms}`"
                      :username="form.username"
                      :email-address="form.emailAddress"
                      @set-query="setQuery"
                      @updated="setWebCredentials"
                      @is-error="setError"
                    />
                  </v-col>
                </v-col>
              </v-card>
            </v-col>
          </v-col>
        </v-row>
      </v-container>
    </v-window-item>
  </v-window>

  <ResetCredentialsModal
    v-if="resetCredentialsAction && user"
    :open="resetCredentialModalOpen"
    :action="resetCredentialsAction"
    :user="user"
    @close="closeResetCredentialsModal"
  />
</template>
