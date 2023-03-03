import {ref} from "vue";

export const useRoles = () => {
    const roles = ref()
    const userRoles = ref()
    const isLoading = ref(false);
    const error = ref<null | unknown>(null);

    async function fetchUserRoles(userRefId:string){
        isLoading.value = true;
        error.value = null;
        try {
            let response = await fetch(
                `${import.meta.env.VITE_DOMAIN_URL}/users-admin/api/roles/user/${userRefId}`,
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
            userRoles.value = data
        } catch (err) {
            error.value = err;
        } finally {
            isLoading.value = false;
        }
    }


    return {
        roles,
        isLoading,
        error,
        userRoles,
        fetchUserRoles
    }
}
