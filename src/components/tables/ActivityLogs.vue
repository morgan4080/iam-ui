<script setup lang="ts">
import { computed, ref } from "vue";

defineProps<{
  headers: {
    title: string;
    key: string;
    align: string;
    sortable: boolean;
    visible: boolean;
  }[];
}>();

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
    :headers="headers as any"
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
</template>

<style scoped></style>
