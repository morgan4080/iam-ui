<script setup lang="ts">
import { useRouter } from "vue-router";
import { computed, onMounted, reactive, ref, watch } from "vue";
import { useStore } from "vuex";
import { useUsers } from "@/Users/composables/useUsers";
import { QrInterface, EditUserPayload } from "@/Users/types";
import { mapActions } from "@/modules/mapStore";
import CustomCard from "@/components/common/CustomCard.vue";
import ButtonDropDown from "@/components/ButtonDropDown.vue";
import FixedHeader from "@/components/common/FixedHeader.vue";
import MobileCredentialsForm from "@/components/forms/MobileCredentialsForm.vue";
import WebCredentialsForm from "@/components/forms/WebCredentialsForm.vue";
import PersonalDetailsForm from "@/components/forms/PersonalDetailsForm.vue";

const kopeshaURL = ref(import.meta.env.VITE_KOPESHA_URL);

const props = defineProps<{
  refId: string;
}>();
const { defineNotification } = mapActions();
const router = useRouter();
const store = useStore();
const { user, isLoading, fetchUser, verifyUnique, editUser, syncUser } =
  useUsers();

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
    const response0 = await verifyUnique(
      `?ussdPhoneNumber=${form.ussdPhoneNumber}`
    );
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

onMounted(async () => {
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

const accountStatus = ref("Disabled");
const accessType = ref("Web");

watch(user, () => {
  accountStatus.value =
    user && user.value && user.value.isEnabled ? "Enabled" : "Disabled";
  accessType.value =
    user && user.value && !user.value.isUSSDDisabled ? "Web & Mobile" : "Web";
});

const roleGroups = computed(() => {
  return [
    {
      id: 1,
      name: "x Group",
    },
  ];
});

const selectedGroup = ref(roleGroups.value[0]);

const rolesComputed = computed(() => {
  return [
    {
      id: 1,
      name: "Role X",
    },
  ];
});

const selectedRole = ref(rolesComputed.value[0]);

const openKopesha = () => {
  window.open(`${kopeshaURL.value}#/customers/customer_listing`, "_blank");
};
</script>

<template>
  <FixedHeader
    :title="user ? user.firstName + ' ' + user.lastName : ''"
    :sub-title="'Keycloak ID: '"
    :highlighted="user ? user.keycloakId : ''"
  >
    <template #refreshContent>
      <v-btn
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
      <ButtonDropDown
        default-text="Reset Credentials"
        :groups="resetCredentialsGroup"
        @selected="resetCredentials"
      />
      <v-btn
        variant="flat"
        color="primary"
        class="text-none text-caption mx-2"
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
              <v-autocomplete
                v-model="selectedRole"
                :items="rolesComputed"
                item-title="name"
                variant="outlined"
                :density="'compact'"
                :hide-details="true"
                :flat="true"
                bg-color="#F2F2F223"
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
              sub-title="Assign Group"
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
                :loading="false"
                :user="user"
              />
            </CustomCard>
          </v-col>

          <v-col
            cols="12"
            md="6"
            sm="12"
          >
            <v-col>
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
                    <MobileCredentialsForm v-if="user && !user.isUSSDDisabled" :user="user" />
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

                    <WebCredentialsForm v-if="user" :user="user" />
                  </v-col>
                </v-col>
              </v-card>
            </v-col>
          </v-col>
        </v-row>
      </v-container>
    </v-window-item>
  </v-window>
</template>
