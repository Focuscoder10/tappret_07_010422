<template>
  <header class="container">
    <div @click="historyBack" @keydown="historyBack" tabindex="1" class="icon-arrow">
      <i class="fa-solid fa-angle-left"></i>
    </div>
    <h1>{{ title }}</h1>
  </header>
</template>

<script>
export default {
  props: {
    title: String,
  },
  methods: {
    historyBack(e) {
      if ((e.type === 'keydown' && e.key === 'Enter') || e.type === 'click') this.$router.back();
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/_mixins.scss';
header {
  display: flex;
  padding: 1rem;
  gap: 1rem;
  justify-content: space-between;
  align-items: center;
  &::after {
    width: 2rem;
    content: '';
  }
  .icon-arrow {
    min-width: 2rem;
    width: 2rem;
    aspect-ratio: 1/1;
    @include flex-justi-align;
    .fa-solid {
      font-size: 1.5rem;
    }
  }
  h1 {
    font-size: 1.2rem;
    margin: 0;
  }
}
</style>
