<script setup lang="ts">
import { getRoles } from "@/modules/all";
import { ref, onBeforeMount, computed } from "vue";
import { useUsers } from "@/Users/composables/useUsers";
import CustomCard from "@/components/common/CustomCard.vue";
import ActivityLogs from "@/components/tables/ActivityLogs.vue";
import DropDownMenu from "@/components/common/DropDownMenu.vue";

const { fetchUsers, users, pageables } = useUsers();

const roleCount = ref(0);

const searchActivityLogs = ref("");

getRoles()
  .then(({ totalRecords }) => {
    roleCount.value = totalRecords;
  })
  .catch((e: any) => {
    alert(e.message);
  });

const groups = computed(() => {
  return [
    {
      name: "Groups",
    },
    {
      name: "Group 1",
    },
  ];
});

const activityTypes = computed(() => {
  return [
    {
      name: "Activity Types",
    },
    {
      name: "Activity X",
    },
  ];
});

const selectedGroup = ref(groups.value[0]);
const selectedActivityType = ref(activityTypes.value[0]);

const setGroup = (group: typeof selectedGroup.value) => {
  selectedGroup.value = group;
};

const setActivityType = (activity: typeof selectedActivityType.value) => {
  selectedActivityType.value = activity;
};

const refresh = () => {
  // re fetch store
};

const headers = ref([
  {
    title: "User",
    key: "user",
    align: "start",
    sortable: false,
    visible: true,
  },
  {
    title: "Group",
    key: "group",
    align: "start",
    sortable: false,
    visible: true,
  },
  {
    title: "Description",
    key: "description",
    align: "start",
    sortable: false,
    visible: true,
  },
  {
    title: "Date & Time",
    key: "dateTime",
    align: "start",
    sortable: false,
    visible: true,
  },
]);

function changeVisibility(key: string) {
  headers.value.forEach(header => {
    if (header.key === key) {
      header.visible = !header.visible;
      header.align = header.align === " d-none" ? " start" : " d-none";
    }
  });
}

onBeforeMount(async () => await fetchUsers());
</script>
<template>
  <div class="px-4 sm:px-6 lg:mx-auto lg:px-8">
    <div class="py-3 md:flex md:justify-between lg:border-t lg:border-gray-200">
      <div class="flex-1 min-w-0">
        <div class="ml-3 flex flex-col items-start">
          <h1
            class="text-lg font-normal leading-7 text-gray-600 sm:leading-9 sm:truncate"
          >
            Identity & Access Management (IAM) Dashboard
          </h1>
          <div class="text-caption text-gray-600 font-regular mb-n1">
            A Summary Of
            <span class="font-weight-medium text-gray-800"> Users</span> And
            <span class="font-weight-medium text-gray-800"> Roles</span>
          </div>
        </div>
        <div class="mt-4 text-sm flex flex-wrap">
          <CustomCard
            title=""
            sub-title="Total Users"
            sub-title-classes="text-base"
          >
            <div class="space-y-2">
              <div class="flex flex-wrap justify-between">
                <h1 class="text-primary font-normal text-xl">
                  {{ users ? users.length : 0 }}
                </h1>
                <v-btn
                  variant="tonal"
                  color="primary"
                  append-icon="mdi-chevron-right"
                  class="text-none"
                  @click="$router.push('/users')"
                >
                  <span class="tracking-normal">View Users</span>
                </v-btn>
              </div>
              <div class="flex gap-4 md:gap-8">
                <h6 class="text-caption text-grey-darken-1">
                  Web: <span class="font-semibold text-grey-darken-2">0</span>
                </h6>
                <h6 class="text-caption text-grey-darken-1">
                  Mobile:
                  <span class="font-semibold text-grey-darken-2">0</span>
                </h6>
                <h6 class="text-caption text-grey-darken-1">
                  Web & Mobile:
                  <span class="font-semibold text-grey-darken-2">{{
                    users ? users.length : 0
                  }}</span>
                </h6>
              </div>
            </div>
          </CustomCard>
          <CustomCard
            title=""
            sub-title="Total Roles"
            sub-title-classes="text-base"
          >
            <div class="space-y-2">
              <div class="flex flex-wrap justify-between">
                <h1 class="text-primary font-normal text-xl">
                  {{ roleCount }}
                </h1>
                <v-btn
                  variant="tonal"
                  color="primary"
                  append-icon="mdi-chevron-right"
                  class="text-none"
                  @click="$router.push('/roles')"
                >
                  <span class="tracking-normal">View Roles</span>
                </v-btn>
              </div>
              <div class="flex gap-4 md:gap-8">
                <h6 class="text-caption text-grey-darken-1">
                  Owner:
                  <span class="font-semibold text-grey-darken-2">0</span>
                </h6>
                <h6 class="text-caption text-grey-darken-1">
                  Business Manager:
                  <span class="font-semibold text-grey-darken-2">0</span>
                </h6>
                <h6 class="text-caption text-grey-darken-1">
                  Operator:
                  <span class="font-semibold text-grey-darken-2">0</span>
                </h6>
                <h6 class="text-caption text-grey-darken-1">
                  Sales Agent:
                  <span class="font-semibold text-grey-darken-2">0</span>
                </h6>
              </div>
            </div>
          </CustomCard>
        </div>
        <div class="mt-6">
          <CustomCard
            title="Activity Log"
            sub-title="A Summary Of All The Implemented Changes"
          >
            <template #search>
              <div class="align-center d-flex w-full md:w-1/5">
                <v-input
                  append-icon="mdi-magnify"
                  class="px-2 border-0 bg-background rounded text-caption w-100 searchField"
                  hide-details="auto"
                >
                  <input
                    type="text"
                    class="bg-transparent focus:ring-0 text-caption w-full p-2 focus:outline-0"
                    placeholder="Search"
                  />
                </v-input>
              </div>
            </template>
            <v-col
              cols="auto"
              sm="12"
              class="pt-10 pb-8"
            >
              <v-row class="d-flex gap-4 justify-start">
                <DropDownMenu
                  :selected="selectedGroup"
                  :groups="groups"
                  @selected="setGroup($event)"
                />
                <DropDownMenu
                  :selected="selectedActivityType"
                  :groups="activityTypes"
                  @selected="setActivityType($event)"
                />
                <v-spacer />
                <v-btn
                  class="v-btn--size-default text-caption text-capitalize"
                  density="default"
                  :flat="true"
                  style="border: 1px solid rgba(128, 128, 128, 0.25)"
                  @click="refresh"
                >
                  Refresh
                </v-btn>
                <v-menu transition="slide-y-transition">
                  <template #activator="{ props }">
                    <v-btn
                      variant="outlined"
                      append-icon="mdi:mdi-chevron-down"
                      v-bind="props"
                      class="mr-4 text-none text-caption"
                      style="border: 1px solid rgba(128, 128, 128, 0.25)"
                    >
                      Show / Hide
                    </v-btn>
                  </template>
                  <v-sheet
                    border
                    rounded
                  >
                    <v-list
                      :nav="true"
                      density="compact"
                      role="listbox"
                    >
                      <v-list-item
                        v-for="(item, idx) in headers"
                        :key="idx"
                        :value="item"
                        @click="changeVisibility(item.key)"
                      >
                        <v-icon
                          v-if="item.visible"
                          icon="mdi:mdi-check"
                        />
                        {{ item.title }}</v-list-item
                      >
                    </v-list>
                  </v-sheet>
                </v-menu>
              </v-row>
            </v-col>
            <ActivityLogs :headers="headers" />
          </CustomCard>
        </div>
      </div>
    </div>
  </div>
</template>
