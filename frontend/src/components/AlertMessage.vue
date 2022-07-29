<template>
  <div class="alert" :class="type">
    <i class="fa-regular" :class="icon"></i>
    {{ message }}
  </div>
</template>

<script>
export default {
  props: {
    message: String,
    type: {
      type: String,
      default: "success",
    },
  },
  computed: {
    icon() {
      let classList;
      switch (this.type) {
        case "error":
          classList = "fa-circle-xmark";
          break;
        default:
          classList = "fa-circle-check";
      }
      return classList;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/_variables.scss";
.alert {
  border-radius: 0.5rem;
  margin: 1rem;
  padding: 1rem;
  box-shadow: $shadow;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  i {
    font-size: 2rem;
  }
  &.success i {
    color: green;
  }
  &.error i {
    color: red;
  }
}
</style>
