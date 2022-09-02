<template>
  <main role="main">
    <div class="container">
      <return-block title="Commentaires" />
      <post-publish v-if="post" :post="post" />
      <div class="add-comment">
        <avatar-user :avatar="$store.state.user.avatar" />

        <form role="form" @submit.prevent="verifyMsg">
          <textarea
            v-model="msg"
            @input="changeHeight"
            name="write-comment"
            aria-label="ajouter un commentaire"
            placeholder="Ajouter un commentaire"
            autocomplete="off"
            rows="1"
          ></textarea>
          <button class="btn" :disabled="isNotValid">Publier</button>
        </form>
      </div>
      <div v-if="post" class="comments">
        <comment-publish
          v-for="comment of comments"
          :key="comment.id"
          :comment="comment"
        />
      </div>
    </div>
  </main>
</template>

<script>
import CommentPublish from "@/components/CommentPublish.vue";
import ReturnBlock from "@/components/ReturnBlock.vue";
import PostPublish from "@/components/PostPublish.vue";
import AvatarUser from "@/components/AvatarUser.vue";
export default {
  components: {
    CommentPublish,
    ReturnBlock,
    PostPublish,
    AvatarUser,
  },
  data() {
    return {
      post: null,
      comments: [],
      msg: "",
    };
  },
  methods: {
    changeHeight(e) {
      e.target.style.height = "auto";
      e.target.style.height = e.target.scrollHeight + "px";
    },
    verifyMsg() {
      if (this.isNotValid) {
        return;
      }
      this.fetch("/posts/" + this.$route.params.id + "/comments", {
        method: "POST",
        body: JSON.stringify({ content: this.msg }),
      }).then(res => {
        if (res.status !== 201) {
          return;
        }
        const comment = {
          created_at: new Date().toJSON(),
          content: this.msg,
          user: {
            firstname: this.$store.state.user.firstname,
            lastname: this.$store.state.user.lastname,
            avatar: this.$store.state.user.avatar,
          },
        };
        this.comments.unshift(comment);
        this.msg = null;
      });
    },
  },
  computed: {
    isNotValid() {
      return !this.msg;
    },
  },
  created() {
    this.fetch("/posts/" + this.$route.params.id).then(async post => {
      if (post.status !== 200) {
        this.$router.push({ path: "/login" });
        return;
      }
      const data = await post.json();
      this.comments = data.comments;
      delete data.comments;
      this.post = data;
    });
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/_mixins.scss";
@import "@/assets/scss/_variables.scss";
.add-comment {
  transition: border-radius 0.3s, margin 0.3s;
  @include flex-justi-align;
  padding: 0.7rem;
  background-color: $tertiary;
  gap: 1rem;
  form {
    width: 100%;
    // padding: 12px 0px;
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

@media screen and (min-width: 700px) {
  .add-comment {
    margin: 1rem 0;
    border-radius: 1.5rem;
  }
}
</style>
