<template>
  <time :title="absoluteTime" :datetime="absoluteTime">
    {{ relativedDate }}
  </time>
</template>

<script>
export default {
  props: {
    time: String,
  },

  computed: {
    myMoment() {
      return this.moment(this.time);
    },
    relativedDate() {
      return this.myMoment.fromNow();
    },
    absoluteTime() {
      return this.myMoment.format("dddd d MMMM, à H:mm");
    },
  },
};
</script>
