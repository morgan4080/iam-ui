import { createApp } from 'vue'
import index from './router/'
import App from './App.vue'
import './index.css'

createApp(App)
    .use(index)
    .mount('#app')
