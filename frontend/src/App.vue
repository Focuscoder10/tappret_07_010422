<template>
  <div id="app" @click="onClick">
    <navbar-navigation v-if="showNav" ref="nav" />
    <router-view />
    <footer-block :button="showButton" />
  </div>
</template>

<script>
import NavbarNavigation from '@/components/NavbarNavigation.vue';
import FooterBlock from '@/components/FooterBlock.vue';
import { mapActions } from 'vuex';
export default {
  metaInfo: {
    titleTemplate: '%s - Groupomania',
  },
  components: {
    FooterBlock,
    NavbarNavigation,
  },
  data() {
    return {
      showNav: false,
      showButton: false,
    };
  },
  methods: {
    ...mapActions(['setToken']),
    checkNav(to) {
      this.showNav = !['login', 'register', 'logout'].includes(to.name);
      this.showButton = to.name === 'home';
    },

    // fonction permettant de refermer le menu déroulant si le click est à l'extérieur de la navbar
    onClick(e) {
      const { nav } = this.$refs;
      if (nav && !nav.$el.contains(e.target)) nav.closeMenu();
    },
  },
  created() {
    if (this.$route.name) this.checkNav(this.$route);
    this.setToken(localStorage.getItem('token'));
  },
  watch: {
    $route(to) {
      this.checkNav(to);
    },
  },
};
</script>

<style lang="scss">
@import '@/assets/scss';
@import '@/assets/scss/app';
</style>
