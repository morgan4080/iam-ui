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

window.fetch = new Proxy(window.fetch, {
    apply(fetch, that, args: any) {
        // Forward function call to the original fetch
        const result = fetch.apply(that, args);
        // Do whatever you want with the resulting Promise
        result
            .then(response => {
                if (!response.ok) {
                    response.text().then(text => {
                        const err = new Error("HTTP status code: " + response.status);
                        err.message = text;
                        if (response.status === 401) {
                            const currentUrl = window.location.href
                            window.location.href = `${import.meta.env.VITE_APP_ROOT_AUTH}?redirect_url=${currentUrl}`
                        }
                        if (response.status >= 500 && response.status < 600) {
                            store.dispatch("defineNotification", { message: "We could not process your request due to technical issue on our end. Please try again.", error: true }).catch(e => {
                                console.log(e.message);
                            })
                        }
                        throw err;
                    });
                }
                console.log("fetch completed!", args, response);
            })
            .finally(() => {

            });

        return result;
    },
});

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
