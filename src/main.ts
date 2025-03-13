import { createApp } from 'vue'
import { createPinia } from 'pinia'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faClock,
  faArrowPointer,
  faGlobe,
  faSignsPost,
  faHome,
  faArrowRightFromBracket,
} from '@fortawesome/free-solid-svg-icons'

import { createWebHistory, createRouter } from 'vue-router'

import App from './App.vue'
import DiagramList from './views/Home.vue'
import Editor from './views/Editor.vue'
import Login from './views/Login.vue'
import { useUsersStore } from './stores/users.store'

const routes = [
  { path: '/', name: 'login', component: Login, meta: { onlyAnonymous: true } },
  { path: '/home', name: 'home', component: DiagramList, meta: { onlyAuth: true } },
  { path: '/diagram/:id', name: 'canvas', component: Editor, meta: { onlyAuth: true } },
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
library.add(faHome)
library.add(faArrowRightFromBracket)

app.component('font-awesome-icon', FontAwesomeIcon)

app.mount('#app')
