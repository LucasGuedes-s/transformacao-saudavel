import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import "@fortawesome/fontawesome-free/css/all.css";

import { useAuthStore } from '@/store/store';

const app = createApp(App);

import { createPinia } from 'pinia'
const pinia = createPinia()
// Registre o Vue Router
app.use(router);
app.use(pinia);

const authStore = useAuthStore();
authStore.carregarDadosPersistidos();
// Monte o aplicativo no elemento com o ID "app"
app.mount('#app');