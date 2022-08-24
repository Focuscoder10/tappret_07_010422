<template>
  <div class="img-profil">
    <img v-if="url" :src="url" alt="avatar de l'utilisateur" />
    <img
      v-else
      src="@/assets/images/avatar.png"
      alt="avatar par défaut de l'utilisateur"
    />
  </div>
</template>

<script>
export default {
  props: {
    avatar: String,
  },
  computed: {
    url() {
      if (this.avatar) {
        return this.$store.state.apiUrl + "/upload/" + this.avatar;
      }
      return null;
    },
  },
};
</script>
