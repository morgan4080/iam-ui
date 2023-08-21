<script setup lang="ts">
import FixedHeader from "@/components/common/FixedHeader.vue";
import { useUsers } from "@users/composables/useUsers";
import { useRoles } from "@roles/composables/useRoles";
import { computed, onMounted, ref } from "vue";
import CustomCard from "@/components/common/CustomCard.vue";
import ResetCredentialsDropDown from "@/components/ButtonDropDown.vue";
import ResetCredentialsModal from "@users/components/ResetCredentialsModal.vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/store/auth-store";
import { storeToRefs } from "pinia";
const { fetchUserRoles } = useRoles();
const { userRoles } = storeToRefs(useRoles());
const { fetchUser, syncUser, enableOrDisableUser } = useUsers();
const { isLoading, user } = storeToRefs(useUsers());
const props = defineProps<{
  refId: string;
}>();
const fetchUserData = async () => {
  await fetchUser(props.refId).then(async data => {
    if (data && user.value?.keycloakId)
      await fetchUserRoles(user.value.keycloakId);
  });
};
onMounted(() => fetchUserData());

const tab = ref(null);
const tabs = ref(["User Details"]);
const userInf = ref([0, 1]);
const accessDetailsInf = ref([0, 1]);

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

const editUserGroup = computed(() => {
  if (user && user.value && user.value.isEnabled)
    return [
      {
        name: "Edit User",
        value: "edit-user",
      },
      {
        name: "Disable User",
        value: "disable-user",
      },
    ];
  else
    return [
      {
        name: "Edit User",
        value: "edit-user",
      },
      {
        name: "Enable User",
        value: "enable-user",
      },
    ];
});

const router = useRouter();

const loading = ref(false);

const authStore = useAuthStore();
const enableUser = async () => {
  if (!user.value) return;
  if (confirm(`You are about to enable user ${user.value.firstName}`)) {
    loading.value = true;
    const payload: { userRefId: string; isEnabled: boolean } = {
      userRefId: props.refId,
      isEnabled: true,
    };
    await enableOrDisableUser(payload)
      .then(async response => {
        if (response) {
          authStore.addAlerts("success", "User Account Enabled");
          await fetchUserData();
        }
      })
      .catch(async e => {
        authStore.addAlerts("error", e.message);
      })
      .finally(() => (loading.value = false));
  }
};

const disableUser = async () => {
  if (!user.value) return;
  if (confirm(`You are about to disable user ${user.value.firstName}`)) {
    loading.value = true;
    const payload: { userRefId: string; isEnabled: boolean } = {
      userRefId: props.refId,
      isEnabled: false,
    };
    await enableOrDisableUser(payload)
      .then(async response => {
        if (response) {
          authStore.addAlerts("success", "User Account Disabled");
          await fetchUserData();
        }
      })
      .catch(e => {
        authStore.addAlerts("error", e.message);
      })
      .finally(() => (loading.value = false));
  }
};

const editIAMUser = (group: { name: string; value: string }) => {
  if (user && user.value) {
    switch (group.value) {
      case "edit-user":
        router.push(`/users/${user.value.id}/edit`);
        break;
      case "disable-user":
        disableUser();
        break;
      case "enable-user":
        enableUser();
        break;
    }
    console.log(group);
  }
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
        v-if="user"
        variant="outlined"
        density="compact"
        color="none"
        :loading="isLoading"
        class="text-none text-caption mx-2 ml-md-8"
        style="border-color: #e4e4e4 !important"
        @click="
          syncUser(user.id);
          fetchUserData();
        "
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
        default-text="Reset Credentials"
        extra-classes="mx-1"
        :groups="resetCredentialsGroup"
        @selected="resetCredentials"
      />
      <ResetCredentialsDropDown
        default-text="Edit User"
        extra-classes="mx-1"
        :groups="editUserGroup"
        @selected="editIAMUser"
      />
    </template>
    <template #tabs>
      <v-tabs
        v-model="tab"
        color="primary"
        align-tabs="start"
        density="compact"
        class="text-none px-3 -mb-1"
      >
        <v-tab
          v-for="(t, ind) in tabs"
          :key="ind"
          :value="t"
          class="text-none text-caption font-weight-regular"
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
            md="4"
            sm="12"
          >
            <CustomCard
              title=""
              sub-title="Assigned Roles"
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
              <v-col>
                <v-row class="px-3">
                  <v-chip
                    v-for="(role, i) in userRoles"
                    :key="i"
                    density="compact"
                    :label="true"
                    variant="outlined"
                    color="dark-blue"
                    class="text-caption mr-2 mb-2"
                  >
                    {{ role.name }}
                  </v-chip>
                </v-row>
              </v-col>
            </CustomCard>
          </v-col>

          <v-col
            cols="12"
            md="4"
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
              <v-col>
                <v-row class="space-x-2 px-2">
                  <v-chip
                    v-if="!user?.isUSSDDisabled"
                    density="compact"
                    :label="true"
                    variant="tonal"
                    color="dark-blue"
                    class="text-caption"
                  >
                    Web & Mobile
                  </v-chip>
                  <v-chip
                    v-else
                    density="compact"
                    :label="true"
                    variant="tonal"
                    color="dark-blue"
                    class="text-caption"
                  >
                    Web
                  </v-chip>
                </v-row>
              </v-col>
            </CustomCard>
          </v-col>

          <v-col
            cols="12"
            md="4"
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
              <v-col>
                <v-row class="space-x-2 px-2">
                  <v-chip
                    v-if="user?.isEnabled"
                    density="compact"
                    :label="true"
                    variant="tonal"
                    color="success"
                    class="text-caption"
                  >
                    Enabled
                  </v-chip>
                  <v-chip
                    v-else
                    density="compact"
                    :label="true"
                    variant="tonal"
                    color="error"
                    class="text-caption"
                  >
                    Disabled
                  </v-chip>
                </v-row>
              </v-col>
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
              title=""
              sub-title=""
              :require-space="false"
            >
              <v-container
                :fluid="true"
                class="-mt-3"
              >
                <v-row justify="space-around">
                  <v-card
                    width="100%"
                    elevation="0"
                  >
                    <div class="expansion-panel-container">
                      <div class="bg-presta-dark-blue py-3 px-4">
                        <h5 class="text-white">User Information</h5>
                      </div>
                      <v-expansion-panels
                        v-model="userInf"
                        elevation="0"
                        :readonly="true"
                      >
                        <v-expansion-panel
                          elevation="0"
                          class="rounded-0"
                        >
                          <template #title>
                            <h5 class="font-medium">Personal Details</h5>
                          </template>
                          <template #text>
                            <v-table class="min-w-full">
                              <tbody>
                                <tr>
                                  <td
                                    class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6"
                                  >
                                    <span class="text-gray-500 text-caption">
                                      First Name:&nbsp;
                                    </span>
                                    <span class="text-secondary text-caption">{{
                                      user ? user.firstName : ""
                                    }}</span>
                                  </td>
                                  <td
                                    class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6"
                                  >
                                    <span class="text-gray-500 text-caption">
                                      Last Name:&nbsp;
                                    </span>
                                    <span class="text-secondary text-caption">{{
                                      user ? user.lastName : ""
                                    }}</span>
                                  </td>
                                </tr>
                                <tr>
                                  <td
                                    class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6"
                                  >
                                    <span class="text-gray-500 text-caption">
                                      Phone No:&nbsp;
                                    </span>
                                    <span class="text-secondary text-caption">{{
                                      user ? user.phoneNumber : ""
                                    }}</span>
                                  </td>
                                  <td
                                    class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6"
                                  >
                                    <span class="text-gray-500 text-caption">
                                      Email:&nbsp;
                                    </span>
                                    <span class="text-secondary text-caption">{{
                                      user ? user.email : ""
                                    }}</span>
                                  </td>
                                </tr>
                              </tbody>
                            </v-table>
                          </template>
                        </v-expansion-panel>
                        <v-expansion-panel
                          elevation="0"
                          class="rounded-0"
                        >
                          <template #title>
                            <h5 class="font-medium">Credentials</h5>
                          </template>
                          <template #text>
                            <v-table class="min-w-full">
                              <tbody class="">
                                <tr>
                                  <td
                                    class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6"
                                  >
                                    <span class="text-gray-500 text-caption">
                                      Username:&nbsp;
                                    </span>
                                    <span class="text-secondary text-caption">{{
                                      user ? user.username : ""
                                    }}</span>
                                  </td>
                                  <td
                                    class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6"
                                  >
                                    <span class="text-gray-500 text-caption">
                                      USSD Phone No:&nbsp;
                                    </span>
                                    <span class="text-secondary text-caption">{{
                                      user
                                        ? user.ussdPhoneNumber
                                          ? user.ussdPhoneNumber
                                          : "_"
                                        : "_"
                                    }}</span>
                                  </td>
                                </tr>
                              </tbody>
                            </v-table>
                          </template>
                        </v-expansion-panel>
                      </v-expansion-panels>
                    </div>
                  </v-card>
                </v-row>
              </v-container>
            </CustomCard>
          </v-col>

          <v-col
            cols="12"
            md="6"
            sm="12"
          >
            <CustomCard
              title=""
              sub-title=""
              :require-space="false"
            >
              <v-container
                :fluid="true"
                class="-mt-3"
              >
                <v-row justify="space-around">
                  <v-card
                    width="100%"
                    elevation="0"
                  >
                    <div class="expansion-panel-container">
                      <div class="bg-presta-dark-blue py-3 px-4">
                        <h5 class="text-white">Access Details</h5>
                      </div>

                      <v-expansion-panels
                        v-model="accessDetailsInf"
                        elevation="0"
                        :readonly="true"
                      >
                        <v-expansion-panel
                          elevation="0"
                          class="rounded-0"
                        >
                          <template #title>
                            <h5 class="font-medium">Web Details</h5>
                          </template>
                          <template #text>
                            <v-table class="min-w-full">
                              <tbody>
                                <tr>
                                  <td
                                    class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6"
                                  >
                                    <span class="text-gray-500 text-caption">
                                      Web Status:&nbsp;
                                    </span>
                                    <span class="text-secondary text-caption">
                                      <v-chip
                                        v-if="user?.isEnabled"
                                        density="compact"
                                        :label="true"
                                        variant="tonal"
                                        color="success"
                                        class="text-caption"
                                      >
                                        Enabled
                                      </v-chip>
                                      <v-chip
                                        v-else
                                        density="compact"
                                        :label="true"
                                        variant="tonal"
                                        color="error"
                                        class="text-caption"
                                      >
                                        Disabled
                                      </v-chip>
                                    </span>
                                  </td>
                                  <td
                                    class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6"
                                  >
                                    <span class="text-gray-500 text-caption">
                                      Password Status:&nbsp;
                                    </span>
                                    <span class="text-secondary text-caption">
                                      <v-chip
                                        v-if="
                                          user &&
                                          user.requiredActions.length > 0
                                        "
                                        density="compact"
                                        :label="true"
                                        variant="tonal"
                                        color="dark-blue"
                                        class="text-caption"
                                      >
                                        NOT SET
                                      </v-chip>
                                      <v-chip
                                        v-else
                                        density="compact"
                                        :label="true"
                                        variant="tonal"
                                        color="error"
                                        class="text-caption"
                                      >
                                        SET
                                      </v-chip>
                                    </span>
                                  </td>
                                </tr>
                                <tr>
                                  <td
                                    class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6"
                                  >
                                    <span class="text-gray-500 text-caption">
                                      Username:&nbsp;
                                    </span>
                                    <span class="text-secondary text-caption">{{
                                      user ? user.username : ""
                                    }}</span>
                                  </td>
                                  <td
                                    class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6"
                                  >
                                    <span class="text-gray-500 text-caption">
                                      Required Actions:&nbsp;
                                    </span>
                                    <span
                                      v-if="user"
                                      class="text-secondary text-caption"
                                    >
                                      <span
                                        v-for="(
                                          action, i
                                        ) in user.requiredActions"
                                        :key="i"
                                        >{{ action }}&nbsp;</span
                                      >
                                    </span>
                                  </td>
                                </tr>
                              </tbody>
                            </v-table>
                          </template>
                        </v-expansion-panel>
                        <v-expansion-panel
                          elevation="0"
                          class="rounded-0"
                        >
                          <template #title>
                            <h5 class="font-medium">Mobile Details</h5>
                          </template>
                          <template #text>
                            <v-table class="min-w-full">
                              <tbody>
                                <tr>
                                  <td
                                    class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6"
                                  >
                                    <span class="text-gray-500 text-caption">
                                      Mobile Status:&nbsp;
                                    </span>
                                    <span class="text-secondary text-caption">
                                      <v-chip
                                        v-if="!user?.isUSSDDisabled"
                                        density="compact"
                                        :label="true"
                                        variant="tonal"
                                        color="success"
                                        class="text-caption"
                                      >
                                        Enabled
                                      </v-chip>
                                      <v-chip
                                        v-else
                                        density="compact"
                                        :label="true"
                                        variant="tonal"
                                        color="error"
                                        class="text-caption"
                                      >
                                        Disabled
                                      </v-chip>
                                    </span>
                                  </td>
                                  <td
                                    class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6"
                                  >
                                    <span class="text-gray-500 text-caption">
                                      Pin Status:&nbsp;
                                    </span>
                                    <span class="text-secondary text-caption">
                                      <v-chip
                                        density="compact"
                                        :label="true"
                                        variant="tonal"
                                        color="dark-blue"
                                        class="text-caption"
                                      >
                                        {{ user?.pinStatus }}
                                      </v-chip>
                                    </span>
                                  </td>
                                </tr>
                                <tr>
                                  <td
                                    class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6"
                                  >
                                    <span class="text-gray-500 text-caption">
                                      Remaining Pin Attempts:&nbsp;
                                    </span>
                                    <span class="text-secondary text-caption">
                                      <v-chip
                                        density="compact"
                                        :label="true"
                                        variant="tonal"
                                        color="dark-blue"
                                        class="text-caption"
                                      >
                                        {{
                                          user
                                            ? user.pinAttempts
                                              ? user.pinAttempts
                                              : "_"
                                            : ""
                                        }}
                                      </v-chip>
                                    </span>
                                  </td>
                                  <td
                                    class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6"
                                  ></td>
                                </tr>
                              </tbody>
                            </v-table>
                          </template>
                        </v-expansion-panel>
                      </v-expansion-panels>
                    </div>
                  </v-card>
                </v-row>
              </v-container>
            </CustomCard>
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
