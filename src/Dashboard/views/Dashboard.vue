<script setup lang="ts">
import { computed, onMounted } from "vue";
import CustomCard from "@/components/common/CustomCard.vue";
import ActivityLogs from "@/components/tables/ActivityLogs.vue";
import { useDashboard } from "@/Dashboard/composables/useDashboard";
import { storeToRefs } from "pinia";
import { cloneDeep } from "lodash";
const { fetchUserCount, fetchRoleCount } = useDashboard();
const { roleCounts, userCounts } = storeToRefs(useDashboard());

onMounted(async () => {
  await fetchUserCount();
  await fetchRoleCount();
});

const topRoleCounts = computed(() => {
  const computedRoleCounts = cloneDeep(roleCounts.value);
  Reflect.deleteProperty(computedRoleCounts, "totalRoles");
  return Object.entries(computedRoleCounts)
    .sort(([, v1], [, v2]) => v1 - v2)
    .splice(3)
    .reverse()
    .reduce(
      (obj, [k, v]) => ({
        ...obj,
        [k]: v,
      }),
      {}
    );
});
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
                  {{ userCounts["totalUsers"] ? userCounts["totalUsers"] : 0 }}
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
                  Web:
                  <span class="font-semibold text-grey-darken-2">{{
                    userCounts["webUsers"]
                  }}</span>
                </h6>
                <h6 class="text-caption text-grey-darken-1">
                  Mobile:
                  <span class="font-semibold text-grey-darken-2">{{
                    userCounts["mobileUsers"]
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
                  {{ roleCounts["totalRoles"] }}
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
                <h6
                  v-for="(value, name, index) in topRoleCounts"
                  :key="index"
                  class="text-caption text-grey-darken-1"
                  style="text-transform: capitalize !important"
                >
                  {{ name }}:
                  <span class="font-semibold text-grey-darken-2">{{
                    value
                  }}</span>
                </h6>
              </div>
            </div>
          </CustomCard>
        </div>
        <ActivityLogs />
      </div>
    </div>
  </div>
</template>
