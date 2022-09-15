<template>
  <main role="main">
    <div class="container-post container" @posts-refresh="$forceUpdate()">
      <post-publish
        v-for="post of posts"
        :post="post"
        :key="post.id"
        @delete-post="deletePost"
        @show-modal="onModalShow"
      />
      <div ref="target"></div>
    </div>
    <new-post-button />
    <alert-message :full="true" ref="alert" />
  </main>
</template>

<script>
import NewPostButton from '@/components/NewPostButton.vue';
import PostPublish from '@/components/PostPublish.vue';
import AlertMessage from '@/components/AlertMessage.vue';

export default {
  metaInfo: {
    title: 'Accueil',
  },
  components: { NewPostButton, PostPublish, AlertMessage },
  data() {
    return {
      posts: [],
      page: 1,
      observer: null,
      observe: false,
    };
  },
  methods: {
    deletePost(post) {
      this.posts.splice(this.posts.indexOf(post), 1);
      this.$refs.alert.hide();
    },
    async getNextPage() {
      const search = new URLSearchParams({ page: this.page });
      const posts = await this.fetch('/posts?' + search);
      if (posts.status !== 200) {
        this.$router.push({ path: '/login' });
        return;
      }
      this.posts.push(...(await posts.json()));
      if (!this.observe) {
        this.observer.observe(this.$refs.target);
        this.observe = true;
      }
      this.page++;
    },
    async intersect(e) {
      if (e[0].isIntersecting) await this.getNextPage();
    },
    onModalShow({ post, callback }) {
      this.$refs.alert.show({
        status: 'warning',
        title: 'Confirmation',
        type: 'dialog',
        callback,
        message: `Voulez-vous supprimer '${post.title}' ?`,
      });
    },
  },
  async created() {
    this.observer = new IntersectionObserver(this.intersect, {
      root: null,
      threshold: 1,
    });
    await this.getNextPage();
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
