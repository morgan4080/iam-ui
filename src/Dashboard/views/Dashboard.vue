<script setup lang="ts">
import { getRoles } from "@/modules/all";
import { ref, onMounted } from "vue";
import { useUsers } from "@users/composables/useUsers";
import CustomCard from "@/components/common/CustomCard.vue";
import ActivityLogs from "@/components/tables/ActivityLogs.vue";
const { fetchUsers, users } = useUsers();

const roleCount = ref(0);

getRoles()
  .then(({ totalRecords }) => {
    roleCount.value = totalRecords;
  })
  .catch((e: any) => {
    alert(e.message);
  });

onMounted(async () => {
  await fetchUsers();
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
        <ActivityLogs />
      </div>
    </div>
  </div>
</template>
