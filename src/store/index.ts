import { createStore } from 'vuex'

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
        }
    }
})

export default store

