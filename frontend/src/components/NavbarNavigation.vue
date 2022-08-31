<template>
  <nav role="navigation">
    <div class="container">
      <div class="navbar">
        <logo-login type="navbar" tabindex="1" />
        <i
          tabindex="1"
          @keydown="toggleMenu"
          @click="toggleMenu"
          class="fa-solid fa-bars"
        ></i>
      </div>
      <ul v-show="show" class="menu">
        <li v-if="$route.name !== 'profile'">
          <router-link tabindex="1" to="/profile">
            <i class="fa-solid fa-user"></i>
            Voir votre profil
          </router-link>
        </li>
        <li>
          <router-link tabindex="1" to="/logout">
            <i class="fa-solid fa-right-from-bracket"></i>
            Déconnexion
          </router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
import LogoLogin from "@/components/LogoLogin.vue";
export default {
  components: { LogoLogin },
  data() {
    return {
      show: false,
    };
  },
  methods: {
    toggleMenu(e) {
      if ((e.type === "keydown" && e.key === "Enter") || e.type === "click")
        this.show = !this.show;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/_variables.scss";
nav {
  // margin: 0 1rem;
  color: white;
  background-color: $primary;
  padding: $usePadding;
  padding-left: 1rem;
  padding-right: 1rem;
  .navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .fa-solid {
      font-size: 1.2rem;
    }
  }
  .menu {
    // max-height: 0;
    // overflow: hidden;
    margin: 0;
    list-style: none;
    padding: 0;
    display: flex;
    flex-direction: column;
    padding-top: $usePadding;
    gap: $useGap;
    // &.show {
    //   max-height: none;
    // }
    li > i {
      font-size: 2rem;
      width: 2rem;
      margin-right: 0.3rem;
      // margin-left: .3rem;
    }
    a {
      text-decoration: none;
      &:hover {
        color: lighten($primary, 40%);
      }
    }
  }
}
@media screen and (min-width: $bp-md) {
  .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .navbar {
      > i {
        display: none;
      }
    }
    .menu {
      flex-direction: row;
      display: flex !important;
      align-items: center;
      padding: 0;
    }
    li {
      display: inline-flex;
      align-items: center;
    }
  }
}
</style>
