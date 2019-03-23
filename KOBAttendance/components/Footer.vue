<template>
  <div>
    <hr class="mt-5" />
    <footer class="mt-4" align="center">
      <p v-if="$auth.$state.loggedIn">
        <b-badge variant="primary">Current User: {{ $auth.user.name }}</b-badge>
      </p>
      <p v-else><b-badge variant="danger">Non logged-in</b-badge></p>
      <small class="text-black-50">Made by Phitchawat Lukkanathiti</small>
    </footer>
  </div>
</template>
