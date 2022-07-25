<template>
  <main>
    <navbar-navigation />
    <return-block title="Créer une publication" />

    <div class="container with-padding">
      <form>
        <input type="text" placeholder="Titre de la publication" />
        <textarea placeholder="Entrez votre texte"></textarea>

        <button class="btn tertiary">
          <i class="fa-solid fa-arrow-up-from-bracket"></i>
        </button>
        <button class="btn">Publier</button>
      </form>
    </div>
  </main>
</template>

<script>
import NavbarNavigation from "@/components/NavbarNavigation.vue";
import ReturnBlock from "@/components/ReturnBlock.vue";
export default {
  data() {
    return {
      show: true,
    };
  },
  components: {
    NavbarNavigation,
    ReturnBlock,
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/_variables.scss";

form {
  display: flex;
  flex-direction: column;
  gap: $useGap;
  textarea {
    resize: none;
  }
}
</style>
