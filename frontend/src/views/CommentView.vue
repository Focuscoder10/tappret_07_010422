<template>
  <main role="main">
    <div class="container">
      <return-block title="Commentaires" />
      <post-publish v-if="post" :post="post" @delete-post="deletePost" @show-modal="onShowModal" />
      <div class="add-comment">
        <avatar-user :avatar="user.avatar" />
        <form role="form" @submit.prevent="onSubmit">
          <textarea
            v-model="content"
            @input="onInput"
            name="write-comment"
            aria-label="Ajouter un commentaire"
            placeholder="Ajouter un commentaire"
            autocomplete="off"
            rows="1"
          ></textarea>
          <button class="btn" :disabled="isNotValid">Publier</button>
        </form>
      </div>
      <div v-if="post" class="comments">
        <comment-publish
          v-for="comment of post.comments"
          :key="comment.id"
          :comment="comment"
          @delete-comment="deleteComment"
          @show-modal="onShowModal"
        />
      </div>
    </div>
    <alert-message :full="true" ref="alert" />
    <alert-message ref="error" />
  </main>
</template>

<script>
import CommentPublish from '@/components/CommentPublish.vue';
import ReturnBlock from '@/components/ReturnBlock.vue';
import PostPublish from '@/components/PostPublish.vue';
import AvatarUser from '@/components/AvatarUser.vue';
import AlertMessage from '@/components/AlertMessage.vue';
import { mapState } from 'vuex';

export default {
  metaInfo() {
    const title = this.post ? this.post.title : 'Commentaires';
    return {
      title: `Commentaires de ${title}`,
    };
  },
  components: {
    CommentPublish,
    ReturnBlock,
    PostPublish,
    AvatarUser,
    AlertMessage,
  },
  data() {
    return {
      post: null,
      content: '',
    };
  },
  methods: {
    onInput(e) {
      e.target.style.height = 'auto';
      e.target.style.height = `${e.target.scrollHeight}px`;
    },
    async onSubmit() {
      try {
        if (this.isNotValid) return;
        const res = await this.fetch(`/posts/${this.$route.params.id}/comments`, {
          method: 'POST',
          body: { content: this.content },
        });
        const data = await res.json();
        if (res.status !== 201) {
          this.$refs.error.show(data);
          return;
        }
        const comment = {
          createdAt: new Date().toJSON(),
          content: this.content,
          user: {
            firstname: this.user.firstname,
            lastname: this.user.lastname,
            avatar: this.user.avatar,
          },
        };
        this.post.comments.unshift(comment);
        this.content = '';
      } catch (e) {
        this.$refs.error.show(e);
      }
    },
    deletePost() {
      this.$refs.alert.hide();
      this.$router.push({ name: 'home' });
    },
    deleteComment(comment) {
      this.post.comments.splice(this.post.comments.indexOf(comment), 1);
      this.$refs.alert.hide();
    },
    onShowModal({ model, callback }) {
      const modelName = Object.hasOwn(model, 'comments') ? 'post' : 'commentaire';
      this.$refs.alert.show({
        mode: 'warning',
        title: 'Confirmation',
        type: 'dialog',
        callback,
        message: `Voulez-vous supprimer le ${modelName} de '${model.user.firstname} ${model.user.lastname}' ?`,
      });
    },
  },
  computed: {
    ...mapState(['user']),
    isNotValid() {
      return !this.content;
    },
  },
  async created() {
    const res = await this.fetch(`/posts/${this.$route.params.id}`);
    const data = await res.json();
    if (res.status !== 200) {
      this.$refs.error.show(data);
      return;
    }
    this.post = data;
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss';
.add-comment {
  transition: border-radius 0.3s, margin 0.3s;
  @include flex-center-center;
  padding: 0.7rem;
  background-color: $tertiary;
  gap: 1rem;
  form {
    width: 100%;
    display: flex;
    background-color: white;
    border-radius: 1.2rem;
    padding: 1rem;
    gap: 1rem;
    textarea {
      outline: none;
      border: none;
      background: none;
      padding: 0;
      width: 100%;
      text-align: left;
      resize: none;
    }
    button {
      align-self: center;
    }
  }
}

.post-card:deep .comments {
  display: none;
}

@media screen and (min-width: 700px) {
  .add-comment {
    margin: 1rem 0;
    border-radius: 1.5rem;
  }
}
</style>
