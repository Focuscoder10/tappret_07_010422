<template>
  <div id="app">
    <navbar-navigation v-if="showNav" />
    <router-view />
    <footer-block />
  </div>
</template>

<script>
import NavbarNavigation from "@/components/NavbarNavigation.vue";
import FooterBlock from "./components/FooterBlock.vue";
export default {
  components: {
    FooterBlock,
    NavbarNavigation,
  },
  data() {
    return {
      showNav: false,
    };
  },
  methods: {
    checkNav(to) {
      this.showNav = !["login", "register"].includes(to.name);
    },
  },
  created() {
    if (this.$route.name) this.checkNav(this.$route);
    this.$store.commit("setToken", localStorage.getItem("token"));
  },
  watch: {
    $route(to) {
      this.checkNav(to);
    },
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

:focus-visible {
  outline: 0.125rem solid $primary;
  outline-offset: 0.25rem;
  border-radius: 0.25rem;
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
  &:focus {
    outline-width: 0.25rem;
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

i {
  cursor: pointer;
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
  background-color: $primary;
  border: 1px solid darken($primary, 10%);
  color: white;
  border-radius: 0.5rem;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s;
  &:hover:not(:disabled),
  &:focus:not(:disabled) {
    color: white;
    box-shadow: $shadow;
    transform: translateY(-3px);
    background-color: lighten($primary, 10%);
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
