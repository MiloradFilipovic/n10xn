<script setup lang="ts">
import Logo from '@/components/toolbar/Logo.vue'
import { useUsersStore } from '@/stores/users.store'
import { Background } from '@vue-flow/background'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const usersStore = useUsersStore()

const usernameValue = ref('')
const passwordValue = ref('')
const loginError = ref(false)

const login = () => {
  const login = usersStore.login(usernameValue.value, passwordValue.value)
  if (!login) {
    loginError.value = true
  } else {
    router.push('/home')
  }
}

onMounted(() => {
  if (usersStore.isLoggedIn) {
    router.push({ name: 'home' })
  }
})
</script>

<template>
  <div :class="$style['login-view']">
    <Logo size="large" />
    <p>A less powerful, harder to pronounce but more expensive alternative to n8n</p>
    <div :class="$style['login-form']">
      <form @submit.prevent="login">
        <input v-model="usernameValue" type="text" placeholder="Username" />
        <input v-model="passwordValue" type="password" placeholder="Password" />
        <button :disabled="!usernameValue || !passwordValue" type="submit">Login</button>
      </form>
    </div>
    <div v-if="loginError" :class="$style['error']">Invalid credentials</div>
    <div :class="$style.background">
      <Background />
    </div>
  </div>
</template>

<style module lang="scss">
.background {
  z-index: -1;
}

.login-view {
  padding: 5em 1em;
  display: flex;
  flex-direction: column;
  gap: 1em;
  align-items: center;
  justify-content: center;
}

.login-form {
  padding: 1em;
  border: 1px solid $color_medium;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: #fff;

  form {
    display: flex;
    flex-direction: column;
    gap: 1em;
  }

  input {
    padding: 0.5em;
    border: 1px solid $color_medium;
    border-radius: 4px;
    color: $color_dark;
  }

  button {
    padding: 0.5em;
    border: none;
    border-radius: 4px;
    background-color: $color_primary;
    color: #fff;
    cursor: pointer;

    &:disabled {
      background-color: $color_medium;
      cursor: not-allowed;
    }
  }
}
</style>
