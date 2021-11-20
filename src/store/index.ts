import { createStore } from 'vuex'

const store = createStore({
    state () {
        return {
            user: null
        }
    },
    mutations: {
        set_current_user(state: any, payload: object) {
            state.user = payload
        }
    },
    actions: {

    }
})

export default store

