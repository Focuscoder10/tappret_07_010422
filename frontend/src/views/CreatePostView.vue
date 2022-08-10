<template>
  <main>
    <navbar-navigation />
    <return-block title="Créer une publication" />

    <div class="container with-padding">
      <form @submit.prevent="submit">
        <input
          type="text"
          v-model="title"
          placeholder="Titre de la publication"
        />
        <textarea v-model="content" placeholder="Entrez votre texte"></textarea>
        <div class="file">
          <label>
            <div class="btn">Choisir une image</div>
            <input
              @change="changeFile"
              type="file"
              ref="file"
              :accept="types.join(',')"
            />
          </label>
          <button type="button" @click="resetFile" class="btn">
            <i class="fa-solid fa-circle-xmark"></i>
          </button>
        </div>
        <div class="img" v-if="img">
          <div>{{ file.name }}</div>
          <img :src="img" />
        </div>
        <!-- <button class="btn tertiary">
          <i class="fa-solid fa-arrow-up-from-bracket"></i>
        </button> -->
        <button type="submit" class="btn">Publier</button>
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
      title: "",
      content: "",
      file: null,
      img: null,
      types: ["image/jpeg", "image/png", "image/gif"],
    };
  },
  components: {
    NavbarNavigation,
    ReturnBlock,
  },
  methods: {
    submit() {
      const fd = new FormData();
      fd.set("title", this.title);
      fd.set("content", this.content);
      if (this.file) fd.set("file", this.file);
      this.fetch("/posts", {
        method: "POST",
        headers: {},
        body: fd,
      });
      this.$router.push({ path: "/"});
    },
    resetFile() {
      this.$refs.file.value = null;
      this.changeFile();
    },
    changeFile() {
      if (this.$refs.file.files.length > 0) {
        const file = this.$refs.file.files[0];
        if (this.types.includes(file.type)) {
          this.file = file;
          this.img = URL.createObjectURL(file);
          return;
        }
      }
      this.file = null;
      this.img = null;
    },
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
  .file {
    display: flex;
    gap: $useGap;
    label {
      display: flex;
      flex: 1;
      text-align: center;
      > div {
        flex: 1;
      }
      input {
        display: none;
      }
    }
  }
  .img {
    img {
      width: 100%;
      margin-top: 0.5rem;
    }
  }
}
</style>
