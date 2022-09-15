<template>
  <router-link to="/posts/create" class="button-create">
    <i class="fa-solid fa-plus"></i>
  </router-link>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/_variables.scss';
@import '@/assets/scss/_mixins.scss';
.button-create {
  border-radius: 2rem;
  background-color: $primary;
  color: white;
  padding: $usePadding;
  position: fixed;
  aspect-ratio: 1/1;
  height: 48px;
  @include flex-justi-align;
  bottom: 4rem;
  right: 1rem;
  text-decoration: none;
  i {
    font-size: 2rem;
  }
}
</style>
