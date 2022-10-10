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
          <div class="comments">
            <router-link
              :to="{ name: 'post-view', params: { id: post.id } }"
              tabindex="2"
              aria-label="Voir les commentaires"
            >
              <i class="fa-solid fa-comment-dots"></i>
              {{ post.commentsCount }}
            </router-link>
          </div>
          <like-add-to-post :post="post" />
        </div>
        <div v-if="isEditable" class="footer-right-icon">
          <router-link
            :to="{ name: 'post-modify', params: { id: post.id } }"
            tabindex="2"
            aria-label="Modifier le post"
          >
            <i class="fa-solid fa-pen"></i>
          </router-link>
          <a role="button" @click="deletePost" tabindex="2" aria-label="Supprimer le post">
            <i class="fa-solid fa-trash-can"></i>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LikeAddToPost from '@/components/LikeAddToPost.vue';
import DateTime from '@/components/DateTime.vue';
import AvatarUser from '@/components/AvatarUser.vue';
import { mapGetters, mapState } from 'vuex';

export default {
  components: { LikeAddToPost, DateTime, AvatarUser },
  props: {
    post: Object,
  },
  methods: {
    deletePost() {
      this.$emit('show-modal', {
        model: this.post,
        callback: async () => {
          const res = await this.fetch(`/posts/${this.post.id}`, {
            method: 'DELETE',
          });
          if (res.status === 200) this.$emit('delete-post', this.post);
        },
      });
    },
  },
  computed: {
    ...mapState(['user']),
    ...mapGetters(['uploadUrl']),
    mediaSrc() {
      return this.uploadUrl(this.post.media);
    },
    isEditable() {
      return this.post.userId === this.user.id || this.user.isModerator;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss';

.post-card {
  overflow: hidden;
  transition: border-radius 0.3s;
  box-shadow: $shadow;
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
  .text-contain {
    padding: $usePadding;
    > .text-post-card {
      margin: 0;
    }
  }
  .footer-post-card {
    padding: $usePadding;
    background-color: lighten($tertiary, 60%);

    .footer-group-icon:deep {
      margin-top: 0.5rem;
      display: flex;
      justify-content: space-between;
      .footer-left-icon,
      .footer-right-icon {
        display: flex;
        gap: 0.5rem;
        a {
          display: block;
          background-color: lighten($tertiary, 50%);
          padding: 0.5rem;
          border-radius: 0.5rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.25rem;
          transition: background-color 0.2s;
          &:hover {
            background-color: lighten($primary, 50%);
          }
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
