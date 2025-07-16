import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { Toaster as UiToaster } from 'vue-sonner'

import App from './App.vue'
import router from './router'
import './assets/globals.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)


app.component('UiToaster', UiToaster)

app.mount('#app')
