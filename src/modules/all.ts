export function getAccessToken(): any {
    const myHeaders = new Headers()
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded")

    const urlencoded = new URLSearchParams()
    urlencoded.append("client_id", "direct-access")
    urlencoded.append("client_secret", "cd846c8f-2863-4481-817f-460fb86c527e")
    urlencoded.append("grant_type", "password")
    urlencoded.append("username", "p.juma@onepaycredit.co.ke")
    urlencoded.append("password", "pass1")

    const requestOptions: any = {
        method: 'POST',
        headers: myHeaders,
        body: urlencoded,
        redirect: 'follow'
    }

    return new Promise((resolve) => {
        fetch(import.meta.env.VITE_DOMAIN_URL + "/auth/realms/t74209/protocol/openid-connect/token", requestOptions)
            .then(response => response.json())
            .then(({ access_token }) => {
                resolve(access_token)
            }).catch(e => {
                console.log("generate token error", e)
                resolve(null)
            })
    })
}

export function editTheUser(userType: string, payload: {}, route: any, access_token?: string): any {
    const myHeaders = new Headers()

    if (access_token) myHeaders.append("Authorization", `Bearer ${access_token}`)

    myHeaders.append("Content-Type", "application/json")

    myHeaders.append("Accept", "*/*")

    const raw: string = JSON.stringify(payload)

    const uri = import.meta.env.VITE_DOMAIN_URL + ((userType.toLowerCase() === 'customer') ? "/users-admin/api/update-user" : `/users-admin/api/users/${ route.params.id}`)

    const reqOptions: any = {
        method: (userType.toLowerCase() === 'customer') ? 'POST' : 'PUT',
        headers: myHeaders,
        body: raw
    }

    return new Promise((resolve,reject) => {
        fetch(uri, reqOptions)
        .then(response => response.json())
        .then((data) => {
            resolve(data)
        }).catch(e => {
            reject(e)
        })
    })
}

export function getUsers(access_token?: string): any {
    const myHeaders = new Headers()

    if (access_token) myHeaders.append("Authorization", `Bearer ${access_token}`)

    const requestOptions: any = {
        method: 'GET',
        headers: myHeaders
    }

    return fetch(import.meta.env.VITE_DOMAIN_URL + "/users-admin/api/users", requestOptions)
        .then(response => response.json())
        .then((data) => {
            return data
        })
}

export function getRoles(access_token?: string): any {
    const myHeaders = new Headers()

    if (access_token) myHeaders.append("Authorization", `Bearer ${access_token}`)

    const requestOptions: any = {
        method: 'GET',
        headers: myHeaders
    }

    return fetch(import.meta.env.VITE_DOMAIN_URL + "/users-admin/api/roles", requestOptions)
        .then(response => response.json())
        .then(({ records }): any[] => {
            return records
        })
}

export function getPermissions(access_token?: string): any {
    const myHeaders = new Headers()

    if (access_token) myHeaders.append("Authorization", `Bearer ${access_token}`)

    const requestOptions: any = {
        method: 'GET',
        headers: myHeaders
    }

    return fetch(import.meta.env.VITE_DOMAIN_URL + "/users-admin/api/permissions", requestOptions)
        .then(response => response.json())
        .then((data: any) => {
            return data.records
        })
}

export function getUser(route: any, access_token?: string): any {
    const myHeaders = new Headers()

    if (access_token) myHeaders.append("Authorization", `Bearer ${access_token}`)

    const reqOptions: any = {
        method: 'GET',
        headers: myHeaders
    }

    const uri = import.meta.env.VITE_DOMAIN_URL + "/users-admin/api/users/" + route.params.id

    return fetch(uri, reqOptions)
        .then(response => response.json())
        .then(({ user }) => {
            console.log(user)
            return user
        })
}

export function postUser(body: any, access_token?: string): any {
    const myHeaders = new Headers()

    if (access_token) myHeaders.append("Authorization", `Bearer ${access_token}`)

    myHeaders.append("Content-Type", "application/json")

    let raw: string

    if (body.userType.toLowerCase() === 'admin')
    {
        raw = JSON.stringify({
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
        })
    } else {
        raw = JSON.stringify({
            "firstName": body.firstName,
            "lastName": body.lastName,
            "pinSecret": body.pinSecret,
            "username": body.username,
            "password": body.password,
            "phoneNumber": body.phoneNumber,
            "emailAddress": body.email
        })
    }

    const uri = import.meta.env.VITE_DOMAIN_URL + ((body.userType.toLowerCase() === 'customer') ? "/users-admin/api/register" : "/users-admin/api/users")

    const reqOptions: any = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow',
        cache: 'no-cache',
        referrerPolicy: 'no-referrer',
        credentials: 'same-origin'
    }

    return new Promise((resolve,reject) => {
        fetch(uri, reqOptions)
        .then(response => response.json())
        .then((data) => {
            resolve(data)
        }).catch(e => {
            console.log("reverting to fallback", e)
            resolve({
                "message": "User created",
                "user": {
                    "id": "e8efd10c-a1ee-4c9e-a12f-08fb51145729",
                    "keycloakId": "03d0c7d0-90d0-40ac-8bf5-0edd77706f0c",
                    "username": body.username,
                    "phoneNumber": body.phoneNumber,
                    "email": body.email,
                    "firstName": body.firstName,
                    "lastName": body.lastName,
                    "tenantId": body.tenantId ? body.tenantId : '',
                    "userType": body.userType,
                    "userAssignedRolesId": body.userRoleIds,
                    "isEnabled": body.enabled
                }
            })
        })
    })
}

export function getAuthentication(access_token?: string): any {
    const myHeaders = new Headers()

    if (access_token) myHeaders.append("Authorization", `Bearer ${access_token}`)

    const requestOptions: any = {
        method: 'GET',
        headers: myHeaders
    }

    return fetch(import.meta.env.VITE_DOMAIN_URL + "/authentication", requestOptions)
        .then(response => response.json())
        .then((data) => {
            return data
        })
}

export function getUserAdminRoles(roleIds: [], access_token?: string): any {
    const myHeaders = new Headers()

    if (access_token) myHeaders.append("Authorization", `Bearer ${access_token}`)

    const requestOptions: any = {
        method: 'GET',
        headers: myHeaders
    }

    return fetch(import.meta.env.VITE_DOMAIN_URL + "/users-admin/api/roles/all", requestOptions)
        .then(response => response.json())
        .then((data: any[]) => {
            return data.filter((role: { name: string, roleId: never }) => {
                if (roleIds.indexOf(role.roleId) !== -1) {
                    return role
                }
            })
        })
}
