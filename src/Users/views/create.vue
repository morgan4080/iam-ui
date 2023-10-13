<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from "vue";
import { useUsers } from "@/Users/composables/useUsers";
import { QrInterface } from "@/Users/types";
import CustomCard from "@/components/common/CustomCard.vue";
import FixedHeader from "@/components/common/FixedHeader.vue";
import WebCredentialsForm from "@/components/forms/WebCredentialsForm.vue";
import PersonalDetailsForm from "@/components/forms/PersonalDetailsForm.vue";
import AddRemoveRoles from "@/components/forms/AddRemoveRoles.vue";
import { useAuthStore } from "@/store/auth-store";
import { useRoles } from "@roles/composables/useRoles";
import { storeToRefs } from "pinia";
import UserCreatedOverlay from "@/components/overlays/UserCreatedOverlay.vue";
import MobileCredentialsForm from "@/components/forms/MobileCredentialsForm.vue";
const { getLabels, assign } = useRoles();
const { labels } = storeToRefs(useRoles());

const authStore = useAuthStore();

const { verifyUnique, createUser } = useUsers();

const query = ref("?");

const isError = ref(true);

const validateForms = ref(false);

const selectedRoles = ref<string[]>([]);

const setError = (err: boolean) => {
  isError.value = err;
};

onMounted(() => {
  getLabels();
});

const form = reactive({
  username: "",
  password: "",
  firstName: "",
  lastName: "",
  emailAddress: "",
  phoneNumber: "",
  ussdPhoneNumber: "",
  isEnabled: true,
});

const temporaryPassword = ref("");
const refId = ref("");
const isCreated = ref(false);

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

const tab = ref(null);

const tabs = ref(["User Details"]);

const accountStatusGroup = computed(() => {
  return [
    {
      name: "Enabled",
      value: true,
    },
    {
      name: "Disabled",
      value: false,
    },
  ];
});

const accessType = ref<string[]>([]);
watch(accessType, () => {
  isError.value = accessType.value.length <= 0;
});
const accessTypes = ref<
  {
    name: string;
  }[]
>([
  {
    name: "WEB",
  },
  {
    name: "USSD",
  },
]);

const selectedGroup = ref("");

const setWebCredentials = (obj: { password: string; username: string }) => {
  const { password, username } = obj;
  if (username !== "") form.username = username;
  if (password !== "") form.password = password;
};

const setMobileCredentials = (obj: { phoneNumber: string }) => {
  const { phoneNumber } = obj;
  if (phoneNumber !== "") form.phoneNumber = phoneNumber;
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

const submitUser = async () => {
  validateForms.value = !validateForms.value;
  if (!isError.value) {
    const payload = {
      firstName: form.firstName,
      lastName: form.lastName,
      groupLabel: selectedGroup.value,
      contact: {
        email: form.emailAddress !== "" ? form.emailAddress : null,
        phone: form.phoneNumber !== "" ? form.phoneNumber : null,
      },
      webCredentials: {
        username: form.username,
        password: form.password,
      },
      enabled: form.isEnabled,
      userTypes: accessType.value,
    };

    if (selectedGroup.value == "") {
      Reflect.deleteProperty(payload, "userLabel");
    }

    if (form.password == "") {
      Reflect.deleteProperty(payload.webCredentials, "password");
    }

    try {
      console.log(payload);

      const response = await createUser(payload);

      console.log("response", response);

      temporaryPassword.value = response.data.temporaryPassword;

      refId.value = response.data.id;

      isCreated.value = true;

      if (selectedRoles.value.length > 0) {
        await assign({
          userRefId: response.data.id,
          payload: {
            roleIds: selectedRoles.value,
          },
        });
      }
    } catch (e) {
      console.log(e);
    }
  }
};
</script>

<template>
  <FixedHeader
    :title="'Create User'"
    :sub-title="'Fill the details below to create a new user.'"
    :highlighted="''"
  >
    <template #buttons>
      <v-btn
        variant="outlined"
        color="none"
        class="text-none text-caption mx-2"
        @click="$router.back()"
      >
        Go Back
      </v-btn>
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
                :user="null"
                :active="true"
                @assign-roles="selectedRoles = $event"
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
                  :items="labels"
                  item-title="name"
                  item-value="value"
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
                <v-autocomplete
                  v-model="accessType"
                  :items="accessTypes"
                  item-title="name"
                  item-value="name"
                  variant="outlined"
                  density="compact"
                  :hide-details="true"
                  :flat="true"
                  :multiple="true"
                  :chips="true"
                  bg-color="#F2F2F223"
                  :error="isError"
                >
                </v-autocomplete>
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
                  v-model="form.isEnabled"
                  :items="accountStatusGroup"
                  item-title="name"
                  item-value="value"
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
            <v-col>
              <v-card
                color="surface"
                variant="flat"
                :disabled="!accessType.includes('WEB')"
              >
                <v-col>
                  <v-col>
                    <div class="flex flex-wrap items-center justify-between">
                      <div class="pb-3">
                        <h4 class="font-weight-medium">Web Credentials</h4>
                        <h5
                          class="text-grey-darken-1 text-caption font-weight-regular"
                        >
                          Edit Your Web Credentials
                        </h5>
                      </div>
                    </div>

                    <WebCredentialsForm
                      :key="`${validateForms}`"
                      :username="form.username"
                      :password="form.password"
                      @set-query="setQuery"
                      @updated="setWebCredentials"
                      @is-error="setError"
                    />
                  </v-col>
                </v-col>
              </v-card>
            </v-col>
            <v-col>
              <v-card
                color="surface"
                variant="flat"
                :disabled="!accessType.includes('USSD')"
              >
                <v-col>
                  <v-col>
                    <div class="flex flex-wrap items-center justify-between">
                      <div class="pb-3">
                        <h4 class="font-weight-medium">Mobile Credentials</h4>
                        <h5
                          class="text-grey-darken-1 text-caption font-weight-regular"
                        >
                          Edit Your Mobile Credentials
                        </h5>
                      </div>
                    </div>
                    <MobileCredentialsForm
                      :key="`${validateForms}`"
                      :user="null"
                      @set-query="setQuery"
                      @updated="setMobileCredentials"
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
  <UserCreatedOverlay
    :first-name="form.firstName"
    :last-name="form.lastName"
    :temporary-password="temporaryPassword"
    :open="isCreated"
    :username="form.username"
    @close="
      isCreated = !isCreated;
      $router.push(`/users/${refId}/edit`);
    "
  />
</template>
