import { computed, reactive, ref } from "vue";
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
  const userRoles = ref();
  const role = ref<Role | null>(null);
  const isLoading = ref(false);
  const labels = ref<{ name: string }[]>([]);
  const serviceConfiguration = ref<ServiceConfigurationType[]>([]);
  const error = ref<null | unknown>(null);
  const errors = ref<null | unknown>(null);
  const pageables = reactive({
    recordsPerPage: 10,
    totalRecords: 0,
    totalPages: 0,
    currentPage: 0,
    sort: "ASC",
    searchTerm: undefined,
    order: "DESC",
  }) as Pageables;
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
      const l = [];
      for (const [key, value] of Object.entries(response.data)) {
        l.push({
          name: key,
        });
      }
      labels.value = l;
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
    }/users-admin/api/roles${query}`;
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
      console.log("exe");
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
      console.log("ete");
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

  const createRole = async (payload: any): Promise<void> => {
    try {
      await axios.post("/users-admin/api/roles", payload);
      authStore.addAlerts("success", "Role created successfully");
    } catch (e: any) {
      authStore.addAlerts("error", e.message);
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

  const selectedLabel = ref(null);
  const setLabel = (group: typeof selectedLabel.value) => {
    selectedLabel.value = group;
  };

  const accessTypes = ref([]);

  const selectedAccessType = ref(null);

  const setAccessType = (accessType: typeof selectedAccessType.value) => {
    selectedAccessType.value = accessType;
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
    setAccessType,
    selectedAccessType,
    accessTypes,
    selectedLabel,
    role,
    serviceConfiguration,
    getServiceConfiguration,
    getLabels,
    labels,
  };
});
