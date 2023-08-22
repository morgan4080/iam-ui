import { reactive, ref } from "vue";
import type { Role, ServiceConfigurationType } from "@/Roles/types";
import { Pageables } from "@/types";
import { useQueryParams } from "@/composables/useQueryParams";
import { useAuthStore } from "@/store/auth-store";
import axios from "axios";
import apiCall from "@/utils/api";
import { defineStore } from "pinia";

export const useRoles = defineStore("roles", () => {
  const authStore = useAuthStore();
  const roles = ref<Role[]>([]);
  const selectedPermissions = ref<string[]>([]);
  const applications = ref<{ name: string; value: string }[]>([]);
  const userRoles = ref();
  const role = ref<Role | null>(null);
  const isLoading = ref(false);
  const labels = ref<{ name: string; value: string }[]>([]);
  const serviceConfiguration = ref<ServiceConfigurationType[]>([]);
  const error = ref<null | unknown>(null);
  const pageables = reactive({
    recordsPerPage: 5,
    totalRecords: 0,
    totalPages: 0,
    currentPage: 0,
    sort: "ASC",
    searchTerm: undefined,
    order: "ASC",
    group: undefined,
    appId: undefined,
  }) as Pageables & { group: string | undefined; appId: string | undefined };
  const { params, generateParams } = useQueryParams(pageables);

  const fetchRoles = async () => {
    try {
      isLoading.value = true;
      await generateParams();
      const response = await axios.get(
        `/users-admin/api/permissions/roles?${params.value}`
      );
      roles.value = response.data.records;
      pageables.totalRecords = response.data.totalRecords;
      pageables.totalPages = response.data.totalPages;
      pageables.currentPage = response.data.currentPage;
      isLoading.value = false;
    } catch (e: any) {
      authStore.addAlerts("error", e.message);
    } finally {
      isLoading.value = false;
    }
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

  const getApplications = async () => {
    try {
      isLoading.value = true;
      const response = await axios.get(
        `/users-admin/api/permissions/applications`
      );
      const apps: { name: string; value: string }[] = [];
      for (const [key, value] of Object.entries(response.data)) {
        apps.push({
          name: `${value}`,
          value: `${key}`,
        });
      }
      applications.value = apps;
    } catch (e: any) {
      authStore.addAlerts("error", e.message);
    } finally {
      isLoading.value = false;
    }
  };

  const createRole = async (
    payload: Pick<
      Role,
      "name" | "permissions" | "groupName" | "description"
    > & { parentRoleIds: string[]; permissions: string[] }
  ) => {
    try {
      isLoading.value = true;

      const response = await axios.post(`/users-admin/api/permissions/roles`, {
        ...payload,
      });

      console.log(response);

      authStore.addAlerts("success", "Role Created Successfully");
    } catch (e: any) {
      authStore.addAlerts("error", e.message);
    } finally {
      isLoading.value = false;
    }
  };

  const emptySelectedPermissions = () => {
    selectedPermissions.value = [];
  };

  const updateRole = async (
    payload: Pick<Role, "id" | "name" | "groupName" | "description"> & {
      permissions: string[];
    }
  ) => {
    try {
      isLoading.value = true;

      const response = await axios.put(`/users-admin/api/permissions/roles`, {
        ...payload,
      });

      response.data.messages.map((message: { message: string }) => {
        authStore.addAlerts("success", message.message);
      });
    } catch (e: any) {
      authStore.addAlerts("error", e.message);
    } finally {
      isLoading.value = false;
    }
  };

  async function fetchUserRoles(userRefId: string) {
    isLoading.value = true;
    error.value = null;
    return await fetch(
      `${
        import.meta.env.VITE_APP_ROOT_AUTH
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
        const text = await response.text();
        authStore.addAlerts("error", text);
      })
      .then(async data => {
        userRoles.value = data;
      })
      .catch(async err => {
        authStore.addAlerts("error", err);
      })
      .finally(() => (isLoading.value = false));
  }
  const assignRoles = ({ userRefId, payload }: any) => {
    isLoading.value = true;
    const url = `${
      import.meta.env.VITE_APP_ROOT_AUTH
    }/users-admin/api/v1/roles/users/${userRefId}/assign`;
    const method = `POST`;
    return new Promise((resolve, reject) => {
      fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
        .then(response => response.json())
        .then(data => {
          if (data.error) {
            reject(data);
          }
          resolve(data);
        })
        .catch(error => {
          reject(error);
        })
        .finally(() => (isLoading.value = false));
    });
  };

  const getRoles = (query = ""): Promise<any> => {
    const url = `${
      import.meta.env.VITE_APP_ROOT_AUTH
    }/users-admin/api/permissions/roles${query}`;
    const method = "GET";
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();

      if (response.status !== 200) {
        reject(data);
      } else {
        resolve(data);
      }
    });
  };

  const getUsersRoles = (payload: any) => {
    const options: any = {
      method: "GET",
      config: {
        withCredentials: false,
      },
      url:
        import.meta.env.VITE_APP_ROOT_AUTH +
        "/users-admin/api/roles/user/" +
        payload,
    };
    return axios(options);
  };

  const getRole = async (id: string): Promise<void> => {
    try {
      selectedPermissions.value = [];
      isLoading.value = true;
      await generateParams();
      const response = await axios.get(
        `/users-admin/api/permissions/roles/${id}`
      );
      role.value = response.data;
      for (const [key, value] of Object.entries(response.data.permissions)) {
        selectedPermissions.value.push(key);
      }
      await getServiceConfiguration();
    } catch (e: any) {
      authStore.addAlerts("error", e.message);
    } finally {
      isLoading.value = false;
    }
  };

  const getServiceConfiguration = async (): Promise<void> => {
    try {
      serviceConfiguration.value = [];
      isLoading.value = true;
      await generateParams();
      const response = await axios.get(`/users-admin/api/v1/service-config`);
      const data: ServiceConfigurationType[] = response.data;
      serviceConfiguration.value = data.map(config => {
        return {
          ...config,
          selected: true,
          resources: config.resources.map(resource => {
            return {
              ...resource,
              selected: false,
              show: true,
              permissions: resource.permissions.map(permission => {
                return {
                  ...permission,
                  selected:
                    selectedPermissions.value.indexOf(permission.id) !== -1,
                };
              }),
            };
          }),
        };
      });
    } catch (e: any) {
      authStore.addAlerts("error", e.message);
    } finally {
      isLoading.value = false;
    }
  };

  const getServices = (): Promise<any> => {
    const url = `${
      import.meta.env.VITE_APP_ROOT_AUTH
    }/users-admin/api/organizations/services`;

    const myHeaders = new Headers();

    myHeaders.append("Authorization", `*/*`);

    const headers = myHeaders;

    const method = "GET";

    return apiCall({ url, method, headers }, { withCredentials: true });
  };

  const syncRoles = () => {
    const url = `${
      import.meta.env.VITE_APP_ROOT_AUTH
    }/users-admin/api/roles/sync-roles`;
    const method = `POST`;
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `*/*`);
    const headers = myHeaders;

    return apiCall({ url, method, headers }, { withCredentials: true });
  };

  const syncServices = () => {
    const url = `${
      import.meta.env.VITE_APP_ROOT_AUTH
    }/users-admin/api/organizations/services/sync`;
    const method = `POST`;
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `*/*`);
    const headers = myHeaders;

    return apiCall({ url, method, headers }, { withCredentials: true });
  };

  const headers = ref([
    {
      title: "Role Name",
      key: "name",
      align: "start",
      sortable: false,
      visible: true,
    },
    {
      title: "Description",
      key: "description",
      align: "start",
      sortable: false,
      visible: true,
    },
    {
      title: "Group",
      key: "groupName",
      align: "start",
      sortable: false,
      visible: true,
    },
    {
      title: "App Access",
      key: "services",
      align: "start",
      sortable: false,
      visible: true,
    },
    {
      title: "Users",
      key: "userCount",
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

  const changeVisibility = (key: string) => {
    headers.value.forEach(header => {
      if (header.key === key) {
        header.visible = !header.visible;
        header.align = header.align === " d-none" ? " start" : " d-none";
      }
    });
  };

  const selectedLabel = ref<{ name: string; value: string } | undefined>(
    undefined
  );
  const setLabel = (group: typeof selectedLabel.value) => {
    selectedLabel.value = group;
    pageables.group = group?.value;
  };

  const selectedApplication = ref<{ name: string; value: string } | undefined>(
    undefined
  );

  const setApplicationType = (
    applicationType: typeof selectedApplication.value
  ) => {
    selectedApplication.value = applicationType;
    pageables.appId = applicationType?.value;
  };

  const clearPageables = () => {
    selectedApplication.value = undefined;
    selectedLabel.value = undefined;

    pageables.recordsPerPage = 5;
    pageables.totalRecords = 0;
    pageables.totalPages = 0;
    pageables.currentPage = 0;
    pageables.sort = "ASC";
    pageables.searchTerm = undefined;
    pageables.order = "ASC";
    pageables.group = undefined;
    pageables.appId = undefined;
  };

  return {
    roles,
    isLoading,
    error,
    pageables,
    userRoles,
    fetchRoles,
    fetchUserRoles,
    assign: assignRoles,
    getRoles,
    getUsersRoles,
    getRole,
    createRole,
    getServices,
    syncRoles,
    syncServices,
    headers,
    changeVisibility,
    setLabel,
    setApplicationType,
    selectedApplication,
    selectedLabel,
    role,
    serviceConfiguration,
    getServiceConfiguration,
    getLabels,
    labels,
    updateRole,
    emptySelectedPermissions,
    getApplications,
    applications,
    clearPageables,
  };
});
