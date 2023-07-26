<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { useUsers } from "@users/composables/useUsers";
import { useSearch } from "@/composables/useSearch";
import { User } from "@users/types";
import { debounce } from "lodash";

const { users, pageables, isLoading, fetchUsers } = useUsers();
const { search } = useSearch(pageables, fetchUsers);

const props = defineProps<{
  selectedUser?: User | null;
}>();

const loading = ref(false);

const initialState = {
  user: props.selectedUser ? props.selectedUser.id : null,
  role: null,
  group: null,
};

const state = reactive({
  ...initialState,
});

const rules = {
  user: { required },
  role: { required },
  group: { required },
};

const v$ = useVuelidate(rules, state, { $lazy: true, $autoDirty: true });

const computedUsers = computed(() => {
  let data: User[] = [];
  if (users.value) {
    data = users.value.map(it => {
      return {
        ...it,
      };
    });
  }
  return data;
});

const filterUser = debounce(async () => {
  await search();
}, 1000);

const customUserFilter = (itemTitle: string, queryText: string) => {
  if (queryText == "") {
    pageables.searchTerm = null;
  } else {
    pageables.searchTerm = queryText;
  }
  filterUser();
};

const assignUserRole = async () => {
  loading.value = !loading.value;
  v$.value.$touch();
  const result = await v$.value.$validate();
  console.log("submit state", state);
  setTimeout(() => {
    if (result) {
      console.log("submit state", state);
    }
    // clear();
    loading.value = !loading.value;
  }, 1000);
};

onMounted(async () => {
  await fetchUsers();
});
</script>

<template>
  <v-divider
    color="secondary"
    class="-mx-6"
  />
  <form class="py-4">
    <div
      class="text-subtitle-1 text-sm-caption font-weight-bold text-gray-400 py-2"
    >
      Select User
      <span
        v-if="v$.user.required"
        class="text-red"
        >*</span
      >
    </div>
    <v-autocomplete
      v-model="state.user"
      color="primary"
      :error-messages="v$.user.$errors.map(e => e.$message) as any"
      placeholder="Type"
      required
      :items="computedUsers"
      :loading="isLoading"
      :custom-filter="customUserFilter as any"
      item-value="id"
      item-title="firstName"
      variant="outlined"
      density="compact"
      hide-details="auto"
    ></v-autocomplete>
    <div
      class="text-subtitle-1 text-sm-caption mt-2 font-weight-bold text-gray-400 py-2"
    >
      Role Name
      <span
        v-if="v$.role.required"
        class="text-red"
        >*</span
      >
    </div>
    <v-autocomplete
      v-model="state.role"
      color="primary"
      :error-messages="v$.role.$errors.map(e => e.$message) as any"
      placeholder="Type"
      required
      :items="[]"
      variant="outlined"
      density="compact"
      item-title="name"
      item-value="id"
      hide-details="auto"
    ></v-autocomplete>
    <div
      class="text-subtitle-1 text-sm-caption mt-2 font-weight-bold text-gray-400 py-2"
    >
      Group
      <span
        v-if="v$.group.required"
        class="text-red"
        >*</span
      >
    </div>
    <v-autocomplete
      v-model="state.group"
      color="primary"
      :error-messages="v$.group.$errors.map(e => e.$message) as any"
      placeholder="Type"
      required
      :items="[]"
      variant="outlined"
      density="compact"
      item-title="name"
      item-value="id"
      hide-details="auto"
    ></v-autocomplete>

    <v-btn
      :loading="loading"
      :disabled="loading"
      variant="flat"
      color="primary"
      class="rounded-0 w-full text-none mt-10"
      type="button"
      @click="assignUserRole"
    >
      Assign Role
    </v-btn>
  </form>
</template>
