<template>
  <div class="like" :class="{ liked: isLiked }">
    <a role="button" tabindex="2" aria-label="Liker le post" @click="like" @keydown="like">
      <i class="fa-solid fa-thumbs-up"></i>
      {{ count }}
    </a>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isLiked: null,
      count: 0,
    };
  },
  created() {
    this.isLiked = this.post.isLiked;
    this.count = this.post.likes;
  },
  methods: {
    async like(e) {
      if ((e.type === 'keydown' && e.key === 'Enter') || e.type === 'click') {
        const isLiked = !this.isLiked;
        const res = await this.fetch(`/posts/${this.post.id}/like`, {
          method: 'POST',
          body: { isLiked },
        });
        if (res.status !== 200) return;
        this.isLiked = isLiked;
        this.count += this.isLiked ? 1 : -1;
      }
    },
  },
  props: {
    post: Object,
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss';
.like {
  i {
    font-size: 1.5rem;
  }
  a {
    display: block;
  }
  &.liked {
    color: $primary;
  }
}
</style>
