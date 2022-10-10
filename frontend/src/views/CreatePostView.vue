<template>
  <main role="main">
    <return-block :title="isEdit ? 'Modifier votre publication' : 'Créer une publication'" />
    <div class="container with-padding">
      <form role="form" @submit.prevent="onSubmit">
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
        <button type="submit" class="btn">
          {{ isEdit ? 'Éditer' : 'Publier' }}
        </button>
      </form>
      <alert-message ref="error" />
    </div>
  </main>
</template>

<script>
import ReturnBlock from '@/components/ReturnBlock.vue';
import AlertMessage from '@/components/AlertMessage.vue';
import { mapGetters } from 'vuex';

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
    AlertMessage,
  },

  // création de post
  async created() {
    try {
      if (!this.$route.params.id) return;
      const res = await this.fetch(`/posts/${this.$route.params.id}`);
      const data = await res.json();
      if (res.status !== 200) {
        this.$refs.error.show(data);
        return;
      }
      this.title = data.title;
      this.content = data.content;
      this.img = this.uploadUrl(data.media);
      this.isEdit = true;
    } catch (e) {
      this.$refs.error.show(e);
    }
  },
  updated() {
    const e = this.$refs.textarea;
    e.style.height = 'auto';
    e.style.height = `${e.scrollHeight}px`;
  },
  computed: mapGetters(['uploadUrl']),
  methods: {
    async onSubmit() {
      try {
        const body = new FormData();
        const keepMedia = this.isEdit ? Boolean(!this.file && this.img) : undefined;
        body.set(
          'post',
          JSON.stringify({
            title: this.title,
            content: this.content,
            keepMedia,
          })
        );
        if (this.file) body.set('file', this.file);
        const res = await this.fetch(`/posts/${this.isEdit ? this.$route.params.id : ''}`, {
          method: this.isEdit ? 'PUT' : 'POST',
          headers: {},
          body,
        });
        if (![200, 201].includes(res.status)) return;
        this.$emit('posts-refresh');
        this.$router.push({ name: 'home' });
      } catch (e) {
        this.$refs.error.show(e);
      }
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
@import '@/assets/scss';

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
    align-items: center;
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
    div {
      text-overflow: ellipsis;
      overflow: hidden;
    }
    img {
      width: 100%;
      margin-top: 0.5rem;
    }
  }
}
</style>
