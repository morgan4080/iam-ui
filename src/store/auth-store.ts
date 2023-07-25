import { defineStore } from "pinia";
const AUTH_URL = import.meta.env.VITE_AUTH_URL;
export interface User {
  keycloakId: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  tenantId: string;
  companyName: string;
  roles: object;
}

type AlertTypes = "warning" | "error" | "success";

type Alert = {
  alertType: AlertTypes;
  alertMessage: string;
}[];

export interface AuthState {
  isLoggedIn: boolean;
  user: null | User;
  loading: boolean;
  authPrompt: boolean;
  alerts: Alert;
}
export const useAuthStore = defineStore("auth-store", {
  state: (): AuthState => ({
    isLoggedIn: false,
    user: null,
    loading: false,
    authPrompt: false,
    alerts: [],
  }),
  getters: {
    getLoggedInState(state) {
      return state.isLoggedIn;
    },
    getAuthPrompt(state): boolean {
      return state.authPrompt as boolean;
    },
    showAlerts(state) {
      return state.alerts.length > 0;
    },
    getAlerts(state): Alert {
      return state.alerts;
    },
    getLoggedInUser(state): null | User {
      return state.user;
    },
    getLoadingState(state) {
      return state.loading;
    },
  },
  actions: {
    setLoading(payload: boolean): void {
      this.loading = payload;
    },
    setAuthPrompt(payload: boolean): void {
      this.authPrompt = payload;
    },
    async initialize(): Promise<any> {
      const url = AUTH_URL;
      try {
        const response = await fetch(url, {
          method: "GET",
          credentials: "include",
        });

        if (response.status === 200) {
          return response.json();
        } else {
          throw new Error("User Auth Error " + response.status);
        }
      } catch (e: any) {
        return Promise.reject(e.message);
      }
    },
    setAuthState(data: any): void {
      this.user = data;
      this.isLoggedIn = true;
    },
    addAlerts(type: AlertTypes, message: string) {
      const withoutDuplicates: Set<{
        alertType: AlertTypes;
        alertMessage: string;
      }> = new Set();
      withoutDuplicates.add({
        alertType: type,
        alertMessage: message,
      });

      this.alerts = [...withoutDuplicates];

      // .shift()
      setInterval(() => {
        // this.alerts.shift();
      }, 2000);
    },
  },
});
