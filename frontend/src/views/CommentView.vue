<template>
  <main>
    <navbar-navigation />
    <div class="container">
      <return-block title="Commentaires" />
      <post-publish v-if="post" :post="post" />
      <div class="add-comment">
        <div class="img-profil">
          <img v-if="avatar" :src="avatar" alt="avatar de l'utilisateur">
          <img v-else src="@/assets/images/beach.png" alt="avatar par défaut de l'utilisateur" />
        </div>

        <form @submit.prevent="verifyMsg">
          <textarea
            v-model="msg"
            name="write-comment"
            aria-label="ajouter un commentaire"
            placeholder="Ajouter un commentaire"
            autocomplete="off"
            rows="1"
          ></textarea>
          <button class="btn" :disabled="isNotValid">Publier</button>
        </form>
      </div>
      <comment-publish
        v-for="comment of comments"
        :key="comment.id"
        :comment="comment"
      />
    </div>
  </main>
</template>

<script>
import CommentPublish from "@/components/CommentPublish.vue";
import NavbarNavigation from "@/components/NavbarNavigation.vue";
import ReturnBlock from "@/components/ReturnBlock.vue";
import PostPublish from "@/components/PostPublish.vue";
export default {
  components: { CommentPublish, NavbarNavigation, ReturnBlock, PostPublish },
  data() {
    return {
      post: null,
      comments: null,
      msg: "",
    };
  },
  methods: {
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
          author_firstname: this.$store.state.user.firstname,
          author_lastname: this.$store.state.user.lastname,
          created_at: new Date().toJSON(),
          content: this.msg,
        };
        console.log(comment);
        this.comments.unshift(comment);
        this.msg = null;
      });
    },
  },
  computed: {
    avatar() {
      const state = this.$store.state;
      if(state.user.avatar){
        return state.apiUrl + "/upload/" + state.user.avatar
      }return null;
    },
    isNotValid() {
      return !this.msg;
    },
  },
  created() {
    const promises = [
      this.fetch("/posts/" + this.$route.params.id),
      this.fetch("/posts/" + this.$route.params.id + "/comments"),
    ];
    Promise.all(promises).then(async ([post, comments]) => {
      if (post.status !== 200 || comments.status !== 200) {
        this.$router.push({ path: "/login" });
        return;
      }
      this.post = await post.json();
      this.comments = await comments.json();
      // const data = await res.json();
      // if (res.status !== 200) {
      //   return;
      // }
      // this.post = data;
    });
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/_mixins.scss";
@import "@/assets/scss/_variables.scss";
.add-comment {
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
      border: none;
      background: none;
      padding: 0;
      width: 100%;
      text-align: left;
      resize: none;
    }
    // button {
    //   color: $secondary;
    // }
  }
}
@media screen and (min-width: 700px) {
  .add-comment {
    border-radius: 1.5rem;
  }
}
</style>
