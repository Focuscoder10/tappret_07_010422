<template>
  <div class="comment">
    <div class="img-profil">
      <avatar-user :avatar="comment.user.avatar" />
    </div>
    <div class="authmsg">
      <div class="name">
        {{ comment.user.firstname }} {{ comment.user.lastname }}
      </div>
      <div class="msg">{{ comment.content }}</div>
      <date-time :time="comment.createdAt" />
    </div>
  </div>
</template>

<script>
import DateTime from "@/components/DateTime.vue";
import AvatarUser from "./AvatarUser.vue";
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
    .msg {
      margin-bottom: 0.5rem;
    }
    .name {
      font-weight: bold;
      margin-bottom: $usePadding;
    }
  }
}
</style>
