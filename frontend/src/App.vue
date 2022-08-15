<template>
  <div id="app">
    <!-- <nav-block v-if="isLoginForm()" /> -->
    <router-view />
    <footer-block />
  </div>
</template>

<script>
import FooterBlock from "./components/FooterBlock.vue";
// import NavBlock from "./components/NavBlock.vue";
export default {
  components: {
    FooterBlock,
    // NavBlock,
  },
  methods: {
    isLoginForm() {
      return this.$router.history.current["path"] !== "/register";
    },
  },
  created() {
    this.$store.commit("setToken", localStorage.getItem("token"));
  },
};
</script>

<style lang="scss">
@use "sass:math";
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
  color: inherit;
  transition: color 0.2s;
  &:hover {
    color: $primary;
  }
}

button,
input,
textarea,
select {
  outline: transparent solid 2px;
  transition: outline-color 0.2s;
  &:focus {
    outline-color: rgb($tertiary, 0.5);
  }
}

$border-size: 2px;

input,
textarea,
select {
  border: $border-size solid lighten($tertiary, 50%);
  padding: 0.7rem;
  border-radius: 0.5rem;
  &[name="password"] {
    position: relative;
  }
  &.success {
    outline-color: rgb(green, 0.5);
  }
  &.error {
    outline-color: rgb($primary, 0.5);
  }
}

.container {
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  &.with-padding {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}

.eyed {
  display: inline-block;
  position: relative;
  button {
    position: absolute;
    width: 2.5rem;
    top: $border-size;
    right: $border-size;
    bottom: $border-size;
    border-top-right-radius: 0.3rem;
    border-bottom-right-radius: 0.3rem;
    background-color: white;
    border: none;
    outline: none;
    cursor: pointer;
    i {
      transition: all 0.2s;
    }
    &:hover {
      i {
        transform: scale(1.5);
        color: $primary;
      }
    }
  }
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.img-profil {
  $size: 40px;
  height: $size;
  width: $size;
  min-width: $size;
  min-height: $size;
  border-radius: math.div($size, 2);
  overflow: hidden;
  img {
    width: 100%;
    object-fit: cover;
    height: 100%;
  }
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
  &:hover:not(:disabled) {
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
  &:disabled {
    opacity: 0.5;
  }
}
</style>
