<template>
  <transition name="fade">
    <div :class="{ backdrop: full }" v-show="visible" @click.self="hide">
      <div class="alert" :class="mode">
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
import { capitalize } from '@/assets/js';

export default {
  props: {
    full: { type: Boolean, default: false },
  },
  data() {
    return {
      title: 'Erreur',
      message: '',
      type: 'alert',
      mode: 'error',
      callback: () => {},
      visible: false,
    };
  },
  computed: {
    icon() {
      let classList;
      switch (this.mode) {
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

    // définit le contenue du modal
    show({ title, type, callback, message, mode, status }) {
      this.type = type || 'alert';
      this.callback = callback || (() => {});
      this.message = message;
      this.mode = mode || 'error';
      this.title = title || `${capitalize(this.mode)} ${status || ''}`;
      this.visible = true;
    },
    hide() {
      this.visible = false;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss';
$width: 28rem;
$gap: 0.5rem;
$icon: 2rem;
.alert {
  $modes: (
    'success': green,
    'error': red,
    'warning': orange,
  );
  max-width: $width;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: $shadow;
  margin: 1rem;
  overflow: hidden;
  > * {
    padding: $gap;
  }
  @each $name, $color in $modes {
    &.#{$name} {
      .header {
        background-color: lighten($color, 45%);
      }
      i {
        color: $color;
      }
    }
  }
  .header {
    display: flex;
    gap: $gap;
    .title {
      flex: 1;
      align-self: center;
    }
    i {
      font-size: $icon;
      max-width: $icon;
      max-height: $icon;
    }
  }
  .main {
    margin-left: $icon + $gap;
    min-height: $icon + $gap * 2;
    display: flex;
    align-items: center;
  }
  .footer {
    background: lighten($tertiary, 60%);
    display: flex;
    justify-content: flex-end;
    gap: $gap;
  }
  .hide {
    i {
      color: $tertiary;
      font-size: 1.5em;
    }
  }
}

@media screen and (min-width: $width) {
  .alert {
    margin-left: auto;
    margin-right: auto;
  }
}

.backdrop {
  z-index: 1;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgb(black, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
