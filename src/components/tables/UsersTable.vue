<script setup lang="ts">
import { computed, ref, toRef } from "vue";
import { useUsers } from "@/Users/composables/useUsers";
import { useRouter } from "vue-router";
import { User } from "@users/types";
const router = useRouter();
const { users, pageables } = useUsers();

const props = defineProps<{
  headers: {
    title: string;
    key: string;
    align: string;
    sortable: boolean;
    visible: boolean;
  }[];
  userList: typeof users.value;
  isLoading: boolean;
  paginationData: typeof pageables;
}>();

const emit = defineEmits([
  "fetchUsers",
  "updateItemsPerPage",
  "updatePage",
  "deleteUser",
  "selectUser",
]);

const userList = toRef(props, "userList");
const search = ref("");

const submitAction = (name: string, user: User) => {
  switch (name) {
    case "view":
      router.push(`/users/${user.id}/view`);
      break;
    case "role":
      emit("selectUser", user);
      break;
    case "delete":
      emit("deleteUser", user);
      break;
  }
};

const serverItems = computed(() => {
  let data: any[] = [];
  if (userList.value) {
    data = userList.value.map(user => {
      return {
        ...user,
        user: user.firstName + " " + user.lastName,
        status: user.isEnabled,
        access: !user.isUSSDDisabled ? "Web & Mobile" : "Web",
        group: "_",
        actions: [
          {
            name: "view",
            icon: "mdi-eye",
          },
          {
            name: "role",
            icon: "mdi-swap-vertical",
          },
          {
            name: "delete",
            icon: "mdi-trash-can-outline",
          },
        ],
      };
    });
  }
  return data;
});
type optionsType = {
  page: number;
  itemsPerPage: number;
  sortBy: [];
  groupBy: [];
  search: string;
};
const loadItems = async (options: optionsType) => {
  emit("updateItemsPerPage", options.itemsPerPage);
  emit("updatePage", options.page - 1);
  emit("fetchUsers");
};
</script>

<template>
  <v-data-table-server
    id="activity-logs"
    class="text-md-body-2"
    :items-per-page="paginationData.recordsPerPage"
    :headers="headers as any"
    :items-length="paginationData.totalRecords"
    :items="serverItems"
    :loading="isLoading"
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
    <template #[`item.access`]="{ item }">
      <v-chip
        density="compact"
        :label="true"
        color="primary"
        class="text-caption"
      >
        {{ item.raw.access }}
      </v-chip>
    </template>

    <template #[`item.group`]="{ item }">
      <v-chip
        density="compact"
        variant="outlined"
        :label="true"
        color="secondary"
        class="text-caption"
      >
        {{ item.raw.group }}
      </v-chip>
    </template>

    <template #[`item.status`]="{ item }">
      <v-chip
        v-if="item.raw.status"
        density="compact"
        :label="true"
        color="success"
        class="text-caption"
      >
        Enabled
      </v-chip>
      <v-chip
        v-else
        density="compact"
        :label="true"
        color="error"
        class="text-caption"
      >
        Disabled
      </v-chip>
    </template>

    <template #[`item.actions`]="{ item }">
      <v-btn
        v-for="(btn, i) in item.raw.actions"
        :key="i"
        variant="outlined"
        density="compact"
        size="small"
        class="action-btn action-btn-icon mx-0.5"
        :color="btn.name == 'delete' ? 'error' : 'secondary'"
        @click="submitAction(btn.name, item.raw)"
      >
        <v-icon :icon="btn.icon" />
      </v-btn>
    </template>
  </v-data-table-server>
</template>
