<template>
  <div v-show="showDialog" class="dialog">
    <alert-message @hide-dialog="hideDialog" />
  </div>
</template>

<script>
import AlertMessage from "./AlertMessage.vue";
export default {
  components: { AlertMessage },
  data() {
    return {
      showDialog: false,
    };
  },
  methods: {
    hideDialog() {
      this.showDialog = false;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./src/assets/scss/_variables.scss";
.dialog {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgb($tertiary, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
