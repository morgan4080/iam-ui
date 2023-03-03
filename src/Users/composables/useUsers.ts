import {onBeforeMount, reactive, ref} from "vue";
import type {EnableUserPayload, Pageables, User} from "@/Users/types";

export const useUsers = () => {
    const user = ref<User | null>(null);
    const users = ref<User[] | null>(null);
    const isLoading = ref(false);
    const error = ref<null | unknown>(null);
    const pageables = reactive({
        recordsPerPage: 10,
        totalRecords: 0,
        totalPages: 0,
        currentPage: 0,
        sort: "ASC",
        searchTerm: null,
    }) as Pageables;

    async function fetchUser(userRefId: string) {
        isLoading.value = true;
        error.value = null;
        try {
            let response = await fetch(
                `${import.meta.env.VITE_DOMAIN_URL}/users-admin/api/users/${userRefId}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            if (!response.ok) {
                throw new Error("Failed to sync users");
            }

            const data = await response.json();
            user.value = data.user;
            return data;
        } catch (err) {
            error.value = err;
        } finally {
            isLoading.value = false;
        }
    }

    async function fetchUsers(params?: string) {
        isLoading.value = true;
        error.value = null;
        const query = generateQueryParams();
        try {
            let response = await fetch(
                `${import.meta.env.VITE_DOMAIN_URL}/users-admin/api/users?${query}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            if (!response.ok) {
                throw new Error("Failed to fetch users");
            }

            const data = await response.json();
            users.value = data.records;
            pageables.totalRecords = data.totalRecords;
            pageables.totalPages = data.totalPages;
            pageables.currentPage = data.currentPage + 1;
        } catch (err) {
            error.value = err;
        } finally {
            isLoading.value = false;
        }
    }

    async function syncUser(userRefId: string) {
        isLoading.value = true;
        error.value = null;
        try {
            let response = await fetch(
                `${
                    import.meta.env.VITE_DOMAIN_URL
                }/users-admin/api/v1/roles/users/${userRefId}/sync`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            if (!response.ok) {
                throw new Error("Failed to sync users");
            }

            const data = await response.json();

            return data;
        } catch (err) {
            error.value = err;
        } finally {
            isLoading.value = false;
        }
    }

    async function enableUser(payload: EnableUserPayload) {
        isLoading.value = true;
        error.value = null;
        try {
            let response = await fetch(
                `${import.meta.env.VITE_DOMAIN_URL}/users-admin/api/v1/users`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                }
            );
            if (!response.ok) {
                throw new Error("Failed to enable users: " + response.statusText);
            }

            const data = await response.json();

            return data;
        } catch (err) {
            error.value = err;
        } finally {
            isLoading.value = false;
        }
    }

    async function disableUser(payload: EnableUserPayload) {
        isLoading.value = true;
        error.value = null;
        try {
            let response = await fetch(
                `${import.meta.env.VITE_DOMAIN_URL}/users-admin/api/v1/users`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                }
            );
            if (!response.ok) {
                throw new Error("Failed to enable users: " + response.statusText);
            }

            const data = await response.json();

            return data;
        } catch (err) {
            error.value = err;
        } finally {
            isLoading.value = false;
        }
    }

    async function deleteUser(keycloakId: string) {
        isLoading.value = true;
        error.value = null;
        try {
            let response = await fetch(
                `${import.meta.env.VITE_DOMAIN_URL}/users-admin/api/v1/users?keycloakId=${keycloakId}&force=false`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            if (!response.ok) {
                throw new Error("Failed to enable users: " + response.statusText);
            }
            const data = await response.text();
            return data;
        } catch (err) {
            error.value = err;
            throw new Error("Something went wrong")
        } finally {
            isLoading.value = false;
        }
    }

    function generateQueryParams() {
        const params = new URLSearchParams()
        params.set("pageIndex", pageables.currentPage.toString())
        params.set("pageSize", pageables.recordsPerPage.toString())
        if (pageables.searchTerm) params.set("searchTerm", pageables.searchTerm)
        params.set("sort", pageables.sort)
        params.set("order", pageables.sort)

        return params.toString();
    }

    return {
        user,
        pageables,
        users,
        isLoading,
        error,
        fetchUser,
        fetchUsers,
        deleteUser,
    };
};
