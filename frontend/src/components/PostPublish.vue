<template>
  <div class="post-card">
    <div class="hearder-post-card">
      <avatar-user :avatar="post.author_avatar" />
      <div class="title-name-post-card">
        <div class="title-post">{{ post.title }}</div>
        <div class="post-name">
          {{ post.author_firstname }}
          {{ post.author_lastname }}
        </div>
      </div>
    </div>
    <div v-if="post.media" class="post-card-picture">
      <img :src="mediaSrc" alt="" />
    </div>
    <div class="text-contain">
      <span class="text-post-card">
        {{ post.content }}
      </span>
    </div>
    <div class="footer-post-card">
      <date-time :time="post.created_at" />
      <div class="footer-group-icon">
        <div class="footer-left-icon">
          <i @click="addComment" class="fa-solid fa-comment-dots"></i>
          <!-- <i class="fa-solid fa-thumbs-up"></i> -->
          <like-add-to-post :post="post" />
        </div>
        <div v-if="isEditable" class="footer-right-icon">
          <i class="fa-solid fa-pen"></i>
          <i class="fa-solid fa-trash-can"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LikeAddToPost from "@/components/LikeAddToPost.vue";
import DateTime from "@/components/DateTime.vue";
import AvatarUser from "./AvatarUser.vue";
export default {
  components: { LikeAddToPost, DateTime, AvatarUser },
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
      return this.$store.state.apiUrl + "/upload/" + this.post.media;
    },
    isEditable() {
      return (
        this.post.author_id === this.$store.state.user.id ||
        this.$store.state.user.is_moderator
      );
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/_variables.scss";
@import "@/assets/scss/_mixins.scss";

.post-card {
  // border: 1px solid black;
  border-radius: 1rem;
  box-shadow: $secondary() 0px 4px 16px, rgba(17, 17, 26, 0.1) 0px 8px 24px,
    rgba(17, 17, 26, 0.1) 0px 16px 56px;
  .hearder-post-card {
    display: flex;
    align-items: center;
    padding: $usePadding;
    gap: $useGap;

    .title-name-post-card {
      > .title-post {
        margin-bottom: 0.3rem;
        font-weight: bold;
        font-size: 1.1em;
        // gap: $useGap;
        // padding: $usePadding;
      }
      // .post-name {
      //   display: flex;
      //   gap: $useGap;
      //   padding: $usePadding;
      // }
    }
  }
  .post-card-picture {
    display: flex;
    justify-content: center;
    > img {
      width: 100%;
    }
  }.text-contain {
    padding: $usePadding;
      > .text-post-card {
        margin: 0;
      }
    }
  .footer-post-card {
    padding: $usePadding;
    background-color: lighten($tertiary, 60%);

    
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
