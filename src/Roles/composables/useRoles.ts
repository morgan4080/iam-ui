import { reactive, ref } from "vue";
import type { Role } from "@/Roles/types";
import { Pageables } from "@/types";
import { useQueryParams } from "@/composables/useQueryParams";
import { mapActions } from "@/modules/mapStore";
import { useFetch } from "@vueuse/core";

export const useRoles = () => {
  // TODO refactor this to composable
  const { defineNotification } = mapActions();

  const roles = ref<Role[] | null>(null);
  const userRoles = ref();
  const isLoading = ref(false);
  const error = ref<null | unknown>(null);
  const errors = ref<null | unknown>(null);
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

    await generateParams();
    const url = `${import.meta.env.VITE_DOMAIN_URL}/users-admin/api/roles?${
      params.value
    }`;

    const { isFetching, error, data } = await useFetch(url).get().json();
    isLoading.value = isFetching.value;
    if (error.value) {
      errors.value = error.value;
      await defineNotification({
        message: error.value,
        error: true,
      });
    }
    roles.value = data.value.records;
    pageables.totalRecords = data.value.totalRecords;
    pageables.totalPages = data.value.totalPages;
    pageables.currentPage = data.value.currentPage + 1;
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
