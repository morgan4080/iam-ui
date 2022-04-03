import { createStore } from 'vuex'
import apiCall from "@/utils/api"
import axios, {AxiosResponse} from "axios"

const api = axios.create()

api.interceptors.response.use((response:AxiosResponse) => {
    if (response.status === 302) {
        const currentUrl = window.location.href
        window.location.href = `${import.meta.env.VITE_APP_ROOT_AUTH}?redirect_url=${currentUrl}`
        return
    }

    return response
})

const store = createStore({
    state () {
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
        set_current_user(state: any, payload: object) {
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
            }, 4000)
        },

    },
    actions: {
        //from all.ts
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
        defineNotification({ commit }, payload) {
            commit("set_notification", payload)
        },
        async verifyUnique({commit}, payload) {
            return new Promise(async (resolve, reject) => {
                let response = await fetch(import.meta.env.VITE_DOMAIN_URL + "/users-admin/api/v1/users/by-identifier", {
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
        logout({ commit },payload) {
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
        getUsersRoles({ }, payload: any) {
            const url = import.meta.env.VITE_DOMAIN_URL + '/api/roles/user/'
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
        passChange({ }, payload: any) {
            const url = import.meta.env.VITE_DOMAIN_URL + '/api/users/update-password'
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
        pinChange({ }, payload: any) {
            return new Promise(async (resolve, reject) => {
                const response = await fetch(import.meta.env.VITE_DOMAIN_URL + "/users-admin/api/v1/auth/ussd/pin", {
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
        passReset({ }, payload: any) {
            const url = import.meta.env.VITE_DOMAIN_URL + '/api/users/reset-password'
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
        getRole({ }, keyCloakId: any): Promise<any> {
            const url: string = import.meta.env.VITE_DOMAIN_URL + "/api/roles/"+keyCloakId

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

            return  apiCall({ url, method, headers}, { withCredentials: true })
        },
        async postUser({}, payload: any): Promise<any> {
            try {
                const options: any = {
                    method: 'POST',
                    headers: { 'content-type': 'application/json' },
                    data: payload,
                    config: {
                        withCredentials: false
                    },
                    url: import.meta.env.VITE_DOMAIN_URL + "/users-admin/api/v1/users",
                };
                const { data } = await api(options)
                return data
            } catch (e: any) {
                alert(e.message)
            }
        },
        getUser({ }, route: any ): Promise<any> {
            const url: string = import.meta.env.VITE_DOMAIN_URL + "/users-admin/api/users/" + route.params.id

            const myHeaders = new Headers()

            myHeaders.append("Authorization", `*/*`)

            const headers = myHeaders

            const method = 'GET'

            return apiCall({ url, method, headers}, { withCredentials: true })
        },
        getPermissions({ }):  Promise<any> {

            const url: string = import.meta.env.VITE_DOMAIN_URL + "/api/permissions"

            const myHeaders = new Headers()

            myHeaders.append("Authorization", `*/*`)

            const headers = myHeaders

            const method = 'GET'

            return apiCall({ url, method, headers}, { withCredentials: true })
        },
        async createRole({ }, payload: any): Promise<any> {
            try {
                const options: any = {
                    method: 'POST',
                    headers: { 'content-type': 'application/json' },
                    data: payload,
                    config: {
                        withCredentials: false
                    },
                    url: import.meta.env.VITE_DOMAIN_URL + "/api/roles",
                };
                const { data } = await axios(options)
                return data
            } catch (e: any) {
                console.log(e.message)
            }
        },
        getServices({ }): Promise<any> {
            const url = `${import.meta.env.VITE_DOMAIN_URL}/api/organizations/services`

            const myHeaders = new Headers()

            myHeaders.append("Authorization", `*/*`)

            const headers = myHeaders

            const method = 'GET'

            return apiCall({ url, method, headers}, { withCredentials: true })
        },
        getRoles({ }): Promise<any> {
            const url = `${import.meta.env.VITE_DOMAIN_URL}/api/roles`

            const method = 'GET'

            return apiCall({ url, method }, { withCredentials: true })
        },
        getUsers({ }, query: string = ''): Promise<any> {

            const url = `${import.meta.env.VITE_DOMAIN_URL}/api/users${query}`

            const method = 'GET'

            return apiCall({ url, method }, { withCredentials: true })
        },
        async editTheUser({}, { payload, route }): Promise<any> {

            const url: string = import.meta.env.VITE_DOMAIN_URL + "/api/v1/users"

            const method: string = 'PUT'

            try {
                const options: any = {
                    method,
                    headers: { 'content-type': 'application/json' },
                    data: {
                        userRefId: route.params.id,
                        ...payload
                    },
                    config: {
                        withCredentials: false
                    },
                    url,
                };
                const { data } = await axios(options)
                return data
            } catch (e: any) {
                alert(e.message)
            }
        },
        syncServices({}) {
            const url = `${import.meta.env.VITE_DOMAIN_URL}/api/organizations/services/sync`
            const method = `POST`
            const myHeaders = new Headers()
            myHeaders.append("Authorization", `*/*`)
            const headers = myHeaders

            return apiCall({url, method, headers}, {withCredentials: true})
        },
        syncRoles({}) {
            const url = `${import.meta.env.VITE_DOMAIN_URL}/api/roles/sync-roles`
            const method = `POST`
            const myHeaders = new Headers()
            myHeaders.append("Authorization", `*/*`)
            const headers = myHeaders

            return apiCall({url, method, headers}, {withCredentials: true})
        },
        assignRoles({}, { userRefId, payload }) {
            const url = `${import.meta.env.VITE_DOMAIN_URL}/api/v1/roles/users/${userRefId}/assign`
            const method = `POST`
            const myHeaders = new Headers()
            myHeaders.append("Authorization", `*/*`)
            const headers = myHeaders

            return apiCall({url, method, data: payload, headers}, {withCredentials: true})
        }
    }
})

export default store

