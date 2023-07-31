<script setup lang="ts">
import CustomCard from "@/components/common/CustomCard.vue";
import { toRef } from "vue";
import AssignRoleForm from "@/components/forms/AssignRoleForm.vue";
import { useBreakpoints } from "@vueuse/core";
import { User } from "@users/types";

const breakpoints = useBreakpoints({
  mobile: 320,
  tablet: 600,
  laptop: 960,
  desktop: 1280,
  large_desktop: 1920,
  extra_large_desktop: 2560,
});

const mobile = breakpoints.between("mobile", "tablet");

const props = defineProps<{
  isLoading: boolean;
  showOverlay: boolean;
  selectedUser: User | null;
}>();
const emit = defineEmits(["assignRole", "hideRolesOverlay"]);
const show = toRef(props, "showOverlay");
</script>

<template>
  <v-overlay
    v-model="show"
    :contained="true"
    class="pt-16 align-start justify-center"
    scroll-strategy="block"
    :min-width="mobile ? '95%' : '25%'"
  >
    <CustomCard
      title=""
      sub-title="Assign Role"
      sub-title-classes="text-lg -mx-2"
    >
      <template #search>
        <v-btn
          size="small"
          variant="flat"
          icon="mdi-close-circle-outline"
          @click="emit('hideRolesOverlay')"
        />
      </template>

      <template #default>
        <AssignRoleForm :selected-user="selectedUser" />
      </template>
    </CustomCard>
  </v-overlay>
</template>
