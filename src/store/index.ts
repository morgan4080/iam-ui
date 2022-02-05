import { createStore } from 'vuex'
import apiCall from "@/utils/api"

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
        defineNotification({ commit }, payload) {
            commit("set_notification", payload)
        },
        async editTheUser({}, payload: { userType: string, data: {}, route: any }) {
            const { userType, data, route } = payload

            let method = userType.toLowerCase() === 'customer' ? 'POST' : 'PUT'

            let url = `${import.meta.env.VITE_DOMAIN_URL}${ userType.toLowerCase() === 'customer' ? '/users-admin/api/update-user' : '/users-admin/api/users/' + route.params.id }`

            const myHeaders = new Headers()

            myHeaders.append("Authorization", `*/*`)

            const headers = myHeaders

            try {
               return await apiCall({ url, data, method, headers})
            } catch (e: any) {
               alert(e.message)
            }
        }
    }
})

export default store

