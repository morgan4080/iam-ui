<script setup lang="ts">
import { useRoles } from "@roles/composables/useRoles";
import FixedHeader from "@/components/common/FixedHeader.vue";
import { chunk } from "lodash";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
import { onMounted, ref } from "vue";
import CustomCard from "@/components/common/CustomCard.vue";
import { useAuthStore } from "@/store/auth-store";
const route = useRoute();
const { getRole, syncRoles, syncServices, getServiceConfiguration } =
  useRoles();
const { isLoading, role, serviceConfiguration } = storeToRefs(useRoles());
const authStore = useAuthStore();

onMounted(async () => {
  await Promise.allSettled([
    getServiceConfiguration(),
    getRole(`${route.params.id}`),
  ]);
});

const tab = ref(null);
const tabs = ref(["Role Details"]);
</script>

<template>
  <FixedHeader
    :title="role ? role.name : ''"
    sub-title="Details For role"
    :highlighted="role ? role.name : ''"
  >
    <template #buttons>
      <v-btn
        :loading="isLoading"
        variant="outlined"
        color="secondary"
        class="text-none text-caption mx-2"
        @click="$router.back()"
      >
        Go Back
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
            md="4"
            sm="12"
          >
            <CustomCard
              title=""
              sub-title="Role Name"
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
                <p class="text-primary">{{ role ? role.name : "" }}</p>
              </div>
            </CustomCard>
          </v-col>

          <v-col
            cols="12"
            md="4"
            sm="12"
          >
            <CustomCard
              title=""
              sub-title="Group"
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
                <p>{{ role ? role.groupName : "" }}</p>
              </div>
            </CustomCard>
          </v-col>

          <v-col
            cols="12"
            md="4"
            sm="12"
          >
            <CustomCard
              title=""
              sub-title="Role Description"
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
                <p class="text-caption font-weight-regular">
                  {{ role ? role.description : "" }}
                </p>
              </div>
            </CustomCard>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col
            v-for="(service, serviceIndex) in serviceConfiguration"
            :key="serviceIndex"
            cols="12"
            :md="serviceConfiguration.length > 1 ? 6 : 12"
            sm="12"
          >
            <custom-card
              title=""
              sub-title=""
            >
              <v-card
                class="mx-auto"
                elevation="0"
                rounded="0"
              >
                <v-card-item class="text-white bg-presta-dark-blue">
                  <template #subtitle>
                    <h4 class="font-medium text-sm">
                      {{ service.name.toUpperCase() }}
                    </h4>
                  </template>
                  <template #append>
                    <v-switch
                      v-model="service.selected"
                      density="compact"
                      color="surface"
                      hide-details
                      @update:model-value="
                        e => {
                          service.resources = service.resources.map(
                            resource => {
                              return {
                                ...resource,
                                show: e !== undefined ? e : false,
                              };
                            }
                          );
                        }
                      "
                    ></v-switch>
                  </template>
                </v-card-item>
                <div
                  v-for="(resource, resourceIndex) in service.resources"
                  :key="resourceIndex"
                  class="resource"
                >
                  <v-table
                    density="compact"
                    class="text-caption border-round"
                  >
                    <tbody>
                      <tr>
                        <th
                          class="text-left font-weight-medium text-capitalize"
                          @click="resource.show = !resource.show"
                        >
                          <span>{{ resource.name }}</span>
                          <v-icon
                            :icon="
                              !resource.show ? 'mdi-menu-down' : 'mdi-menu-up'
                            "
                          />
                        </th>
                      </tr>
                    </tbody>
                  </v-table>
                  <v-divider></v-divider>
                  <v-expand-transition>
                    <div v-show="resource.show">
                      <div
                        v-for="(permissionChunk, permissionChunkIndex) in chunk(
                          resource.permissions,
                          2
                        )"
                        :key="permissionChunkIndex"
                        class="permission-chunk"
                      >
                        <v-table
                          density="compact"
                          class="text-caption border-round"
                        >
                          <tbody>
                            <tr>
                              <th
                                v-for="(
                                  permission, permissionIndex
                                ) in permissionChunk"
                                :key="permissionIndex"
                                class="text-left space-x-4 font-weight-regular w-1/2"
                              >
                                <v-icon
                                  size="small"
                                  class="bg-black rounded"
                                  :class="{ 'bg-white': !permission.selected }"
                                  color="#FFFFFF"
                                  :icon="
                                    permission.selected
                                      ? 'mdi-check'
                                      : 'mdi-minus'
                                  "
                                />
                                <span>{{ permission.name }}</span>
                              </th>
                            </tr>
                          </tbody>
                        </v-table>
                        <v-divider></v-divider>
                      </div>
                    </div>
                  </v-expand-transition>
                </div>
              </v-card>
            </custom-card>
          </v-col>
        </v-row>
      </v-container>
    </v-window-item>
  </v-window>
</template>
