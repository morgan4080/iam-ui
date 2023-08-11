<script setup lang="ts">
import { useRoles } from "@roles/composables/useRoles";
import FixedHeader from "@/components/common/FixedHeader.vue";
import { chunk } from "lodash";
import { storeToRefs } from "pinia";
import { onMounted, reactive, ref } from "vue";
import CustomCard from "@/components/common/CustomCard.vue";
import { required } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import { useRouter } from "vue-router";
import InheritRoleOverlay from "@/components/overlays/InheritRoleOverlay.vue";
const router = useRouter();
const showOverlay = ref(false);
const {
  getLabels,
  getServiceConfiguration,
  emptySelectedPermissions,
  createRole,
} = useRoles();
const { isLoading, serviceConfiguration, labels } = storeToRefs(useRoles());

const form = reactive({
  name: "",
  description: "",
  groupName: undefined,
  parentRoleIds: [],
  permissions: [],
});

const rules = {
  name: { required },
  description: { required },
};

const v$ = useVuelidate(rules, form, { $lazy: true, $autoDirty: true });

onMounted(() => {
  emptySelectedPermissions();
  Promise.all([getLabels(), getServiceConfiguration()]);
});

const tab = ref(null);
const tabs = ref(["Role Details"]);

const saveRole = async () => {
  const permissions = new Set();
  serviceConfiguration.value.forEach(service => {
    service.resources.forEach(resource => {
      resource.permissions.forEach(permission => {
        if (permission.selected) {
          permissions.add(permission.id);
        }
      });
    });
  });

  form.permissions = Array.from(permissions) as typeof form.permissions;

  const result = await v$.value.$validate();

  if (result) {
    await createRole({
      name: form.name,
      description: form.description,
      groupName: form.groupName ? form.groupName : "",
      permissions: form.permissions as any,
      parentRoleIds: form.parentRoleIds,
    });

    await router.back();
  }
};

const setInheritedRole = (rolesToInherit: typeof form.parentRoleIds) => {
  form.parentRoleIds = rolesToInherit;
  showOverlay.value = false;
};
</script>

<template>
  <FixedHeader
    :title="'Create Role'"
    sub-title="Create new role"
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
      <v-btn
        :loading="isLoading"
        variant="outlined"
        color="secondary"
        class="text-none text-caption mx-2"
        @click="showOverlay = true"
      >
        Inherit Role
      </v-btn>
      <v-btn
        :loading="isLoading"
        variant="flat"
        color="primary"
        class="text-none text-caption mx-2"
        @click="saveRole"
      >
        Save Role
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
              <v-input
                hide-details="auto"
                :error-messages="v$.name.$errors.map(e => e.$message) as any"
              >
                <div
                  class="px-2 border-0 bg-background rounded text-caption w-100 searchField"
                >
                  <input
                    v-model="form.name"
                    type="search"
                    placeholder="Role Name"
                    class="bg-transparent focus:ring-0 text-caption w-full p-2 focus:outline-0"
                  />
                </div>
              </v-input>
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
              <v-input hide-details="auto">
                <div
                  class="px-2 border-0 bg-background rounded text-caption w-100 searchField"
                >
                  <select
                    v-model="form.groupName"
                    class="customSelect bg-transparent focus:ring-0 text-caption w-full p-2 focus:outline-0"
                  >
                    <option :value="undefined">Select Label</option>
                    <option
                      v-for="(label, labelIndex) in labels"
                      :key="labelIndex"
                      :value="label.name"
                    >
                      {{ label.name }}
                    </option>
                  </select>
                </div>
              </v-input>
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
              <v-input
                hide-details="auto"
                :error-messages="v$.name.$errors.map(e => e.$message) as any"
              >
                <div
                  class="px-2 border-0 bg-background rounded text-caption w-100 searchField"
                >
                  <textarea
                    v-model="form.description"
                    rows="1"
                    type="search"
                    placeholder="Role Description"
                    class="bg-transparent focus:ring-0 text-caption w-full p-2 focus:outline-0"
                  />
                </div>
              </v-input>
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
                      {{ "Presta " + service.name.toUpperCase() }}
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
                      <tr class="bg-gray-100">
                        <th
                          class="text-left font-weight-medium text-capitalize cursor-pointer"
                          @click="resource.show = !resource.show"
                        >
                          <span>{{ resource.name }}</span>
                          <v-icon
                            size="x-large"
                            :color="resource.show ? 'primary' : '#D3D3D3'"
                            :icon="
                              resource.show ? 'mdi-menu-down' : 'mdi-menu-up'
                            "
                          />
                        </th>
                        <th class="text-right w-1/12">
                          <v-checkbox
                            v-model="resource.selected"
                            color="#489DC5"
                            hide-details
                            density="compact"
                            class="text-caption"
                            @update:model-value="
                              e => {
                                resource.permissions = resource.permissions.map(
                                  permission => {
                                    return {
                                      ...permission,
                                      selected: e,
                                    };
                                  }
                                );
                              }
                            "
                          ></v-checkbox>
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
                                <v-checkbox
                                  v-model="permission.selected"
                                  color="#000000"
                                  hide-details
                                  class="text-caption"
                                >
                                  <template #label>
                                    <span
                                      class="text-caption font-weight-regular"
                                      >{{ permission.name }}</span
                                    >
                                  </template>
                                </v-checkbox>
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
  <Teleport to="body">
    <InheritRoleOverlay
      :is-loading="isLoading"
      :show-overlay="showOverlay"
      @hide-roles-overlay="showOverlay = false"
      @inherit-role="setInheritedRole"
    />
  </Teleport>
</template>
