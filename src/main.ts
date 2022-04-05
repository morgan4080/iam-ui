import { createApp } from 'vue'
import router from './router/'
import store from './store/'
import App from './App.vue'
import apiCall from "@/utils/api"
import './index.css'

const url = `${import.meta.env.VITE_DOMAIN_URL}/authentication`

const myHeaders = new Headers()

myHeaders.append("Authorization", `*/*`)

const headers = myHeaders

const method = 'GET'

const spinner: any = document.getElementById("spinner")

if (spinner) {
    spinner.style.display = "block"
}

apiCall({ url, method, headers}, { withCredentials: true }).then((response: any): void => {
    function instantiateApp () {
        createApp(App)
            .use(router)
            .use(store)
            .mount('#app')
    }
    instantiateApp()
    store.commit('set_current_user', response)
    const loader: any = document.getElementById("loader")
    if (loader) {
        loader.style.display = "none"
    }
}).catch((e: any) => {
    const currentUrl = window.location.href
    window.location.href = `${import.meta.env.VITE_APP_ROOT_AUTH}?redirect_url=${currentUrl}`
})
