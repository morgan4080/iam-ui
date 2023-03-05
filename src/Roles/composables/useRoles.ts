import { reactive, ref } from "vue";
import type { Role } from "@/Roles/types";
import { Pageables } from "@/types";

export const useRoles = () => {
  const roles = ref<Role | null>(null);
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
  async function fetchRoles(params?: string) {
    isLoading.value = true;
    error.value = null;
    const query = generateQueryParams();
    try {
      let response = await fetch(
        `${import.meta.env.VITE_DOMAIN_URL}/users-admin/api/roles?${query}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch roles");
      }

      const data = await response.json();
      roles.value = data.records;
      pageables.totalRecords = data.totalRecords;
      pageables.totalPages = data.totalPages;
      pageables.currentPage = data.currentPage + 1;
    } catch (err) {
      error.value = err;
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchUserRoles(userRefId: string) {
    isLoading.value = true;
    error.value = null;
    try {
      let response = await fetch(
        `${
          import.meta.env.VITE_DOMAIN_URL
        }/users-admin/api/roles/user/${userRefId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to sync users");
      }

      const data = await response.json();
      userRoles.value = data;
    } catch (err) {
      error.value = err;
    } finally {
      isLoading.value = false;
    }
  }

  function generateQueryParams() {
    const params = new URLSearchParams();
    params.set("pageIndex", pageables.currentPage.toString());
    params.set("pageSize", pageables.recordsPerPage.toString());
    if (pageables.searchTerm) params.set("searchTerm", pageables.searchTerm);
    params.set("sort", pageables.sort);
    params.set("order", pageables.sort);

    return params.toString();
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
