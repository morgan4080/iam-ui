import { createStore, Store } from "vuex";
import apiCall from "@/utils/api";
import axios, { AxiosResponse } from "axios";
import { KeycloakUser } from "@/Users/types";
import { RoleUsers } from "@/types/roleTypes";
import { InjectionKey } from "vue";

/*const api = axios.create()

api.interceptors.response.use((response: AxiosResponse) => {
    if (response.status === 302) {
        const currentUrl = window.location.href
        window.location.href = `${import.meta.env.VITE_APP_ROOT_AUTH}?redirect_url=${currentUrl}`
        return
    }

    return response
})*/

// define your typings for the store state
export interface State {
  user: any | null;
  notification: {
    message: string | null;
    success: boolean;
    warning: boolean;
    error: boolean;
  };
  roleUsers: RoleUsers[];
  allUsers: RoleUsers[];
}

// define injection key
export const key: InjectionKey<Store<State>> = Symbol();

const store = createStore<State>({
  state() {
    return {
      user: null,
      notification: {
        message: null,
        success: false,
        warning: false,
        error: false,
      },
      roleUsers: [],
      allUsers: [],
    };
  },
  getters: {
    getNotification: (state: any) => state.notification,
    getRoleUsers: state => state.roleUsers,
    getAllUsers: state => state.allUsers,
  },
  mutations: {
    set_current_user(state: any, payload: KeycloakUser) {
      state.user = payload;
    },
    set_notification(
      state: any,
      payload: {
        message: string;
        success?: boolean;
        warning?: boolean;
        error?: boolean;
      }
    ) {
      state.notification = {
        ...state.notification,
        ...payload,
      };
      setTimeout(() => {
        state.notification = {
          message: null,
          success: false,
          warning: false,
          error: false,
        };
      }, 15000);
    },
    set_role_users(state, payload: RoleUsers[]) {
      state.roleUsers = payload;
    },
    set_all_users(state, payload: RoleUsers[]) {
      state.allUsers = payload;
    },
  },
  actions: {
    //from all.ts
    defineNotification({ commit }, payload) {
      commit("set_notification", payload);
    },
    logout({ commit }, payload) {
      const url = import.meta.env.VITE_DOMAIN_URL + "/";
      const method = "GET";
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
    },

    // refactored to fetchUserRoles in useRoles composables
    getUsersRoles({}, payload: any) {
      const url =
        import.meta.env.VITE_DOMAIN_URL +
        "/users-admin/api/roles/user/" +
        payload;
      const method = "GET";
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
    },

    // TODO remove this
    passChange({}, payload: any) {
      const url = `${
        import.meta.env.VITE_DOMAIN_URL
      }/users-admin/api/users/update-password?notifyUser=${payload.notifyUser}`;
      delete payload.notifyUser;
      const method = "POST";
      return new Promise(async (resolve, reject) => {
        const response = await fetch(url, {
          method: method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
        const data = await response.json();

        if (response.status !== 200) {
          reject(data);
        } else {
          resolve(data);
        }
      });
    },

    // TODO remove this
    pinChange({}, payload: any) {
      const url = `${
        import.meta.env.VITE_DOMAIN_URL
      }/users-admin/api/v1/auth/ussd/pin?notifyUser=${payload.notifyUser}`;
      delete payload.notifyUser;
      return fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
        .then(response => {
          if (response.ok) {
            return response.json();
          }
          throw new Error(response.statusText);
        })
        .catch(error => {
          throw new Error(error);
        });
    },
    /* getUserAdminRoles({ }, roleIds: []): Promise<any> {

             const url: string = import.meta.env.VITE_DOMAIN_URL + "/api/roles/all"

             const myHeaders = new Headers()

             myHeaders.append("Authorization", `*!/!*`)

             const headers = myHeaders

             const method = 'GET'

             return new Promise((resolve, reject) => {
                 apiCall({ url, method, headers}, { withCredentials: true }).then((data: any) => {
                     resolve(data)
                 }).catch((e: any) => {
                     reject(e)
                 })
             })
         },*/
    getRole({}, keyCloakId: any): Promise<any> {
      const url: string =
        import.meta.env.VITE_DOMAIN_URL + "/api/roles/" + keyCloakId;

      const method = "GET";
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
    },
    async postUser({}, payload: any): Promise<any> {
      try {
        const url = `${
          import.meta.env.VITE_DOMAIN_URL
        }/users-admin/api/v1/users?notifyUser=${payload.notifyUser}`;
        delete payload.notifyUser;
        const method = "POST";
        const response = await fetch(url, {
          method: method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
        const data = await response.json();
        if (response.status === 200) {
          return Promise.resolve(data);
        } else if (response.status === 201) {
          return Promise.resolve(data);
        }
      } catch (e: any) {
        return Promise.reject(e);
      }
    },
    getUser({}, route: any): Promise<any> {
      const url: string =
        import.meta.env.VITE_DOMAIN_URL +
        "/users-admin/api/users/" +
        route.params.id;
      const method = "GET";
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
    },
    async deleteUser({}, keycloakId): Promise<any> {
      const url = `${
        import.meta.env.VITE_DOMAIN_URL
      }/users-admin/api/v1/users?keycloakId=${keycloakId}&force=false`;
      const requestOptions = {
        method: "DELETE",
      };

      try {
        const response = await fetch(url, requestOptions);
        if (response.status === 200) {
          const data = await response.text();
          return Promise.resolve(data);
        } else {
          return Promise.reject(`${response.status}: Failed to delete user.`);
        }
      } catch (e: any) {
        console.error("delete user", e);
        return Promise.reject(e.message);
      }
    },
    getPermissions({}): Promise<any> {
      const url: string = import.meta.env.VITE_DOMAIN_URL + "/api/permissions";
      const method = "GET";
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
    },
    async createRole({}, payload: any): Promise<any> {
      const url = import.meta.env.VITE_DOMAIN_URL + "/api/roles";
      const method = "POST";
      return new Promise(async (resolve, reject) => {
        const response = await fetch(url, {
          method: method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
        const data = await response.json();

        if (response.status !== 200) {
          reject(data);
        } else {
          resolve(data);
        }
      });
    },
    async updateRole({}, payload: any): Promise<any> {
      const url = import.meta.env.VITE_DOMAIN_URL + "/users-admin/api/v1/roles";
      const method = "PUT";
      return new Promise(async (resolve, reject) => {
        const response = await fetch(url, {
          method: method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
        const data = await response.json();

        if (response.status !== 200) {
          reject(data);
        } else {
          resolve(data);
        }
      });
    },
    getServices({}): Promise<any> {
      const url = `${
        import.meta.env.VITE_DOMAIN_URL
      }/users-admin/api/organizations/services`;
      const method = "GET";
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
    },
    getRoles({}, query = ""): Promise<any> {
      const url = `${
        import.meta.env.VITE_DOMAIN_URL
      }/users-admin/api/roles${query}`;
      const method = "GET";
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
    },
    getUsers({ commit }, query = ""): Promise<any> {
      const url = `${
        import.meta.env.VITE_DOMAIN_URL
      }/users-admin/api/users${query}`;
      return new Promise((resolve, reject) => {
        fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then(response => response.json())
          .then(data => {
            if (data.records) commit("set_all_users", data.records);
            resolve(data);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    syncServices({ commit }) {
      const url = `${
        import.meta.env.VITE_DOMAIN_URL
      }/users-admin/api/organizations/services/sync`;
      const method = `POST`;
      return new Promise((resolve, reject) => {
        fetch(url, {
          method: method,
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then(response => response.json())
          .then(data => {
            resolve(data);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    syncRoles({ commit }, payload) {
      const url = `${
        import.meta.env.VITE_DOMAIN_URL
      }/users-admin/api/roles/sync-roles`;
      const method = `POST`;
      return new Promise((resolve, reject) => {
        fetch(url, {
          method: method,
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then(response => response.json())
          .then(data => {
            resolve(data);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    assignRoles({ commit }, { userRefId, payload }) {
      const url = `${
        import.meta.env.VITE_DOMAIN_URL
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
          });
      });
    },
    fetchRoleUsers({ commit }, role_id: string): Promise<any> {
      const url = `${
        import.meta.env.VITE_DOMAIN_URL
      }/users-admin/api/v2/roles/${role_id}/users`;
      const method = "GET";
      return new Promise((resolve, reject) => {
        fetch(url, {
          method: method,
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then(response => response.json())
          .then(data => {
            if (data.error) {
              reject(data);
            }
            if (data.data) commit("set_role_users", data.data);
            resolve(data);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    updateUsersInRole(
      { commit },
      { role_id, userRefIds }: { role_id: string; userRefIds: string[] }
    ) {
      const payload = {
        userRefIds,
      };

      const url = `${
        import.meta.env.VITE_DOMAIN_URL
      }/users-admin/api/v2/roles/${role_id}/users`;

      return new Promise((resolve, reject) => {
        fetch(url, {
          method: "PUT",
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
          });
      });
    },
    deleteUsersInRole(
      { commit },
      {
        role_id,
        userKeyCloakIds,
      }: { role_id: string; userKeyCloakIds: string[] }
    ) {
      const payload = {
        userKeyCloakIds,
      };

      const url = `${
        import.meta.env.VITE_DOMAIN_URL
      }/users-admin/api/v2/roles/${role_id}/users`;

      return new Promise((resolve, reject) => {
        fetch(url, {
          method: "DELETE",
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
          });
      });
    },
  },
});

export default store;
