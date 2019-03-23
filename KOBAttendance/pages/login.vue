<template>
  <div>
    <b-alert v-if="error" show variant="danger">{{ error + '' }}</b-alert>
    <b-alert v-if="$auth.$state.redirect" show>
      You have to login before accessing to
      <strong>{{ $auth.$state.redirect }}</strong>
    </b-alert>
    <b-row class="justify-content-md-center" align-h="center" align-v="center">
      <b-col class="text-center pt-4" md="4">
        <b-card title="SSO Login" bg-variant="light">
          <div v-for="s in strategies" :key="s.key" class="mb-2">
            <b-btn
              block
              :style="{ background: s.color }"
              class="login-button"
              @click="$auth.loginWith(s.key)"
              >Login with {{ s.name }}</b-btn
            >
          </div>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<style scoped>
.login-button {
  border: 0;
}
</style>

<script>
export default {
  layout: 'authen',
  middleware: ['auth'],
  data() {
    return {
      error: null
    }
  },
  computed: {
    strategies: () => [
      {
        key: 'google',
        name: 'KU Google account',
        color: '#4284f4'
      }
    ],
    redirect() {
      return (
        this.$route.query.redirect &&
        decodeURIComponent(this.$route.query.redirect)
      )
    },
    isCallback() {
      return Boolean(this.$route.query.callback)
    }
  }
}
</script>
