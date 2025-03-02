import { createApp } from 'vue'
import { createPinia } from 'pinia'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faClock, faArrowPointer, faGlobe, faSignsPost } from '@fortawesome/free-solid-svg-icons'

import App from './App.vue'

const app = createApp(App)

app.use(createPinia())

library.add(faClock)
library.add(faArrowPointer)
library.add(faGlobe)
library.add(faSignsPost)

app.component('font-awesome-icon', FontAwesomeIcon)

app.mount('#app')
