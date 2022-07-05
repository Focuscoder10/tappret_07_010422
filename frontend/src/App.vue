<template>
  <div id="app">
    <nav-block v-if="isLoginForm()" />
    <router-view />
    <footer-block />
  </div>
</template>

<script>
import FooterBlock from "./components/FooterBlock.vue";
import NavBlock from "./components/NavBlock.vue";
export default {
  components: {
    FooterBlock,
    NavBlock,
  },
  methods: {
    isLoginForm() {
      return this.$router.history.current["path"] !== "/register";
    },
  },
};
</script>

<style lang="scss">
@import "./src/assets/scss/_variables.scss";

body {
  font-family: Lato, sans-serif;
  margin: 0;
  color: $tertiary;
}

*,
::after,
::before {
  box-sizing: border-box;
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
}

a {
  text-decoration: none;
  color: inherit;
  transition: color 0.2s;
  &:hover {
    color: $primary;
  }
}

input,
textarea,
select {
  outline: transparent solid 2px;
  transition: outline-color 0.2s;
  &:focus {
    outline-color: $primary;
  }
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.btn {
  padding: 0.5rem 1.2rem;
  background-color: darken($primary, 10%);
  border: 1px solid darken($primary, 20%);
  color: white;
  border-radius: 0.5rem;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    color: white;
    box-shadow: $shadow;
    transform: translateY(-3px);
    background-color: $primary;
  }
  &.tertiary {
    background-color: $tertiary;
    border: 1px solid darken($tertiary, 10%);
    &:hover {
      background-color: lighten($tertiary, 10%);
    }
  }
  &.small {
    padding: 0.3rem 0.8rem;
  }
}
</style>
