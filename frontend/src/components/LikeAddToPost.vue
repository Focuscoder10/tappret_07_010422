<template>
  <div class="container-like" :class="classLike" @click="like" @keydown="like">
    <a><i class="fa-solid fa-thumbs-up"></i></a>
    {{ count }}
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
    like(e) {
      if ((e.type === "keydown" && e.key === "Enter") || e.type === "click");
      this.fetch(`/posts/${this.post.id}/like`, {
        method: "POST",
        body: JSON.stringify({ isLiked: !this.isLiked }),
      }).then(res => {
        if (res.status !== 200) return;
        this.isLiked = !this.isLiked;
        this.isLiked ? this.count++ : this.count--;
        // if(this.isLiked){
        //   this.count++
        // }else {
        //   this.count--
        // }
      });
    },
  },
  props: {
    post: Object,
  },
  computed: {
    classLike() {
      return this.isLiked ? "liked" : "";
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/_variables.scss";
.container-like{
  i {
    font-size: 1.5rem;
  }
  &.liked {
    color: $primary;
  }
}
</style>
