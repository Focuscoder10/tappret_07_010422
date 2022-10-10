<template>
  <main role="main">
    <alert-message ref="alert" />
  </main>
</template>

<script>
import AlertMessage from '@/components/AlertMessage.vue';
import { mapActions } from 'vuex';

export default {
  components: { AlertMessage },
  metaInfo: {
    title: 'Déconnexion',
  },
  methods: mapActions(['clearToken']),
  mounted() {
    this.clearToken();
    this.$refs.alert.show({
      mode: 'success',
      message: 'Vous êtes maintenant déconnecté',
    });
    setTimeout(() => {
      this.$router.push({ name: 'login' });
    }, 3000);
  },
};
</script>
