<script setup lang="ts">
import { computed, ref } from "vue";

const activities = [
  {
    user: "First Last",
    designation: "Operator",
    group: "Admin",
    description: "Assigned Sales Agent role to Duggan Kimani",
    dateTime: new Date().toLocaleDateString("en-GB"),
  },
  {
    user: "First Last",
    designation: "Operator",
    group: "Admin",
    description: "Assigned Sales Agent role to Duggan Kimani",
    dateTime: new Date().toLocaleDateString("en-GB"),
  },
  {
    user: "First Last",
    designation: "Operator",
    group: "Admin",
    description: "Assigned Sales Agent role to Duggan Kimani",
    dateTime: new Date().toLocaleDateString("en-GB"),
  },
  {
    user: "First Last",
    designation: "Operator",
    group: "Admin",
    description: "Assigned Sales Agent role to Duggan Kimani",
    dateTime: new Date().toLocaleDateString("en-GB"),
  },
  {
    user: "First Last",
    designation: "Operator",
    group: "Admin",
    description: "Assigned Sales Agent role to Duggan Kimani",
    dateTime: new Date().toLocaleDateString("en-GB"),
  },
  {
    user: "First Last",
    designation: "Operator",
    group: "Admin",
    description: "Assigned Sales Agent role to Duggan Kimani",
    dateTime: new Date().toLocaleDateString("en-GB"),
  },
  {
    user: "First Last",
    designation: "Operator",
    group: "Admin",
    description: "Assigned Sales Agent role to Duggan Kimani",
    dateTime: new Date().toLocaleDateString("en-GB"),
  },
];

const itemsPerPage = ref(5);
const totalItems = ref(activities.length);
const headers = ref([
  { title: "User", key: "user", align: "start", sortable: false },
  { title: "Group", key: "group", align: "start", sortable: false },
  { title: "Description", key: "description", align: "start", sortable: false },
  { title: "Date & Time", key: "dateTime", align: "start", sortable: false },
]);
const search = ref("");
const loading = ref(false);

const serverItems = computed(() => {
  return activities;
});
type optionsType = {
  page: number;
  itemsPerPage: number;
  sortBy: [];
  groupBy: [];
  search: string;
};
const loadItems = (options: optionsType) => {
  itemsPerPage.value = options.itemsPerPage;
  loading.value = true;

  setTimeout(() => {
    loading.value = false;
  }, 1000);
};
</script>

<template>
  <v-data-table-server
    id="activity-logs"
    class="text-md-body-2"
    :items-per-page="itemsPerPage"
    :headers="headers"
    :items-length="totalItems"
    :items="serverItems"
    :loading="loading"
    :search="search"
    item-value="name"
    no-data-text="No data available"
    loading-text="loading"
    :items-per-page-text="'Show'"
    :page-text="'entries'"
    :first-icon="''"
    :last-icon="''"
    :show-current-page="true"
    :items-per-page-options="[
      {
        title: '10',
        value: 10,
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
</template>

<style scoped></style>
