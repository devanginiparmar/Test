import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { Quasar } from 'quasar';
import iconSet from 'quasar/icon-set/bootstrap-icons';
import '@quasar/extras/bootstrap-icons/bootstrap-icons.css';
import 'quasar/dist/quasar.css';
import App from './App.vue';
import router from './router';

import './assets/css/main.css';
const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(Quasar, {
  plugins: {}, // import Quasar plugins and add here
  iconSet
  /*
    config: {
      brand: {
        // primary: '#e46262',
        // ... or all other brand colors
      },
      notify: {...}, // default set of options for Notify Quasar plugin
      loading: {...}, // default set of options for Loading Quasar plugin
      loadingBar: { ... }, // settings for LoadingBar Quasar plugin
      // ..and many more (check Installation card on each Quasar component/directive/plugin)
    }
    */
});

app.mount('#app');
