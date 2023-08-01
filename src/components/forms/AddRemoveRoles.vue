<script setup lang="ts">
import { useStore } from "vuex";
import { computed, onMounted, ref, toRef } from "vue";
import { getUsersRoles } from "@/modules/all";
import { User } from "@users/types";

const props = defineProps<{
  user: User | null;
}>();

const idsToRemoveFromUser = ref<string[]>([]);

const userData = ref(<any>{});

const user = toRef(props, "user");

const store = useStore();

const userRoles = ref(<any[]>[]);

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

const selectedRoles = ref([]);

const addRolesToUser = async () => {
  if (idsToAddToUser.value.length === 0) {
    await store.dispatch("defineNotification", {
      message: "Use the checkbox to select roles to remove",
      warning: true,
    });
  } else {
    if (
      confirm(
        `You are about to add ${idsToAddToUser.value.length} roles from user ${userData.value.username}, proceed?`
      )
    ) {
      try {
        loading.value = true;
        const userRoleIds = userRoles.value.map(role => role.id);
        const { messages } = await store.dispatch("assignRoles", {
          userRefId: user.value.id.value,
          payload: {
            roleIds: [...userRoleIds, ...idsToAddToUser.value],
          },
        });
        /*await store.dispatch("defineNotification", {
          message: messages[0].message,
          success: true,
        });*/
      } catch (e: any) {
        alert(e.message);
      } finally {
        loading.value = false;
      }
    }
  }
};
const removeRolesFromUser = async () => {
  if (idsToRemoveFromUser.value.length === 0) {
    /*await store.dispatch("defineNotification", {
      message: "Use the checkbox to select roles to remove",
      warning: true,
    });*/
  } else {
    if (
      confirm(
        `You are about to remove ${idsToRemoveFromUser.value.length} roles from user ${userData.value.username}, proceed?`
      )
    ) {
      const userRolesIds = userRoles.value.map(role => role.id);
      const newRoleIds = userRolesIds.filter(
        role_id => idsToRemoveFromUser.value.indexOf(role_id) === -1
      );
      try {
        loading.value = true;
        const { messages } = await store.dispatch("assignRoles", {
          userRefId: user.value.id.value,
          payload: {
            roleIds: newRoleIds,
          },
        });
        /*await store.dispatch("defineNotification", {
          message: messages[0].message,
          success: true,
        });*/
        // await router.push(`/users/${route.params.id}/view`);
      } catch (e: any) {
        alert(e.message);
      } finally {
        loading.value = false;
      }
    }
  }
};

onMounted(async () => {
  try {
    userData.value = user.value;

    const { data } = await getUsersRoles(user.value.keycloakId);

    userRoles.value = data;

    userRoles.value.map((rl: any) => {
      selectedRoles.value.push(rl.id);
    });

    const { records } = await store.dispatch("getRoles");

    all_roles.value = records;
  } catch (e: any) {
    alert(e.message);
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
  />
</template>
