import axios from "axios"
import apiCall from "@/utils/api"


//moved
export function syncRoles() {
    const url = `${import.meta.env.VITE_DOMAIN_URL}/users-admin/api/roles/sync-roles`
    const method = `POST`
    const myHeaders = new Headers()
    myHeaders.append("Authorization", `*/*`)
    const headers = myHeaders

    return apiCall({url, method, headers}, {withCredentials: true})
}
// lenny
export function syncUsers() {
    const url = `${import.meta.env.VITE_DOMAIN_URL}/users-admin/api/users/sync-users`
    const method = `POST`
    const myHeaders = new Headers()
    myHeaders.append("Authorization", `*/*`)
    const headers = myHeaders

    return apiCall({url, method, headers}, {withCredentials: true})
}

// moved
export function syncServices() {
    const url = `${import.meta.env.VITE_DOMAIN_URL}/users-admin/api/organizations/services/sync`
    const method = `POST`
    const myHeaders = new Headers()
    myHeaders.append("Authorization", `*/*`)
    const headers = myHeaders

    return apiCall({url, method, headers}, {withCredentials: true})
}

// moved
export async function editTheUser(payload: {}, route: any): Promise<any> {

    const url: string = import.meta.env.VITE_DOMAIN_URL + "/users-admin/api/users/" + route.params.id

    const method: string = 'PUT'

    try {
        const options: any = {
            method,
            headers: { 'content-type': 'application/json' },
            data: payload,
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
}
//moved
export function getUsers(query: string = ''): Promise<any> {

    const url = `${import.meta.env.VITE_DOMAIN_URL}/users-admin/api/users${query}`

    const method = 'GET'

    return apiCall({ url, method }, { withCredentials: true })
}
//moved
export async function getRoles(): Promise<any> {
    const url = `${import.meta.env.VITE_DOMAIN_URL}/users-admin/api/roles`

    const method = 'GET'

    return apiCall({ url, method }, { withCredentials: true })
}
//moved
export async function getServices(): Promise<any> {
    const url = `${import.meta.env.VITE_DOMAIN_URL}/users-admin/api/organizations/services`

    const myHeaders = new Headers()

    myHeaders.append("Authorization", `*/*`)

    const headers = myHeaders

    const method = 'GET'

    return apiCall({ url, method, headers}, { withCredentials: true })
}
//moved
export async function createRole(payload: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        const response = await fetch(import.meta.env.VITE_DOMAIN_URL + "/users-admin/api/roles", {
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

}
//moved
export function getPermissions():  Promise<any> {

    const url: string = import.meta.env.VITE_DOMAIN_URL + "/users-admin/api/permissions"

    const myHeaders = new Headers()

    myHeaders.append("Authorization", `*/*`)

    const headers = myHeaders

    const method = 'GET'

    return apiCall({ url, method, headers}, { withCredentials: true })
}

export function getUser(route: any ): Promise<any> {
    const url: string = import.meta.env.VITE_DOMAIN_URL + "/users-admin/api/users/" + route.params.id

    const myHeaders = new Headers()

    myHeaders.append("Authorization", `*/*`)

    const headers = myHeaders

    const method = 'GET'

    return apiCall({ url, method, headers}, { withCredentials: true })
}
//moved
export async function postUser(payload: any): Promise<any> {
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
        const { data } = await axios(options)
        return data
    } catch (e: any) {
        alert(e.message)
    }
}

export async function getRole(keyCloakId: any): Promise<any> {
    const url: string = import.meta.env.VITE_DOMAIN_URL + "/users-admin/api/roles/"+keyCloakId

    const headers = new Headers()

    const method = 'GET'

    return  apiCall({ url, method, headers}, { withCredentials: true })
}

export function getUserAdminRoles(roleIds: [], ): Promise<any> {

    const url: string = import.meta.env.VITE_DOMAIN_URL + "/users-admin/api/roles/all"

    const myHeaders = new Headers()

    myHeaders.append("Authorization", `*/*`)

    const headers = myHeaders

    const method = 'GET'

    return new Promise((resolve, reject) => {
        apiCall({ url, method, headers}, { withCredentials: true }).then((data: any) => {
            resolve(data)
        }).catch((e: any) => {
            reject(e)
        })
    })
}

export function logout() {
    const url = import.meta.env.VITE_DOMAIN_URL + '/'
    const method = 'GET'
    return apiCall({ url, method }, { withCredentials: true })
}

export function passReset(payload: any) {
    const options: any = {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        data: payload,
        config: {
            withCredentials: false
        },
        url: import.meta.env.VITE_DOMAIN_URL + "/users-admin/api/users/reset-password",
    }
    return axios(options)
}

export function pinChange(payload: any) {
    const options: any = {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        data: payload,
        config: {
            withCredentials: false
        },
        url: import.meta.env.VITE_DOMAIN_URL + "/users-admin/api/v1/auth/ussd/pin",
    }
    return axios(options)
}

export function passChange(payload: any) {
    const options: any = {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        data: payload,
        config: {
            withCredentials: false
        },
        url: import.meta.env.VITE_DOMAIN_URL + "/users-admin/api/v1/users/update-password",
    }
    return axios(options)
}

export function getUsersRoles(payload: any) {
    const options: any = {
        method: 'GET',
        config: {
            withCredentials: false
        },
        url: import.meta.env.VITE_DOMAIN_URL + "/users-admin/api/roles/user/" + payload,
    }
    return axios(options)
}
