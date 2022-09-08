<template>
  <div tabindex="2" class="post-card">
    <div class="hearder-post-card">
      <avatar-user :avatar="post.user.avatar" />
      <div class="title-name-post-card">
        <div class="title-post">{{ post.title }}</div>
        <div class="post-name">
          {{ post.user.firstname }}
          {{ post.user.lastname }}
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
      <date-time :time="post.createdAt" />
      <div class="footer-group-icon">
        <div class="footer-left-icon">
          <div>
            <router-link
              :to="{ path: `/posts/${post.id}/comments` }"
              tabindex="2"
            >
              <i class="fa-solid fa-comment-dots"></i>
              {{ post.commentsCount }}
            </router-link>
          </div>
          <like-add-to-post tabindex="2" :post="post" />
        </div>
        <div v-if="isEditable" class="footer-right-icon">
          <router-link :to="{ name: 'posts-modify', params: { id: post.id } }">
            <i
              class="fa-solid fa-pen"
              tabindex="2"
              aria-label="icone d'édition du poste"
            ></i>
          </router-link>
          <i
            @click="deletePost"
            class="fa-solid fa-trash-can"
            tabindex="2"
            aria-label="icone de suppréssion du poste"
          ></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LikeAddToPost from "@/components/LikeAddToPost.vue";
import DateTime from "@/components/DateTime.vue";
import AvatarUser from "./AvatarUser.vue";
const scheme = /^https?:\/\//;
export default {
  components: { LikeAddToPost, DateTime, AvatarUser },
  props: {
    post: Object,
  },
  methods: {
    deletePost() {
      this.fetch("/posts/" + this.post.id, {
        method: "DELETE",
      }).then(res => {
        if (res.status === 200) this.$emit("delete-post", this.post);
      });
    },
  },
  computed: {
    mediaSrc() {
      return scheme.test(this.post.media)
        ? this.post.media
        : this.$store.state.apiUrl + "/upload/" + this.post.media;
    },
    isEditable() {
      return (
        this.post.userId === this.$store.state.user.id ||
        this.$store.state.user.isModerator
      );
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/_variables.scss";
@import "@/assets/scss/_mixins.scss";

.post-card {
  overflow: hidden;
  transition: border-radius 0.3s;
  box-shadow: 0.25rem 0.75rem 1.25rem rgb(black, 0.19),
    0 0.25rem 0.5rem rgb(black, 0.23);
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
  }
  .text-contain {
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
        a {
          text-decoration: none;
          display: block;
        }
        i {
          font-size: 1.5rem;
        }
      }
    }
  }
}

@media screen and (min-width: 700px) {
  .post-card {
    border-radius: 1rem;
  }
}
</style>
