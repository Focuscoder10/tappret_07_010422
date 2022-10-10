<template>
  <div class="avatar">
    <img v-if="url" :src="url" alt="avatar de l'utilisateur" />
    <img v-else src="@/assets/images/avatar.png" alt="avatar par défaut de l'utilisateur" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  props: {
    avatar: String,
  },
  computed: {
    ...mapGetters(['uploadUrl']),
    url() {
      return this.uploadUrl(this.avatar);
    },
  },
};
</script>
