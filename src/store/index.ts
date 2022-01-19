import { createStore } from 'vuex'

const store = createStore({
    state () {
        return {
            user: null,
            notification: null,
        }
    },
    getters: {
        getNotification: (state: any) => state.notification,
    },
    mutations: {
        set_current_user(state: any, payload: object) {
            state.user = payload
        },
        set_notification(state: any, payload: string) {
            state.notification = payload
            setTimeout(() => {
                state.notification = null
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

