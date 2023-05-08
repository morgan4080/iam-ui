import { reactive, Ref, ref } from "vue";
import { EditUserPayload, EnableUserPayload, User } from "@/Users/types";
import { Pageables } from "@/types";
import { mapActions } from "@/modules/mapStore";
import { useQueryParams } from "@/composables/useQueryParams";
import { useFetch } from "@vueuse/core";

export const useUsers = () => {
  const { defineNotification } = mapActions();
  const user = ref<User | null>(null);
  const users = ref<User[] | null>(null);
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

  async function fetchUser(userRefId: string) {
    isLoading.value = true;
    error.value = null;
    return await fetch(
      `${import.meta.env.VITE_DOMAIN_URL}/users-admin/api/users/${userRefId}`,
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
        user.value = {
          ...data.user,
          accessTypes: data.accessTypes,
          requiredActions: data.requiredActions,
        };
        return {
          ...data.user,
          accessTypes: data.accessTypes,
          requiredActions: data.requiredActions,
        };
      })
      .catch(async err => {
        await defineNotification({
          message: err,
          error: true,
        });
      })
      .finally(() => (isLoading.value = false));
  }

  async function fetchUsers() {
    isLoading.value = true;
    error.value = null;
    await generateParams();
    return await fetch(
      `${import.meta.env.VITE_DOMAIN_URL}/users-admin/api/users?${
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
        if (!response.ok) {
          await defineNotification({
            message: response.text(),
            error: true,
          });
          return;
        }
        const data = await response.json();
        users.value = data.records;
        pageables.totalRecords = data.totalRecords;
        pageables.totalPages = data.totalPages;
        pageables.currentPage = data.currentPage + 1;
        return;
      })
      .catch(async err => {
        await defineNotification({
          message: err,
          error: true,
        });
      })
      .finally(() => (isLoading.value = false));
  }

  async function syncUser(userRefId: string) {
    isLoading.value = true;
    error.value = null;
    return await fetch(
      `${
        import.meta.env.VITE_DOMAIN_URL
      }/users-admin/api/v1/roles/users/${userRefId}/sync`,
      {
        method: "POST",
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
      .catch(async err => {
        await defineNotification({
          message: err,
          error: true,
        });
      })
      .finally(() => (isLoading.value = false));
  }

  async function syncUsers() {
    isLoading.value = true;
    error.value = null;

    const payload = {
      syncAllUsers: true,
    };
    
    if (confirm("You are about to synchronize users. This operation might take a while. Proceed?")) {
      return await fetch(
      `${import.meta.env.VITE_DOMAIN_URL}/users-admin/api/users/sync-users`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    )
      .then(async response => {
        if (!response.ok) {
          await defineNotification({
            message: response.text(),
            error: true,
          });
          return;
        }
        await defineNotification({
          message: `Users synced successfully`,
          success: true,
        });
        pageables.currentPage = 0;
        await fetchUsers();
        return;
      })
      .catch(err => {
        error.value = err;
        throw new Error(err);
      })
      .finally(() => (isLoading.value = false));
    } else {
      return Promise.reject("Sync Process Cancelled");
    }
  }

  async function enableOrDisableUser(payload: EnableUserPayload) {
    isLoading.value = true;
    error.value = null;
    return await fetch(
      `${import.meta.env.VITE_DOMAIN_URL}/users-admin/api/v1/users`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );
  }

  async function editUser(payload: EditUserPayload) {
    isLoading.value = true;
    error.value = null;
    return await fetch(
      `${import.meta.env.VITE_DOMAIN_URL}/users-admin/api/v1/users`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    )
      .then(response => {
        if (response.ok) return response.json();
        throw new Error(response.statusText);
      })
      .catch(error => {
        error.value = error;
        throw new Error(error);
      })
      .finally(() => {
        isLoading.value = false;
      })
      .then(async response => {
        if (response.ok) {
          return await response.json();
        }
        await defineNotification({
          message: await response.text(),
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

  async function deleteUser(user: User) {
    if (
      !confirm(
        `Are you sure you want to delete ${user.firstName} ${user.lastName}`
      )
    )
      return;

    isLoading.value = true;
    error.value = null;

    await fetch(
      `${import.meta.env.VITE_DOMAIN_URL}/users-admin/api/v1/users?keycloakId=${
        user.keycloakId
      }&force=false`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then(async response => {
        if (response.ok) {
          defineNotification({
            message: "User deleted successfully",
            success: true,
          });
          await fetchUsers();
        } else {
          const data = await response.text();
          defineNotification({ message: data, error: true });
        }
      })
      .catch(error => {
        error.value = error;
        throw new Error(error);
      })
      .finally(() => {
        isLoading.value = false;
      });
  }

  async function resetWebPassword(payload: {
    username: string;
    userRefId: string;
    tenantId: string;
  }) {
    isLoading.value = true;

    const url = `${
      import.meta.env.VITE_DOMAIN_URL
    }/users-admin/api/users/reset-password`;

    const { isFetching, error, data } = await useFetch(url)
      .post(payload)
      .json();
    isFetching.value = isLoading.value;
    if (data.value) {
      return data.value;
    }
    if (error.value) {
      await defineNotification({
        message: error.value,
        error: true,
      });
    }
  }

  async function verifyUnique(params: string) {
    isLoading.value = true;
    error.value = null;
    return await fetch(
      `${
        import.meta.env.VITE_DOMAIN_URL
      }/users-admin/api/v1/users/by-identifier/${params}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then(async response => {
        if (!response.ok) return "not-unique";
        if (response.status === 204) return "unique";
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
    user,
    pageables,
    users,
    isLoading,
    error,
    syncUser,
    syncUsers,
    enableOrDisableUser,
    fetchUser,
    editUser,
    fetchUsers,
    deleteUser,
    verifyUnique,
    resetWebPassword,
  };
};
