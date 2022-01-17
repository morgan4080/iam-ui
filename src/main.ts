import { createApp } from 'vue'
import router from './router/'
import store from './store/'
import App from './App.vue'
import { getAuthentication } from './modules/all'

import './index.css'

const requestOptions: any = {
    method: 'GET',
}

if (import.meta.env.DEV) {
    createApp(App)
        .use(router)
        .use(store)
        .mount('#app')
} else {
    fetch(import.meta.env.VITE_DOMAIN_URL + "/authentication", requestOptions)
        .then(response => response.json())
        .then((response: any) => {
            createApp(App)
                .use(router)
                .use(store)
                .mount('#app')
        })
        .catch((e: any) => {
            console.error(e)
            const currentUrl = window.location.href
            // console.log("authentication", `${import.meta.env.VITE_APP_ROOT_AUTH}?redirect_url=${currentUrl}`)
            // alert(`${import.meta.env.VITE_APP_ROOT_AUTH}`);

            window.location.href = `${import.meta.env.VITE_APP_ROOT_AUTH}?redirect_url=${currentUrl}`
        })
}
