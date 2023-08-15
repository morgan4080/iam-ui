import { reactive, ref } from "vue";
import { EnableUserPayload, User } from "@/Users/types";
import { Pageables } from "@/types";
import { useQueryParams } from "@/composables/useQueryParams";
import { useFetch } from "@vueuse/core";
import { useAuthStore } from "@/store/auth-store";
import axios from "axios";
import { defineStore } from "pinia";

export const useUsers = defineStore("users", () => {
  const authStore = useAuthStore();
  const user = ref<User | null>(null);
  const users = ref<User[] | null>(null);
  const isLoading = ref(false);
  const error = ref<null | unknown>(null);
  const labels = ref<{ name: string; value: string }[]>([]);
  const pageables = reactive({
    recordsPerPage: 5,
    totalRecords: 0,
    totalPages: 0,
    currentPage: 0,
    sort: "firstName",
    order: "ASC",
    searchTerm: undefined,
    startDate: null,
    endDate: null,
    group: undefined,
    appId: undefined,
    isEnabled: undefined,
    accessType: undefined,
    keycloakRoleId: undefined,
  }) as Pageables & {
    group: string | undefined;
    appId: string | undefined;
    isEnabled: boolean | undefined;
    accessType: string | undefined;
    keycloakRoleId: string | undefined;
  };

  const { params, generateParams } = useQueryParams(pageables);

  const headers = ref([
    {
      title: "User",
      key: "user",
      align: "start",
      sortable: false,
      visible: true,
    },
    {
      title: "Username/USSD",
      key: "username",
      align: "start",
      sortable: false,
      visible: true,
    },
    {
      title: "Access",
      key: "access",
      align: "start",
      sortable: false,
      visible: true,
    },
    {
      title: "Label",
      key: "userLabel",
      align: "start",
      sortable: false,
      visible: true,
    },
    {
      title: "Status",
      key: "status",
      align: "start",
      sortable: false,
      visible: true,
    },
    {
      title: "Actions",
      key: "actions",
      align: "start",
      sortable: false,
      visible: true,
    },
  ]);

  const accessTypes = ref([
    {
      name: "Web",
      value: "WEB",
    },
    {
      name: "Mobile",
      value: "USSD",
    },
  ]);

  const statusTypes = ref([
    {
      name: "Enabled",
      value: true,
    },
    {
      name: "Disabled",
      value: false,
    },
  ]);

  const selectedLabel = ref<{ name: string; value: string } | undefined>(
    undefined
  );
  const selectedStatus = ref<{ name: string; value: boolean } | undefined>(
    undefined
  );
  const selectedAccessType = ref<{ name: string; value: string } | undefined>(
    undefined
  );

  const setLabel = (group: typeof selectedLabel.value) => {
    selectedLabel.value = group;
    pageables.group = group?.value;
  };

  const setAccessType = (access: typeof selectedAccessType.value) => {
    selectedAccessType.value = access;
    pageables.accessType = access?.value;
  };

  const setSelectedStatus = (status: typeof selectedStatus.value) => {
    selectedStatus.value = status;
    pageables.isEnabled = status?.value;
  };

  async function fetchUser(userRefId: string) {
    isLoading.value = true;
    error.value = null;
    return await fetch(
      `${
        import.meta.env.VITE_APP_ROOT_AUTH
      }/users-admin/api/users/${userRefId}`,
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
        const txt = await response.text();
        authStore.addAlerts("error", txt);
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
        authStore.addAlerts("error", err);
      })
      .finally(() => (isLoading.value = false));
  }

  async function fetchUsers() {
    isLoading.value = true;
    error.value = null;
    await generateParams();
    return await fetch(
      `${import.meta.env.VITE_APP_ROOT_AUTH}/users-admin/api/v1/users/list?${
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
          const txt = await response.text();
          authStore.addAlerts("error", txt);
          return;
        }
        const data = await response.json();
        users.value = data.records;
        pageables.totalRecords = data.totalRecords;
        pageables.totalPages = data.totalPages;
        pageables.currentPage = data.currentPage;
        return;
      })
      .catch(async err => {
        authStore.addAlerts("error", err);
      })
      .finally(() => (isLoading.value = false));
  }

  async function syncUser(userRefId: string) {
    isLoading.value = true;
    error.value = null;
    return await fetch(
      `${
        import.meta.env.VITE_APP_ROOT_AUTH
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
        const txt = await response.text();
        authStore.addAlerts("error", txt);
      })
      .catch(async err => {
        authStore.addAlerts("error", err);
      })
      .finally(() => (isLoading.value = false));
  }

  async function syncUsers() {
    isLoading.value = true;
    error.value = null;

    const payload = {
      syncAllUsers: true,
    };

    if (
      confirm(
        "You are about to synchronize users. This operation might take a while. Proceed?"
      )
    ) {
      return await fetch(
        `${
          import.meta.env.VITE_APP_ROOT_AUTH
        }/users-admin/api/users/sync-users`,
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
            const txt = await response.text();
            authStore.addAlerts("error", txt);
            return;
          }
          authStore.addAlerts("success", `Users synced successfully`);
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
      pageables.currentPage = 0;
      return fetchUsers().finally(() => (isLoading.value = false));
    }
  }

  async function enableOrDisableUser(payload: EnableUserPayload) {
    isLoading.value = true;
    error.value = null;
    return await fetch(
      `${import.meta.env.VITE_APP_ROOT_AUTH}/users-admin/api/v1/users`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );
  }

  const editUser = async (payload: any) => {
    try {
      isLoading.value = true;

      const response = await axios.put(`/users-admin/api/v1/users`, {
        ...payload,
      });

      console.log(response);

      if (response?.data?.messages[0]?.message) {
        authStore.addAlerts("success", response?.data?.messages[0]?.message);
      } else {
        authStore.addAlerts("success", "User Edited Successfully");
      }

      return response.data;
    } catch (e: any) {
      authStore.addAlerts("error", e.message);
    } finally {
      isLoading.value = false;
    }
  };

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
      `${
        import.meta.env.VITE_APP_ROOT_AUTH
      }/users-admin/api/v1/users?keycloakId=${user.keycloakId}&force=false`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then(async response => {
        if (response.ok) {
          authStore.addAlerts("error", "User deleted successfully");
          await fetchUsers();
        } else {
          const data = await response.text();
          authStore.addAlerts("error", data);
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
    const url = `${
      import.meta.env.VITE_APP_ROOT_AUTH
    }/users-admin/api/users/reset-password`;
    const { isFetching, error, data } = await useFetch(url)
      .post(payload)
      .json();
    isFetching.value = isLoading.value;
    if (data.value) {
      return data.value;
    }
    if (error.value) {
      authStore.addAlerts("error", error.value);
    }
  }

  async function verifyUnique(params: string) {
    isLoading.value = true;
    error.value = null;
    return await fetch(
      `${
        import.meta.env.VITE_APP_ROOT_AUTH
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
        authStore.addAlerts("error", err);
      })
      .finally(() => (isLoading.value = false));
  }

  const createUser = async (payload: any): Promise<any> => {
    try {
      isLoading.value = true;

      const response = await axios.post(`/users-admin/api/v1/users`, {
        ...payload,
      });

      authStore.addAlerts("success", "User Created Successfully");

      return response.data;
    } catch (e: any) {
      console.log(e);
      if (e?.response?.data?.errors[0]?.message) {
        authStore.addAlerts("error", e.response.data.errors[0].message);
      } else {
        authStore.addAlerts("error", e.message);
      }
    } finally {
      isLoading.value = false;
    }
  };

  const clearPageables = () => {
    selectedLabel.value = undefined;
    selectedStatus.value = undefined;
    selectedAccessType.value = undefined;

    pageables.recordsPerPage = 5;
    pageables.totalRecords = 0;
    pageables.totalPages = 0;
    pageables.currentPage = 0;
    pageables.sort = "firstName";
    pageables.order = "ASC";
    pageables.searchTerm = undefined;
    pageables.startDate = null;
    pageables.endDate = null;
    pageables.group = undefined;
    pageables.appId = undefined;
    pageables.isEnabled = undefined;
    pageables.accessType = undefined;
    pageables.keycloakRoleId = undefined;
  };

  const changeVisibility = (key: string) => {
    headers.value.forEach(header => {
      if (header.key === key) {
        header.visible = !header.visible;
        header.align = header.align === " d-none" ? " start" : " d-none";
      }
    });
  };

  const getLabels = async () => {
    try {
      isLoading.value = true;
      const response = await axios.get(`/users-admin/api/v1/users/labels`);
      const l: { name: string; value: string }[] = [];
      for (const [key, value] of Object.entries(response.data)) {
        l.push({
          name: `${value}`,
          value: `${key}`,
        });
      }
      labels.value = l;
    } catch (e: any) {
      authStore.addAlerts("error", e.message);
    } finally {
      isLoading.value = false;
    }
  };

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
    createUser,
    clearPageables,
    headers,
    changeVisibility,
    accessTypes,
    statusTypes,
    labels,
    setLabel,
    setSelectedStatus,
    setAccessType,
    selectedAccessType,
    selectedLabel,
    selectedStatus,
    getLabels,
  };
});
