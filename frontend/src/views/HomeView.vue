<template>
  <main role="main">
    <div class="container-post container" @posts-refresh="$forceUpdate()">
      <post-publish
        v-for="post of posts"
        :post="post"
        :key="post.id"
        @delete-post="deletePost"
      />
    </div>
    <new-post-button />
  </main>
</template>

<script>
import NewPostButton from "@/components/NewPostButton.vue";
import PostPublish from "@/components/PostPublish.vue";

export default {
  components: { NewPostButton, PostPublish },
  data() {
    return {
      posts: [],
    };
  },
  methods: {
    deletePost(post) {
      this.posts.splice(this.posts.indexOf(post), 1);
    },
  },
  created() {
    this.fetch("/posts").then(async posts => {
      if (posts.status !== 200) {
        this.$router.push({ path: "/login" });
        return;
      }
      this.posts = await posts.json();
    });
  },
};
</script>

<style lang="scss" scoped>
.container-post {
  padding-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
