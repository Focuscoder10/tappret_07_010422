<template>
  <div class="middle-img">
    <label>
      <input
        @change="changeFile"
        type="file"
        ref="file"
        :accept="types.join(',')"
      />
      <div class="img-profil size">
        <img :src="newImg || avatar || defaultImg" alt="" />
      </div>
      <div class="change">Changer de photo</div>
    </label>
  </div>
</template>

<script>
import defaultImg from "@/assets/images/avatar.png";
export default {
  data() {
    return {
      file: null,
      newImg: null,
      types: ["image/jpeg", "image/png", "image/gif"],
      defaultImg
    };
  },
  
  methods: {
    changeFile() {
      if (this.$refs.file.files.length > 0) {
        const file = this.$refs.file.files[0];
        if (this.types.includes(file.type)) {
          this.file = file;
          this.newImg = URL.createObjectURL(file);
          this.$emit("avatar-change", file);
          return;
        }
      }
      this.file = null;
      this.newImg = null;
    },
  },
  computed: {
    avatar() {
      const state = this.$store.state;
      if(state.user.avatar){
        return state.apiUrl + "/upload/" + state.user.avatar
      }return null;
    },
  }
};
</script>

<style lang="scss" scoped>
@use "sass:math";
@import "@/assets/scss/_variables.scss";
@import "@/assets/scss/_signinup.scss";
@import "@/assets/scss/_mixins.scss";
.middle-img {
  label{
  @include flex-justi-align;
  flex-direction: column;
  cursor: pointer;
  }
  .change {
    padding: $usePadding;
  }
  .size {
    $size: 80px;
    height: $size;
    width: $size;
    min-width: $size;
    min-height: $size;
    border-radius: math.div($size, 2);
    overflow: hidden;
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
