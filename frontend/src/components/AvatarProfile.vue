<template>
  <div class="middle-img">
    <label tabindex="1" @keydown="onKeydown">
      <input @change="onChange" type="file" ref="file" :accept="types.join(',')" />
      <div class="avatar large">
        <img :src="newImg || avatar || defaultImg" alt="Avatar de l'utilisateur" />
      </div>
      <div class="btn small" aria-label="Modifier votre avatar">Changer de photo</div>
    </label>
  </div>
</template>

<script>
import defaultImg from '@/assets/images/avatar.png';
import { mapGetters, mapState } from 'vuex';

export default {
  data() {
    return {
      file: null,
      newImg: null,
      types: ['image/jpeg', 'image/png', 'image/gif'],
      defaultImg,
    };
  },
  methods: {

    // ouvre la sélection du fichier
    onKeydown(e) {
      if (e.key === 'Enter') this.$refs.file.click();
    },
    onChange() {
      if (this.$refs.file.files.length > 0) {
        const file = this.$refs.file.files[0];
        if (this.types.includes(file.type)) {
          this.file = file;
          this.newImg = URL.createObjectURL(file);
          this.$emit('avatar-change', file);
          return;
        }
      }
      this.file = null;
      this.newImg = null;
    },
  },
  computed: {
    ...mapState(['user']),
    ...mapGetters(['uploadUrl']),
    avatar() {
      return this.uploadUrl(this.user.avatar);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss';
.middle-img {
  label {
    @include flex-center-center;
    flex-direction: column;
    cursor: pointer;
  }
  .btn {
    margin-top: 0.5rem;
  }
  img {
    width: 100%;
    object-fit: cover;
    height: 100%;
  }
  input {
    display: none;
  }
}
</style>
