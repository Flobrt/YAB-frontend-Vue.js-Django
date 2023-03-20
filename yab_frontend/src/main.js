import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// import './assets/main.css'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import '@mdi/font/css/materialdesignicons.css' // Ensure you are using css-loade


const vuetify = createVuetify({
  components,
  directives,
})


const app = createApp(App)
app.use(vuetify)
app.use(router)

app.mount('#app')

export default new Vuetify({
  icons: {
    iconfont: 'mdi', // default - only for display purposes
  },
})