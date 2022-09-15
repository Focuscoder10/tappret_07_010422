<template>
  <transition name="fade">
    <div :class="full ? 'backdrop' : ''" v-show="visible">
      <div class="alert" :class="status">
        <div class="header">
          <i :class="icon"></i>
          <div class="title">{{ title }}</div>
          <a role="button" class="hide" @click="hide">
            <i class="fa-solid fa-xmark"></i>
          </a>
        </div>
        <div class="main">{{ message }}</div>
        <div class="footer" v-if="type === 'dialog'">
          <button type="button" class="btn small" @click="hide">Annuler</button>
          <button type="button" class="btn small" @click="callback">OK</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    full: { type: Boolean, default: false },
  },
  data() {
    return {
      title: 'Erreur',
      message: '',
      type: 'alert',
      status: 'error',
      callback: () => {},
      visible: false,
    };
  },
  computed: {
    icon() {
      let classList;
      switch (this.status) {
        case 'success':
          classList = 'fa-regular fa-circle-check';
          break;
        case 'warning':
          classList = 'fa-solid fa-circle-exclamation';
          break;
        default:
          classList = 'fa-regular fa-circle-xmark';
      }
      return classList;
    },
  },
  methods: {
    show({ title, message, status, type, callback }) {
      console.log(message, status);
      this.title = title || 'Erreur';
      this.type = type || 'alert';
      this.callback = callback || (() => {});
      this.message = message;
      this.status = status || 'error';
      this.visible = true;
    },
    hide() {
      this.visible = false;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/_variables.scss';
.alert {
  max-width: 700px;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: $shadow;
  margin: 1rem;
  overflow: hidden;
  &.success i {
    color: green;
  }
  &.error i {
    color: red;
  }
  &.warning i {
    color: orange;
  }
  > * {
    padding: 0.5rem;
  }
  .header {
    display: flex;
    gap: 1rem;
    .title {
      flex: 1;
      align-self: center;
    }
    i {
      font-size: 2rem;
    }
  }
  .footer {
    background: lighten($tertiary, 60%);
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
  }
  .hide {
    i {
      color: $tertiary;
      font-size: 1.5em;
    }
  }
}

.backdrop {
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
