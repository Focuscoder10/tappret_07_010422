<template>
  <div class="comment">
    <div class="img-profil">
      <img src="@/assets/images/beach.png" alt="" />
    </div>
    <div class="authmsg">
      <div class="name">Morgan Tappret</div>
      <div class="msg">
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Impedit
        officia incidunt corporis consequatur voluptatum commodi soluta quaerat?
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/_variables.scss";
.comment {
  display: flex;
  padding: 0.7rem;
  gap: 1rem;
  &:not(:last-child) {
    border-bottom: 1px solid lighten($tertiary, 50%);
  }
  .authmsg {
    .name {
      font-weight: bold;
      margin-bottom: $usePadding;
    }
  }
}
</style>
