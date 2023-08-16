<script setup lang="ts">
import { computed, onMounted, reactive, ref, toRef } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { useUsers } from "@users/composables/useUsers";
import { useSearch } from "@/composables/useSearch";
import { User } from "@users/types";
import { debounce } from "lodash";
import AddRemoveRoles from "@/components/forms/AddRemoveRoles.vue";
import { useAuthStore } from "@/store/auth-store";
import { useRoles } from "@roles/composables/useRoles";
import { Role } from "@roles/types";
import { storeToRefs } from "pinia";
const authStore = useAuthStore();
const { assign, getRoles } = useRoles();
const { pageables, fetchUsers } = useUsers();
const { users, isLoading } = storeToRefs(useUsers());
const { search } = useSearch(pageables, fetchUsers);

const emit = defineEmits(["closeOverlay"]);

const componentProps = defineProps<{
  selectedUser?: User | null;
  selectedRole?: Role | null;
}>();

const selectedUser = toRef(componentProps, "selectedUser");

const loading = ref(false);

const initialState = {
  user: selectedUser.value ? selectedUser.value.id : null,
  group: null,
};

const state = reactive({
  ...initialState,
});

const rules = {
  user: { required },
  group: {},
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
    pageables.searchTerm = undefined;
  } else {
    pageables.searchTerm = queryText;
  }
  filterUser();
};

const newSelectedRoles = ref<string[]>([]);

const assignUserRole = async () => {
  const result = await v$.value.$validate();
  console.log("submit state", state);
  if (result) {
    loading.value = !loading.value;

    try {
      loading.value = true;
      const response: any = await assign({
        userRefId: state.user,
        payload: {
          roleIds: newSelectedRoles.value,
        },
      });
      if (response.messages && response.messages.length > 0) {
        authStore.addAlerts(
          "success",
          "Role Assignment " + response.messages[0].message
        );
      } else {
        authStore.addAlerts("success", "Role Assignment Successful");
      }
    } catch (e: any) {
      authStore.addAlerts("error", e.message);
    } finally {
      loading.value = false;
      emit("closeOverlay");
    }
  }
};

onMounted(async () => {
  if (selectedUser.value) {
    pageables.searchTerm = selectedUser.value.username;
  }
  await search();

  const { records } = await getRoles();

  if (records.length > 0) {
    newSelectedRoles.value = records.map((role: any) => {
      return role.id;
    });
  }
});

const setUserRolesToAssign = (roles: string[]) => {
  newSelectedRoles.value = roles;
};
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
      :items="computedUsers"
      :loading="isLoading"
      :custom-filter="customUserFilter as any"
      item-value="id"
      item-title="firstName"
      variant="outlined"
      density="compact"
      hide-details="auto"
    >
      <template #item="{ props, item }">
        <v-list-item
          v-bind="props"
          :title="item?.raw?.firstName + ' ' + item?.raw?.lastName"
          :subtitle="item?.raw?.email"
        ></v-list-item>
      </template>
    </v-autocomplete>
    <div
      class="text-subtitle-1 text-sm-caption mt-2 font-weight-bold text-gray-400 py-2"
    >
      Role Names
    </div>
    <AddRemoveRoles
      :key="`${selectedUser}`"
      :user="selectedUser"
      :active="false"
      @assign-roles="setUserRolesToAssign"
    />
    <!--    <div
      class="text-subtitle-1 text-sm-caption mt-2 font-weight-bold text-gray-400 py-2"
    >
      Label
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
    ></v-autocomplete>-->

    <v-btn
      :loading="loading"
      :disabled="loading"
      variant="flat"
      color="primary"
      class="rounded-0 w-full text-none mt-10"
      type="button"
      @click="assignUserRole"
    >
      Assign Roles
    </v-btn>
  </form>
</template>
