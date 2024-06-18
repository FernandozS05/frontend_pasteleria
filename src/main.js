import { createApp } from 'vue';
import App from './App.vue';
import Vue3Toasity from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import router from './router';

import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import "bootstrap/dist/css/bootstrap.min.css";
import store from './store/store'; 
import { Bar } from 'vue-chartjs'
import { createVuetify } from 'vuetify'
import 'vuetify/styles'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
    components,
    directives,
  })

const app = createApp(App);
app.use(vuetify);
app.use(router, Vue3Toasity, VueDatePicker);

app.use(store);
app.use(Bar);

app.mount('#app');