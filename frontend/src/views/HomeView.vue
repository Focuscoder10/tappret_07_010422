<template>
  <main role="main">
    <navbar-navigation />
    <div class="container-post container" @posts-refresh="$forceUpdate()">
      <post-publish v-for="post of posts" :post="post" :key="post.id" />
    </div>
    <new-post-button />
  </main>
</template>

<script>
import NavbarNavigation from "@/components/NavbarNavigation.vue";
import NewPostButton from "@/components/NewPostButton.vue";
import PostPublish from "@/components/PostPublish.vue";

export default {
  components: { NavbarNavigation, NewPostButton, PostPublish },
  data() {
    return {
      posts: [],
    };
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
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
