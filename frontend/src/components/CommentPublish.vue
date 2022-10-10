<template>
  <div class="comment">
    <avatar-user :avatar="comment.user.avatar" />
    <div>
      <div class="name">{{ comment.user.firstname }} {{ comment.user.lastname }}</div>
      <div class="content">{{ comment.content }}</div>
      <div class="footer">
        <date-time :time="comment.createdAt" />
        <a
          v-if="isEditable"
          role="button"
          @click="deleteComment"
          tabindex="2"
          aria-label="Supprimer le commentaire"
        >
          <i class="fa-solid fa-trash-can"></i>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import DateTime from '@/components/DateTime.vue';
import AvatarUser from '@/components/AvatarUser.vue';
import { mapState } from 'vuex';

export default {
  components: { DateTime, AvatarUser },
  props: {
    comment: Object,
  },
  methods: {
    deleteComment() {
      this.$emit('show-modal', {
        model: this.comment,
        callback: async () => {
          const res = await this.fetch(
            `/posts/${this.comment.postId}/comments/${this.comment.id}`,
            {
              method: 'DELETE',
            }
          );
          if (res.status === 200) this.$emit('delete-comment', this.comment);
        },
      });
    },
  },
  computed: {
    ...mapState(['user']),
    isEditable() {
      return this.comment.userId === this.user.id || this.user.isModerator;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss';
.comment {
  display: flex;
  padding: 0.7rem;
  gap: 1rem;
  &:not(:last-child) {
    border-bottom: 1px solid lighten($tertiary, 50%);
  }
  div:last-child {
    flex: 1;
  }
  .name {
    font-weight: bold;
    margin-bottom: $usePadding;
  }
  .content {
    margin-bottom: 0.5rem;
  }
  .footer {
    display: flex;
    justify-content: space-between;
  }
}
</style>
