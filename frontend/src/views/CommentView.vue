<template>
  <main>
    <navbar-navigation />
    <div class="container">
      <return-block title="Commentaires" />
      <div class="add-comment">
        <div class="img-profil">
          <img src="@/assets/images/beach.png" alt="" />
        </div>

        <form>
          <textarea
            name="write-comment"
            aria-label="ajouter un commentaire"
            placeholder="Ajouter un commentaire"
            autocomplete="off"
            rows="1"
          ></textarea>
          <button>Publier</button>
        </form>
      </div>
      <comment-publish v-for="i of [1, 2, 3, 4, 5, 6, 7]" :key="i" />
    </div>
  </main>
</template>

<script>
import CommentPublish from "@/components/CommentPublish.vue";
import NavbarNavigation from "@/components/NavbarNavigation.vue";
import ReturnBlock from "@/components/ReturnBlock.vue";
export default {
  components: { CommentPublish,NavbarNavigation,ReturnBlock  },
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
    padding: 12px 0px;
    display: flex;
    background-color: white;
    border-radius: 1.2rem;
    padding: 1rem;
    gap: 1rem;
    textarea,
    button {
      border: none;
      background: none;
      padding: 0;
    }
    textarea {
      width: 100%;
      text-align: left;
      resize: none;
    }
    button {
      color: $secondary;
    }
  }
}
@media screen and (min-width: 700px) {
  .add-comment{
    border-radius: 1.5rem;
  }
}
</style>
