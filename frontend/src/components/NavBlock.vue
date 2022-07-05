<template>
  <nav>
    <router-link to="/">Home</router-link>
    <router-link to="/about">About</router-link>
    <router-link to="/register">Register</router-link>
  </nav>
</template>

<style lang="scss" scoped>
@import "./src/assets/scss/_variables.scss";
nav {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
  text-align: center;
  padding: 1rem;
  a {
    &.router-link-exact-active {
      color: $primary;
    }
  }
}
</style>