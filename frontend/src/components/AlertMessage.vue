<template>
  <div v-show="show" class="alert" :class="type">
    <i class="fa-regular" :class="icon"></i>
    {{ message }}
    <a role="button" class="hide" @click="hide">
      <i class="fa-solid fa-xmark"></i>
    </a>
  </div>
</template>

<script>
export default {
  props: {
    message: {
      type: String,
      default: "Message",
    },
    type: {
      type: String,
      default: "success",
    },
  },
  data() {
    return {
      show: true,
    };
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
  methods: {
    hide() {
      this.show = false;
      this.$emit("hide-dialog");
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/_variables.scss";
.alert {
  max-width: 700px;
  background-color: white;
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
  .hide {
    margin-left: 1rem;
    align-self: flex-start;
    i {
      color: $tertiary;
      font-size: 1.5em;
    }
  }
}
</style>
