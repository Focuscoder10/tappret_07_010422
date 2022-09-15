<template>
  <nav ref="nav" role="navigation">
    <div class="container">
      <div class="navbar">
        <logo-login type="navbar" tabindex="1" />
        <i tabindex="1" @keydown="toggleMenu" @click="toggleMenu" class="fa-solid fa-bars"></i>
      </div>
      <transition name="height">
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
      </transition>
    </div>
  </nav>
</template>

<script>
import LogoLogin from '@/components/LogoLogin.vue';
export default {
  components: { LogoLogin },
  data() {
    return {
      show: false,
    };
  },
  methods: {
    toggleMenu(e) {
      if ((e.type === 'keydown' && e.key === 'Enter') || e.type === 'click') this.show = !this.show;
    },
    closeMenu() {
      this.show = false;
    },
  },
  watch: {
    $route() {
      this.show = false;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/_variables.scss';

:focus-visible {
  outline-color: white;
}

nav {
  position: fixed;
  width: 100%;
  top: 0;
  box-shadow: 0 0.25rem 1rem rgb(black, 0.19), 0 0.125rem 0.5rem rgb(black, 0.23);
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
    margin: 0;
    list-style: none;
    padding: 0;
    display: flex;
    flex-direction: column;
    padding-top: $usePadding;
    gap: $useGap;
    li > i {
      font-size: 2rem;
      width: 2rem;
      margin-right: 0.3rem;
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

.height-enter-active,
.height-leave-active {
  transition: all 0.2s;
  max-height: 6rem;
}
.height-enter,
.height-leave-to {
  opacity: 0;
  max-height: 0;
}
</style>
