<template>
  <main role="main">
    <div class="container-post container" @posts-refresh="$forceUpdate()">
      <post-publish
        v-for="post of posts"
        :post="post"
        :key="post.id"
        @delete-post="deletePost"
        @show-modal="onShowModal"
      />
      <div ref="target"></div>
    </div>
    <alert-message :full="true" ref="alert" />
    <alert-message ref="error" />
  </main>
</template>

<script>
import PostPublish from '@/components/PostPublish.vue';
import AlertMessage from '@/components/AlertMessage.vue';

export default {
  metaInfo: {
    title: 'Accueil',
  },
  components: { PostPublish, AlertMessage },
  data() {
    return {
      posts: [],
      page: 1,
      observer: null,
      observe: false,
    };
  },
  methods: {

    /**
     * fonction de chargement et d'affichage de posts
     * initialisation de l'observer
     */
    async getNextPage() {
      try {
        const search = new URLSearchParams({ page: this.page });
        const res = await this.fetch(`/posts?${search}`);
        const data = await res.json();
        if (res.status !== 200) {
          this.$refs.error.show(data);
          return;
        }
        this.posts.push(...data);
        if (!this.observe) {
          this.observer.observe(this.$refs.target); 
          this.observe = true;
        }
        this.page++;
      } catch (e) {
        this.$refs.error.show(e);
      }
    },

    /**
     * intersection du viewport et de la target
     * et chargement des posts suivants
     */
    async intersect(e) {
      if (e[0].isIntersecting) await this.getNextPage();
    },
    deletePost(post) {
      this.posts.splice(this.posts.indexOf(post), 1);
      this.$refs.alert.hide();
    },

    // fonction déclanchée lors de l'intéraction avec la corbeil
    onShowModal({ model, callback }) {
      this.$refs.alert.show({
        mode: 'warning',
        title: 'Confirmation',
        type: 'dialog',
        callback,
        message: `Voulez-vous supprimer le post de '${model.user.firstname} ${model.user.lastname}' ?`,
      });
    },
  },

  // method éxcécutée lors de la création du composant
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
