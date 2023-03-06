import { reactive, ref } from "vue";
import type { Role } from "@/Roles/types";
import { Pageables } from "@/types";
import { useQueryParams } from "@/composables/useQueryParams";
import { mapActions } from "@/modules/mapStore";

export const useRoles = () => {
  // TODO refactor this to composable
  const { defineNotification } = mapActions();

  const roles = ref<Role[] | null>(null);
  const userRoles = ref();
  const isLoading = ref(false);
  const error = ref<null | unknown>(null);
  const pageables = reactive({
    recordsPerPage: 10,
    totalRecords: 0,
    totalPages: 0,
    currentPage: 0,
    sort: "ASC",
    searchTerm: null,
  }) as Pageables;
  const { params, generateParams } = useQueryParams(pageables);

  async function fetchRoles() {
    isLoading.value = true;
    error.value = null;

    await generateParams();

    return await fetch(
      `${import.meta.env.VITE_DOMAIN_URL}/users-admin/api/roles?${
        params.value
      }`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then(async response => {
        if (response.ok) {
          const data = await response.json();
          roles.value = data.records;
          pageables.totalRecords = data.totalRecords;
          pageables.totalPages = data.totalPages;
          pageables.currentPage = data.currentPage + 1;
          return;
        }
        await defineNotification({
          message: await response.statusText,
          error: true,
        });
      })
      .catch(async err => {
        await defineNotification({
          message: err,
          error: true,
        });
      })
      .finally(() => (isLoading.value = false));
  }

  async function fetchUserRoles(userRefId: string) {
    isLoading.value = true;
    error.value = null;
    return await fetch(
      `${
        import.meta.env.VITE_DOMAIN_URL
      }/users-admin/api/roles/user/${userRefId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then(async response => {
        if (response.ok) {
          return await response.json();
        }
        await defineNotification({
          message: await response.text(),
          error: true,
        });
      })
      .then(async data => {
        userRoles.value = data;
      })
      .catch(async err => {
        await defineNotification({
          message: err,
          error: true,
        });
      })
      .finally(() => (isLoading.value = false));
  }

  return {
    roles,
    isLoading,
    error,
    pageables,
    userRoles,
    fetchRoles,
    fetchUserRoles,
  };
};
