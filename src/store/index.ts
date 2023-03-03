import {createStore} from 'vuex'
import apiCall from "@/utils/api"
import axios, {AxiosResponse} from "axios"
import {KeycloakUser} from "@/Users/types";

const api = axios.create()

api.interceptors.response.use((response: AxiosResponse) => {
    if (response.status === 302) {
        const currentUrl = window.location.href
        window.location.href = `${import.meta.env.VITE_APP_ROOT_AUTH}?redirect_url=${currentUrl}`
        return
    }

    return response
})

interface State {
    user: KeycloakUser | null,
    notification: {
        message: null | string,
        success: boolean,
        warning: boolean,
        error: boolean,
    }
}

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
        }
    },
    getters: {
        getNotification: (state: any) => state.notification,
    },
    mutations: {
        set_current_user(state: any, payload: KeycloakUser) {
            state.user = payload
        },
        set_notification(state: any, payload: { message: string, success?: boolean, warning?: boolean, error?: boolean }) {
            state.notification = {
                ...state.notification,
                ...payload
            }
            setTimeout(() => {
                state.notification = {
                    message: null,
                    success: false,
                    warning: false,
                    error: false,
                }
            }, 10000)
        },

    },
    actions: {
        //from all.ts
        syncUser({commit}, param) {
            return new Promise(async (resolve, reject) => {
                let response = await fetch(import.meta.env.VITE_DOMAIN_URL + `/users-admin/api/v1/roles/users/${param}/sync`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                const data = await response.json()

                if (response.status !== 200) {
                    reject(data)
                } else {
                    resolve(data)
                }
            })
        },
        syncUsers({commit}, payload) {
            return new Promise(async (resolve, reject) => {
                let response = await fetch(import.meta.env.VITE_DOMAIN_URL + "/users-admin/api/users/sync-users", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                })
                const data = await response.json()

                if (response.status !== 200) {
                    reject(data)
                } else {
                    resolve(data)
                }
            })
        },
        defineNotification({commit}, payload) {
            commit("set_notification", payload)
        },
        async userDisable({commit}, payload) {
            return new Promise(async (resolve, reject) => {
                let response = await fetch(import.meta.env.VITE_DOMAIN_URL + "/users-admin/api/v1/users", {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                })
                if (response.status === 200) {
                    const data = await response.json()
                    resolve(data)
                } else {
                    reject("User disabling failed")
                }
            })
        },
        async userEnable({commit}, payload) {
            return new Promise(async (resolve, reject) => {
                let response = await fetch(import.meta.env.VITE_DOMAIN_URL + "/users-admin/api/v1/users", {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                })
                if (response.status === 200) {
                    const data = await response.json()
                    resolve(data)
                } else {
                    reject("User enabling failed")
                }
            })
        },
        async verifyUnique({commit}, payload) {
            return new Promise(async (resolve, reject) => {
                let response = await fetch(import.meta.env.VITE_DOMAIN_URL + "/users-admin/api/v1/users/by-identifier" + payload, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                if (response.status !== 200) {
                    resolve('unique')
                }

                if (response.status === 200) {
                    const data = await response.json()
                    resolve(data)
                }
            })
        },
        logout({commit}, payload) {
            const url = import.meta.env.VITE_DOMAIN_URL + '/'
            const method = 'GET'
            return new Promise(async (resolve, reject) => {
                let response = await fetch(url, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                })
                const data = await response.json()

                if (response.status !== 200) {
                    reject(data)
                } else {
                    resolve(data)
                }
            })
        },
        getUsersRoles({}, payload: any) {
            const url = import.meta.env.VITE_DOMAIN_URL + '/users-admin/api/roles/user/' + payload
            const method = 'GET'
            return new Promise(async (resolve, reject) => {
                let response = await fetch(url, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                })
                const data = await response.json()

                if (response.status !== 200) {
                    reject(data)
                } else {
                    resolve(data)
                }
            })
        },
        passChange({}, payload: any) {
            const url = `${import.meta.env.VITE_DOMAIN_URL}/users-admin/api/users/update-password?notifyUser=${payload.notifyUser}`
            delete payload.notifyUser
            const method = 'POST'
            return new Promise(async (resolve, reject) => {
                let response = await fetch(url, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                })
                const data = await response.json()

                if (response.status !== 200) {
                    reject(data)
                } else {
                    resolve(data)
                }
            })
        },
        pinChange({}, payload: any) {
            const url = `${import.meta.env.VITE_DOMAIN_URL}/users-admin/api/v1/auth/ussd/pin?notifyUser=${payload.notifyUser}`
            delete payload.notifyUser
            return fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            }).then(response => {
                if (response.ok) {
                    return response.json()
                }
                throw new Error(response.statusText)
            })
                .catch(error => {
                    throw new Error(error)
                })
        },
        passReset({}, payload: any) {
            const url = `${import.meta.env.VITE_DOMAIN_URL}/users-admin/api/users/reset-password`
            return fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            }).then(response => {
                if (response.ok) {
                    return response.json()
                }
                throw new Error(response.statusText)
            })
                .catch(error => {
                    throw new Error(error)
                })
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
            const url: string = import.meta.env.VITE_DOMAIN_URL + "/api/roles/" + keyCloakId

            const method = 'GET'
            return new Promise(async (resolve, reject) => {
                let response = await fetch(url, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                })
                const data = await response.json()

                if (response.status !== 200) {
                    reject(data)
                } else {
                    resolve(data)
                }
            })
        },
        async postUser({}, payload: any): Promise<any> {
            try {
                const url = `${import.meta.env.VITE_DOMAIN_URL}/users-admin/api/v1/users?notifyUser=${payload.notifyUser}`
                delete payload.notifyUser
                const method = 'POST'
                let response = await fetch(url, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                })
                const data = await response.json()
                if (response.status === 200) {
                    return Promise.resolve(data)
                } else if (response.status === 201) {
                    return Promise.resolve(data)
                }
            } catch (e: any) {
                return Promise.reject(e)
            }
        },
        getUser({}, route: any): Promise<any> {
            const url: string = import.meta.env.VITE_DOMAIN_URL + "/users-admin/api/users/" + route.params.id
            const method = 'GET'
            return new Promise(async (resolve, reject) => {
                let response = await fetch(url, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                })
                const data = await response.json()

                if (response.status !== 200) {
                    reject(data)
                } else {
                    resolve(data)
                }
            })

        },
        async deleteUser({}, keycloakId): Promise<any> {
            const url: string = `${import.meta.env.VITE_DOMAIN_URL}/users-admin/api/v1/users?keycloakId=${keycloakId}&force=false`
            const requestOptions = {
                method: 'DELETE'
            }

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

            const url: string = import.meta.env.VITE_DOMAIN_URL + "/api/permissions"
            const method = 'GET'
            return new Promise(async (resolve, reject) => {
                let response = await fetch(url, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                })
                const data = await response.json()

                if (response.status !== 200) {
                    reject(data)
                } else {
                    resolve(data)
                }
            })
        },
        async createRole({}, payload: any): Promise<any> {
            const url = import.meta.env.VITE_DOMAIN_URL + '/api/roles'
            const method = 'POST'
            return new Promise(async (resolve, reject) => {
                let response = await fetch(url, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                })
                const data = await response.json()

                if (response.status !== 200) {
                    reject(data)
                } else {
                    resolve(data)
                }
            })
        },
        async updateRole({}, payload: any): Promise<any> {
            const url = import.meta.env.VITE_DOMAIN_URL + '/users-admin/api/v1/roles'
            const method = 'PUT'
            return new Promise(async (resolve, reject) => {
                let response = await fetch(url, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                })
                const data = await response.json()

                if (response.status !== 200) {
                    reject(data)
                } else {
                    resolve(data)
                }
            })
        },
        getServices({}): Promise<any> {
            const url = `${import.meta.env.VITE_DOMAIN_URL}/api/organizations/services`
            const method = 'GET'
            return new Promise(async (resolve, reject) => {
                let response = await fetch(url, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                })
                const data = await response.json()

                if (response.status !== 200) {
                    reject(data)
                } else {
                    resolve(data)
                }
            })
        },
        getRoles({}, query: string = ''): Promise<any> {
            const url = `${import.meta.env.VITE_DOMAIN_URL}/users-admin/api/roles${query}`
            const method = 'GET'
            return new Promise(async (resolve, reject) => {
                let response = await fetch(url, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                })
                const data = await response.json()

                if (response.status !== 200) {
                    reject(data)
                } else {
                    resolve(data)
                }
            })
        },
        getUsers({}, query: string = ''): Promise<any> {

            const url = `${import.meta.env.VITE_DOMAIN_URL}/users-admin/api/users${query}`
            const method = 'GET'
            return new Promise(async (resolve, reject) => {
                let response = await fetch(url, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                })
                const data = await response.json()

                if (response.status !== 200) {
                    reject(data)
                } else {
                    resolve(data)
                }
            })

        },
        async editTheUser({}, {payload, route}): Promise<any> {

            const url: string = import.meta.env.VITE_DOMAIN_URL + "/users-admin/api/v1/users"

            const method: string = 'PUT'
            return new Promise(async (resolve, reject) => {
                let response = await fetch(url, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                })
                const data = await response.json()

                if (response.status !== 200) {
                    reject(data)
                } else {
                    resolve(data)
                }
            })
        },
        syncServices({}) {
            const url = `${import.meta.env.VITE_DOMAIN_URL}/users-admin/api/organizations/services/sync`
            const method = `POST`
            return new Promise(async (resolve, reject) => {
                let response = await fetch(url, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                })
                const data = await response.json()

                if (response.status !== 200) {
                    reject(data)
                } else {
                    resolve(data)
                }
            })

        },
        syncRoles({}, payload) {
            const url = `${import.meta.env.VITE_DOMAIN_URL}/users-admin/api/roles/sync-roles`
            const method = `POST`
            return new Promise(async (resolve, reject) => {
                let response = await fetch(url, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                })
                const data = await response.json()

                if (response.status !== 200) {
                    reject(data)
                } else {
                    resolve(data)
                }
            })

        },
        assignRoles({}, {userRefId, payload}) {
            const url = `${import.meta.env.VITE_DOMAIN_URL}/users-admin/api/v1/roles/users/${userRefId}/assign`
            const method = `POST`
            return new Promise(async (resolve, reject) => {
                let response = await fetch(url, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                })
                const data = await response.json()

                if (response.status !== 200) {
                    reject(data)
                } else {
                    resolve(data)
                }
            })
        }
    }
})

export default store

