<script setup lang="ts">
import { onMounted, ref, toRef, watch } from "vue";
import { User } from "@users/types";
import { useAuthStore } from "@/store/auth-store";
import { useRoles } from "@roles/composables/useRoles";
const authStore = useAuthStore();
const { assign, getRoles, getUsersRoles } = useRoles();

const componentProps = defineProps<{
  user: User | null | undefined;
  active?: boolean | null;
  disabled?: boolean;
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

const disabled = toRef(componentProps, "disabled");

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

    const { records } = await getRoles();

    all_roles.value = records;
  } catch (e: any) {
    authStore.addAlerts("error", e.message);
  }
});

watch(selectedRoles, async newSelectedRoles => {
  if (active.value !== false && user && user.value) {
    try {
      loading.value = true;
      const response: any = await assign({
        userRefId: user.value.id,
        payload: {
          roleIds: newSelectedRoles,
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
    density="compact"
    :hide-details="true"
    :flat="true"
    :multiple="true"
    :chips="true"
    bg-color="#F2F2F223"
    :disabled="disabled"
  >
  </v-autocomplete>
</template>
