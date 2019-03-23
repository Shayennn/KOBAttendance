<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="dark" class="mb-4">
      <b-navbar-brand href="#">{{ event_name }}</b-navbar-brand>

      <b-navbar-toggle target="nav_collapse" />

      <b-collapse id="nav_collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item href="/">Check-in</b-nav-item>
          <b-nav-item-dropdown
            v-if="$auth.user.email == 'phitchawat.lu@ku.th'"
            text="Admin"
          >
            <b-dropdown-item href="#">Student Management</b-dropdown-item>
            <b-dropdown-item href="#">Attendance Management</b-dropdown-item>
            <b-dropdown-item href="#">Staff Management</b-dropdown-item>
            <b-dropdown-item href="#">2FA Management</b-dropdown-item>
            <b-dropdown-item href="#"
              >Authentication Management</b-dropdown-item
            >
          </b-nav-item-dropdown>
        </b-navbar-nav>

        <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown v-if="$auth.$state.loggedIn" right>
            <template slot="button-content"
              ><em>{{ $auth.user.name }}</em></template
            >
            <b-dropdown-item href="#">History</b-dropdown-item>
            <b-dropdown-item @click="$auth.logout()">Logout</b-dropdown-item>
          </b-nav-item-dropdown>
          <b-nav-item v-else @click="$auth.loginWith('google')"
            >Sign-in with KU</b-nav-item
          >
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
export default {
  data() {
    return {
      event_name: 'CPSKByenior2019'
    }
  }
}
</script>
