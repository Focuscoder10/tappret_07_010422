<template>
  <footer role="contentinfo">
    <div v-if="button" class="actions">
      <div class="container">
        <router-link :to="{ name: 'post-create' }">
          <i class="fa-solid fa-plus"></i>
        </router-link>
      </div>
    </div>
    <nav>
      <a href="#">Mentions Légales</a>
      <a href="#">Conditions d'utilisations</a>
    </nav>
  </footer>
</template>

<script>
export default {
  props: { button: Boolean },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss';
footer {
  position: sticky;
  bottom: 0;
  pointer-events: none;
  .actions {
    .container {
      padding: 1rem;
      display: flex;
      gap: 0.5rem;
      justify-content: flex-end;
      a {
        box-shadow: $shadow;
        pointer-events: auto;
        border-radius: 1.5rem;
        background-color: $primary;
        color: white;
        padding: $usePadding;
        aspect-ratio: 1/1;
        height: 3rem;
        @include flex-center-center;
        transition: background-color 0.2s;
        &:hover {
          background-color: lighten($primary, 20%);
        }
        i {
          font-size: 2rem;
        }
      }
    }
  }
  nav {
    pointer-events: auto;
    background-color: white;
    box-shadow: 0 -0.25rem 1rem rgb(black, 0.19), 0 -0.125rem 0.5rem rgb(black, 0.23);
    display: flex;
    gap: 1rem;
    padding: 1rem;
    justify-content: center;
    flex-wrap: wrap;
    text-align: center;
  }
}
</style>
