<template>
  <div class="comment">
    <div class="img-profil">
      <avatar-user :avatar="comment.author_avatar"/>
    </div>
    <div class="authmsg">
      <div class="name">{{ comment.author_firstname }} {{ comment.author_lastname }}</div>
      <div class="msg">{{ comment.content }}</div>
      <date-time :time="comment.created_at"/>
    </div>
  </div>
</template>

<script>
import DateTime from '@/components/DateTime.vue';
import AvatarUser from './AvatarUser.vue';
export default {
  components: { DateTime, AvatarUser },
  props: {
    comment: Object,
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/_variables.scss";
.comment {
  display: flex;
  padding: 0.7rem;
  gap: 1rem;
  &:not(:last-child) {
    border-bottom: 1px solid lighten($tertiary, 50%);
  }
  .authmsg {
    .name {
      font-weight: bold;
      margin-bottom: $usePadding;
    }
  }
}
</style>
