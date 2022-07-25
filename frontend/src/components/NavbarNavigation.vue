<template>
  <nav>
    <div class="container">
      <div class="navbar">
        <logo-login type="navbar" />
        <i @click="toggleMenu" class="fa-solid fa-bars"></i>
      </div>
      <ul v-show="show" class="menu">
        <li>
          <i class="fa-solid fa-user"></i>
          Voir votre profil
        </li>
        <li>
          <i class="fa-solid fa-right-from-bracket"></i>
          Déconnexion
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
    toggleMenu() {
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
