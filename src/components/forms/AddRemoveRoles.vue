<script setup lang="ts">
import { useStore } from "vuex";
import { onMounted, ref, toRef, watch } from "vue";
import { getUsersRoles } from "@/modules/all";
import { User } from "@users/types";
import { useAuthStore } from "@/store/auth-store";
const authStore = useAuthStore();

const componentProps = defineProps<{
  user: User | null;
  active?: boolean | null;
}>();

const active = toRef(componentProps, "active");

const emit = defineEmits(["assignRoles"]);

type RoleType = {
  id: string;
  keycloakRoleId: string;
  name: string;
  description?: string;
  roleType: string;
  subRolesId: string[];
};

const userData = ref(<User | null>null);

const user = toRef(componentProps, "user");

const store = useStore();

const userRoles = ref(<RoleType[]>[]);

const loading = ref(<boolean>false);

const all_roles = ref(
  <
    {
      id: string;
      keycloakRoleId: string;
      name: string;
      roleType: string;
      description: string;
    }[]
  >[]
);

const selectedRoles = ref<string[]>([]);

onMounted(async () => {
  try {
    if (user.value) {
      userData.value = user.value;

      const { data } = await getUsersRoles(user.value.keycloakId);

      userRoles.value = data;

      userRoles.value.map((rl: RoleType) => {
        selectedRoles.value.push(rl.id);
      });
    }

    const { records } = await store.dispatch("getRoles");

    all_roles.value = records;
  } catch (e: any) {
    authStore.addAlerts("error", e.message);
  }
});

watch(selectedRoles, async newSelectedRoles => {
  if (active.value !== false && user && user.value) {
    try {
      loading.value = true;
      const { messages } = await store.dispatch("assignRoles", {
        userRefId: user.value.id,
        payload: {
          roleIds: newSelectedRoles,
        },
      });
      if (messages.length > 0) {
        authStore.addAlerts("success", messages[0].message);
      }
    } catch (e: any) {
      authStore.addAlerts("error", e.message);
    } finally {
      loading.value = false;
    }
  } else {
    emit("assignRoles", newSelectedRoles);
  }
});
</script>

<template>
  <v-autocomplete
    v-model="selectedRoles"
    :items="all_roles"
    item-title="name"
    item-value="id"
    variant="outlined"
    :density="'compact'"
    :hide-details="true"
    :flat="true"
    :multiple="true"
    :chips="true"
    bg-color="#F2F2F223"
  >
  </v-autocomplete>
</template>
