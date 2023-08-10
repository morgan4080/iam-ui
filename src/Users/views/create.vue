<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue";
import { useUsers } from "@/Users/composables/useUsers";
import { QrInterface } from "@/Users/types";
import CustomCard from "@/components/common/CustomCard.vue";
import FixedHeader from "@/components/common/FixedHeader.vue";
import WebCredentialsForm from "@/components/forms/WebCredentialsForm.vue";
import PersonalDetailsForm from "@/components/forms/PersonalDetailsForm.vue";
import AddRemoveRoles from "@/components/forms/AddRemoveRoles.vue";
import { useAuthStore } from "@/store/auth-store";

const authStore = useAuthStore();

const { verifyUnique } = useUsers();

const query = ref("?");

const isError = ref(true);

const validateForms = ref(false);

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

const tab = ref(null);

const tabs = ref(["User Details"]);

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

const roleGroups = computed(() => {
  return [];
});

const selectedGroup = ref(null);

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

const submitUser = () => {
  validateForms.value = !validateForms.value;
  if (!isError.value) {
    console.log("submit user", form);
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
                :key="validateForms"
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
                      :key="validateForms"
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
</template>
