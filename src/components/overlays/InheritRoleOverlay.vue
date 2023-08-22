<script setup lang="ts">
import CustomCard from "@/components/common/CustomCard.vue";
import { toRef } from "vue";
import { useBreakpoints } from "@vueuse/core";
import { User } from "@users/types";
import { Role } from "@roles/types";
import InheritRoleForm from "@/components/forms/InheritRoleForm.vue";

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
}>();
const emit = defineEmits(["inheritRole", "hideRolesOverlay"]);
const show = toRef(props, "showOverlay");
</script>

<template>
  <v-overlay
    v-model="show"
    :contained="true"
    class="pt-10 align-start justify-center"
    scroll-strategy="block"
    :width="mobile ? '95%' : '35%'"
  >
    <CustomCard
      title=""
      sub-title="Inherit Roles"
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
        <InheritRoleForm @inherit-role="emit('inheritRole', $event)" />
      </template>
    </CustomCard>
  </v-overlay>
</template>
