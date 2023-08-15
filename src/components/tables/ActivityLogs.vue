<script setup lang="ts">
import { useDashboard } from "@/Dashboard/composables/useDashboard";
import { storeToRefs } from "pinia";
import CustomCard from "@/components/common/CustomCard.vue";
import DropDownMenu from "@/components/common/DropDownMenu.vue";
const {
  fetchActivityList,
  pageables,
  changeVisibility,
  setActivityType,
  setGroup,
} = useDashboard();
const {
  activityList,
  labels,
  activityTypes,
  selectedActivityType,
  selectedLabel,
  headers,
  loading,
} = storeToRefs(useDashboard());

type optionsType = {
  page: number;
  itemsPerPage: number;
  sortBy: [];
  groupBy: [];
  search: string;
};

const loadItems = (options: optionsType) => {
  pageables.recordsPerPage = options.itemsPerPage;
  pageables.currentPage = options.page - 1;
  fetchActivityList();
};
</script>

<template>
  <div class="mt-6">
    <CustomCard
      title="Activity Log"
      sub-title="A Summary Of All The Effected Changes"
    >
      <template #search>
        <div class="align-center d-flex w-full md:w-1/5">
          <v-input
            append-icon="mdi-magnify"
            class="px-2 border-0 bg-background rounded text-caption w-100 searchField"
            hide-details="auto"
          >
            <input
              v-model="pageables.searchTerm"
              type="search"
              placeholder="Search Activity"
              class="bg-transparent focus:ring-0 text-caption w-full p-2 focus:outline-0"
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
            placeholder="Select Label"
            :selected="selectedLabel"
            :groups="labels"
            @selected="setGroup($event)"
          />
          <DropDownMenu
            placeholder="Select Activity"
            :selected="selectedActivityType"
            :groups="activityTypes"
            @selected="setActivityType($event)"
          />
          <v-spacer />
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
      <v-data-table-server
        id="activity-logs"
        class="text-sm"
        :items-per-page="pageables.recordsPerPage"
        :headers="headers as any"
        :items-length="pageables.totalRecords"
        :items="activityList"
        :loading="loading"
        :search="pageables.searchTerm"
        item-value="id"
        no-data-text="No data available"
        loading-text="loading"
        :items-per-page-text="'Show'"
        :page-text="'entries'"
        :first-icon="''"
        :last-icon="''"
        :show-current-page="true"
        :items-per-page-options="[
          {
            title: '5',
            value: 5,
          },
          {
            title: '10',
            value: 10,
          },
          {
            title: '50',
            value: 50,
          },
        ]"
        @update:options="loadItems"
      >
        <template #[`item.group`]="{ item }">
          <v-chip
            :label="true"
            color="primary"
          >
            {{ item.raw.group }}
          </v-chip>
        </template>
      </v-data-table-server>
    </CustomCard>
  </div>
</template>

<style scoped></style>
