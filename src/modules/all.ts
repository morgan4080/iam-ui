import axios from "axios"
import apiCall from "@/utils/api";
import {rejects} from "assert";

export function syncRoles() {
    const url = `${import.meta.env.VITE_DOMAIN_URL}/users-admin/api/roles/sync-roles`
    const method = `POST`
    const myHeaders = new Headers()
    myHeaders.append("Authorization", `*/*`)
    const headers = myHeaders

    return apiCall({url, method, headers}, {withCredentials: true})
}
export function syncServices() {
    const url = `${import.meta.env.VITE_DOMAIN_URL}/users-admin/api/organizations/services/sync`
    const method = `POST`
    const myHeaders = new Headers()
    myHeaders.append("Authorization", `*/*`)
    const headers = myHeaders

    return apiCall({url, method, headers}, {withCredentials: true})
}

export function editTheUser(userType: string, payload: {}, route: any): any {

    const url = import.meta.env.VITE_DOMAIN_URL + ((userType.toLowerCase() === 'customer') ? "/users-admin/api/update-user" : `/users-admin/api/users/${ route.params.id}`)

    const myHeaders = new Headers()

    myHeaders.append("Content-Type", "application/json")

    myHeaders.append("Accept", "*!/!*")

    myHeaders.append("Authorization", `*/*`)

    const headers = myHeaders

    const method: string = (userType.toLowerCase() === 'customer') ? 'POST' : 'PUT'

    return apiCall({ url, method, headers}, { withCredentials: true })
}

export function getUsers(query: string = ''): Promise<any> {

    const url = `${import.meta.env.VITE_DOMAIN_URL}/users-admin/api/users${query}`

    const method = 'GET'

    return apiCall({ url, method }, { withCredentials: true })
}

export async function getRoles(): Promise<any> {
    const url = `${import.meta.env.VITE_DOMAIN_URL}/users-admin/api/roles`

    const method = 'GET'

    return apiCall({ url, method }, { withCredentials: true })
}

export async function getServices(): Promise<any> {
    const url = `${import.meta.env.VITE_DOMAIN_URL}/users-admin/api/organizations/services`

    const myHeaders = new Headers()

    myHeaders.append("Authorization", `*/*`)

    const headers = myHeaders

    const method = 'GET'

    return apiCall({ url, method, headers}, { withCredentials: true })
}

export async function createRole(payload: any): Promise<any> {
    try {
        const options: any = {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            data: payload,
            config: {
                withCredentials: false
            },
            url: import.meta.env.VITE_DOMAIN_URL + "/users-admin/api/roles",
        };
        const { data } = await axios(options)
        return data
    } catch (e: any) {
        console.log(e.message)
    }
}

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

export function postUser(body: any, ): any {
    const headers = new Headers()

    headers.append("Content-Type", "application/json")

    let raw: any

    if (body.userType.toLowerCase() === 'admin')
    {
        raw = {
            "firstName": body.firstName,
            "lastName": body.lastName,
            "password": body.password,
            "phoneNumber": body.phoneNumber,
            "email": body.email,
            "username": body.username,
            "userRoles": body.userRoles,
            "userRoleIds": body.userRoleIds,
            "tenantId": body.tenantId,
            "enabled": body.enabled
        }
    } else {
        raw = {
            "firstName": body.firstName,
            "lastName": body.lastName,
            "pinSecret": body.pinSecret,
            "username": body.username,
            "phoneNumber": body.phoneNumber,
            "emailAddress": body.email
        }
    }

    const method = 'POST'

    const url = import.meta.env.VITE_DOMAIN_URL + ((body.userType.toLowerCase() === 'customer') ? "/users-admin/api/register" : "/users-admin/api/users")

    return apiCall({ url, method, headers}, { withCredentials: true })
}

export function getUserAdminRoles(roleIds: [], ): Promise<any> {

    const url: string = import.meta.env.VITE_DOMAIN_URL + "/users-admin/api/roles/all"

    const myHeaders = new Headers()

    myHeaders.append("Authorization", `*/*`)

    const headers = myHeaders

    const method = 'GET'

    return new Promise((resolve, reject) => {
        apiCall({ url, method, headers}, { withCredentials: true }).then((data: any) => {
            resolve(data.filter((role: { name: string, roleId: never }) => {
                if (roleIds.indexOf(role.roleId) !== -1) {
                    return role
                }
            }))
        }).catch((e: any) => {
            reject(e)
        })
    })
}
