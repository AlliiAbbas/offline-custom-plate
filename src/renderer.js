/**
 * This file will automatically be loaded by vite and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/process-model
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.js` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

import { createApp } from 'vue'
import { createBootstrap } from 'bootstrap-vue-next'
import App from './App.vue'
import router from './router'
import store from './store'
import './index.css'

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import { faUserSecret, faX } from '@fortawesome/free-solid-svg-icons'

/* add icons to the library */
library.add(faX)
import vSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';
const app = createApp(App)
app.use(store)
app.use(router)
app.component('font-awesome-icon', FontAwesomeIcon)

// Configure Bootstrap Vue Next
const bootstrap = createBootstrap({
  components: true,
  directives: true,
  composables: true,
  plugins: true
})
app.component('vSelect',vSelect)
app.use(bootstrap)

app.mount('#app')

console.log('👋 This message is being logged by "renderer.js", included via Vite');
