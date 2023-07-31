import { createApp } from "vue";
import router from "./router/";
import store from "./store/";
import App from "./App.vue";
import nProgress from "nprogress";
import "../node_modules/nprogress/nprogress.css";
import "./index.css";
import axios from "axios";
import vuetify from "./plugins/vuetify";
import { createPinia } from "pinia";
import { useAuthStore } from "@/store/auth-store";
const pinia = createPinia();

const authStore = useAuthStore(pinia);

const spinner = document.getElementById("spinner");

if (spinner) {
  spinner.style.display = "block";
}

axios.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    console.log("Intercepted", config);
    nProgress.start();
    return config;
  },
  function (error) {
    // Do something with request error
    console.error("request error", error);
    return Promise.reject(error);
  }
);

authStore
  .initialize()
  .then(response => {
    function instantiateApp() {
      createApp(App)
        .use(pinia)
        .use(router)
        .use(store)
        .use(vuetify)
        .mount("#app");
    }
    instantiateApp();
    authStore.setAuthState(response);
    store.commit("set_current_user", response);
  })
  .catch(() => {
    const currentUrl = window.location.href;
    window.location.href = `${
      import.meta.env.VITE_APP_ROOT_AUTH
    }?redirect_url=${currentUrl}`;
  });
