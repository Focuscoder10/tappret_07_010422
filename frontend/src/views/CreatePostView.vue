<template>
  <main role="main">
    <return-block :title="isEdit ? 'Modifier votre publication' : 'Créer une publication'" />

    <div class="container with-padding">
      <form role="form" @submit.prevent="submit">
        <input type="text" v-model="title" placeholder="Titre de la publication" />
        <textarea
          ref="textarea"
          v-model="content"
          rows="1"
          placeholder="Entrez votre texte"
        ></textarea>
        <div class="file">
          <label>
            <div class="btn">{{ isEdit ? 'Modifier votre' : 'Choisir une' }} image</div>
            <input @change="changeFile" type="file" ref="file" :accept="types.join(',')" />
          </label>
          <button type="button" @click="resetFile" class="btn">
            <i class="fa-solid fa-circle-xmark"></i>
          </button>
        </div>
        <div class="img">
          <div v-if="file">{{ file.name }}</div>
          <img v-if="img" :src="img" />
        </div>
        <!-- <button class="btn tertiary">
          <i class="fa-solid fa-arrow-up-from-bracket"></i>
        </button> -->
        <button type="submit" class="btn">
          {{ isEdit ? 'Éditer' : 'Publier' }}
        </button>
      </form>
    </div>
  </main>
</template>

<script>
import ReturnBlock from '@/components/ReturnBlock.vue';

const scheme = /^https?:\/\//;

export default {
  metaInfo: {
    title: 'Ajouter un post',
  },
  data() {
    return {
      title: '',
      content: '',
      file: null,
      img: null,
      types: ['image/jpeg', 'image/png', 'image/gif'],
      isEdit: false,
    };
  },
  components: {
    ReturnBlock,
  },
  created() {
    if (!this.$route.params.id) return;
    this.fetch('/posts/' + this.$route.params.id).then(async (post) => {
      if (post.status !== 200) {
        this.$router.push({ path: '/login' });
        return;
      }
      const data = await post.json();
      this.title = data.title;
      this.content = data.content;
      this.img = scheme.test(data.media)
        ? data.media
        : `${this.$store.getters.apiUrl}/upload/${data.media}`;
      this.isEdit = true;
    });
  },
  updated() {
    this.changeHeight();
  },
  methods: {
    changeHeight() {
      const e = this.$refs.textarea;
      e.style.height = 'auto';
      e.style.height = e.scrollHeight + 'px';
    },
    submit() {
      const fd = new FormData();
      fd.set('title', this.title);
      fd.set('content', this.content);
      if (this.file) fd.set('file', this.file);
      this.fetch('/posts/' + (this.isEdit ? this.$route.params.id : ''), {
        method: this.isEdit ? 'PUT' : 'POST',
        headers: {},
        body: fd,
      }).then((res) => {
        if (![200, 201].includes(res.status)) {
          return;
        }
        this.$emit('posts-refresh');
        this.$router.push({ path: '/' });
      });
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
@import '@/assets/scss/_variables.scss';

form {
  display: flex;
  flex-direction: column;
  gap: $useGap;
  textarea {
    resize: none;
    overflow-y: hidden;
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
