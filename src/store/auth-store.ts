import { defineStore } from "pinia";

const AUTH_URL = import.meta.env.VITE_AUTH_URL;

function generateRandomNumber(): number {
  const min = 1000000000; // Minimum 10-digit number
  const max = 9999999999; // Maximum 10-digit number
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

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

export type AlertTypes = "warning" | "error" | "success" | "info";

type Alert = {
  id: number;
  show: boolean;
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
    removeAlert(id: number): void {
      this.alerts = this.alerts.filter(alert => (alert.id = id));
    },
    setAuthPrompt(payload: boolean): void {
      this.authPrompt = payload;
    },
    async initialize(): Promise<any> {
      try {
        const response = await fetch(AUTH_URL, {
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
    setAuthState(data: User): void {
      this.user = data;
      this.isLoggedIn = true;
    },
    addAlerts(type: AlertTypes, message: string) {
      const withoutDuplicates: Set<{
        id: number;
        show: boolean;
        alertType: AlertTypes;
        alertMessage: string;
      }> = new Set();
      withoutDuplicates.add({
        id: generateRandomNumber(),
        show: true,
        alertType: type,
        alertMessage: message,
      });

      this.alerts = [...withoutDuplicates];
    },
  },
});
