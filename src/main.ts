import { createApp } from 'vue'
import { createPinia } from 'pinia'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faClock, faArrowPointer, faGlobe, faSignsPost } from '@fortawesome/free-solid-svg-icons'

import { createWebHistory, createRouter } from 'vue-router'

import App from './App.vue'
import DiagramList from './views/DiagramList.vue'
import Editor from './views/Editor.vue'

const routes = [
  { path: '/', component: DiagramList },
  { path: '/diagram/:id', component: Editor },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

const app = createApp(App)

app.use(router)
app.use(createPinia())

// TODO: Move this to a separate file
library.add(faClock)
library.add(faArrowPointer)
library.add(faGlobe)
library.add(faSignsPost)

app.component('font-awesome-icon', FontAwesomeIcon)

app.mount('#app')
