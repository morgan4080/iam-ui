import axios from "axios";
import apiCall from "@/utils/api";

//moved
export function syncRoles() {
  const url = `${
    import.meta.env.VITE_APP_ROOT_AUTH
  }/users-admin/api/roles/sync-roles`;
  const method = `POST`;
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `*/*`);
  const headers = myHeaders;

  return apiCall({ url, method, headers }, { withCredentials: true });
}
// lenny

// moved
export function syncServices() {
  const url = `${
    import.meta.env.VITE_APP_ROOT_AUTH
  }/users-admin/api/organizations/services/sync`;
  const method = `POST`;
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `*/*`);
  const headers = myHeaders;

  return apiCall({ url, method, headers }, { withCredentials: true });
}

//moved
export async function getRoles(query = ""): Promise<any> {
  const url = `${
    import.meta.env.VITE_APP_ROOT_AUTH
  }/users-admin/api/roles${query}`;

  const method = "GET";

  return apiCall({ url, method }, { withCredentials: true });
}
//moved
export async function getServices(): Promise<any> {
  const url = `${
    import.meta.env.VITE_APP_ROOT_AUTH
  }/users-admin/api/organizations/services`;

  const myHeaders = new Headers();

  myHeaders.append("Authorization", `*/*`);

  const headers = myHeaders;

  const method = "GET";

  return apiCall({ url, method, headers }, { withCredentials: true });
}
//moved
export async function createRole(payload: any): Promise<any> {
  return new Promise(async (resolve, reject) => {
    const response = await fetch(
      import.meta.env.VITE_APP_ROOT_AUTH + "/users-admin/api/roles",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();

    if (response.status !== 200) {
      reject(data);
    } else {
      resolve(data);
    }
  });
}
//moved
export function getPermissions(): Promise<any> {
  const url: string =
    import.meta.env.VITE_APP_ROOT_AUTH + "/users-admin/api/permissions";

  const myHeaders = new Headers();

  myHeaders.append("Authorization", `*/*`);

  const headers = myHeaders;

  const method = "GET";

  return apiCall({ url, method, headers }, { withCredentials: true });
}
//moved
export async function getRole(keyCloakId: any): Promise<any> {
  const url: string =
    import.meta.env.VITE_APP_ROOT_AUTH + "/users-admin/api/roles/" + keyCloakId;

  const headers = new Headers();

  const method = "GET";

  return apiCall({ url, method, headers }, { withCredentials: true });
}

export function logout() {
  const url = import.meta.env.VITE_APP_ROOT_AUTH + "/";
  const method = "GET";
  return apiCall({ url, method }, { withCredentials: true });
}

export function getUsersRoles(payload: any) {
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
}
