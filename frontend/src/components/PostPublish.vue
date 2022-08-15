<template>
  <div class="post-card">
    <div class="hearder-post-card">
      <div class="post-card-avatar"></div>
      <div class="title-name-post-card">
        <div class="title-post">{{ post.title }}</div>
        <div class="post-name">
          <div class="post-firstname">{{ post.author_firstname }}</div>
          <div class="post-lastname">{{ post.author_lastname }}</div>
        </div>
      </div>
    </div>
    <div v-if="post.media" class="post-card-picture">
      <img :src="mediaSrc" alt="" />
    </div>
    <div class="footer-post-card">
      <div class="text-contain">
        <span class="text-post-card">
          {{ post.content }}
        </span>
      </div>
      <div class="footer-group-icon">
        <div class="footer-left-icon">
          <i @click="addComment" class="fa-solid fa-comment-dots"></i>
          <!-- <i class="fa-solid fa-thumbs-up"></i> -->
          <like-add-to-post :post="post" />
        </div>
        <div class="footer-right-icon">
          <i class="fa-solid fa-pen"></i>
          <i class="fa-solid fa-trash-can"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LikeAddToPost from "@/components/LikeAddToPost.vue";

export default {
  components: { LikeAddToPost },
  props: {
    post: Object,
  },
  methods: {
    addComment() {
      this.$router.push({ path: `/posts/${this.post.id}/comments` });
    },
  },
  computed: {
    mediaSrc() {
      return this.$store.state.apiUrl + '/upload/' + this.post.media;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/_variables.scss";
.post-card {
  // border: 1px solid black;
  border-radius: 1rem;
  box-shadow: $secondary() 0px 4px 16px, rgba(17, 17, 26, 0.1) 0px 8px 24px,
    rgba(17, 17, 26, 0.1) 0px 16px 56px;
  .hearder-post-card {
    .title-name-post-card {
      > .title-post {
        gap: $useGap;
        padding: $usePadding;
      }
      .post-name {
        display: flex;
        gap: $useGap;
        padding: $usePadding;
      }
    }
  }
  .post-card-picture {
    display: flex;
    justify-content: center;
    > img {
      width: 100%;
    }
  }
  .footer-post-card {
    padding: $usePadding;
    // background-color: $secondary;
    .text-contain {
      > .text-post-card {
        margin: 0;
      }
    }
    .footer-group-icon {
      display: flex;
      justify-content: space-between;
      .footer-left-icon,
      .footer-right-icon {
        padding: $usePadding;
        display: flex;
        gap: 1rem;
        i {
          font-size: 1.5rem;
        }
      }
    }
  }
}
</style>
