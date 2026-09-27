import {createApp} from 'vue';

import App from './App.vue';
import router from '@/router/router.js';

import directives from '@/shared/lib/index.js';
import components from '@/shared/ui';
import store from '@/features/posts/store/index.js';

import '@/assets/base.css';
import '@/assets/theme.css';
import '@/assets/global.css';
import '@/assets/dark-theme.css';

const app = createApp(App);


components.forEach(component => {
    app.component(component.name, component);
});

directives.forEach(directive => {
    app.directive(directive.name, directive);
});

app
    .use(router)
    .use(store)
    .mount('#app');
