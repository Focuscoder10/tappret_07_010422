<template>
  <main role="main">
    <logo-login />
    <form
      role="form"
      class="container small"
      @submit.prevent="onSubmit"
      @input="onInput"
      novalidate
    >
      <div class="relative">
        <input
          aria-label="Saisissez votre adresse email"
          type="email"
          name="email"
          placeholder="Adresse email"
          v-model="email"
          :class="_email.status"
          v-focus:email
        />
        <transition name="fade">
          <div v-if="isTooltipVisible.email" class="tooltip">
            <div>
              <ul>
                <li :class="_email.status">
                  L'adresse email est
                  {{ _email.isValid ? 'correcte' : 'incorrecte' }}
                </li>
              </ul>
            </div>
          </div>
        </transition>
      </div>
      <div class="relative">
        <div class="eyed">
          <input
            aria-label="Saisissez votre mot de passe"
            :type="isPasswordVisible ? 'text' : 'password'"
            name="password"
            placeholder="Mot de passe"
            v-model="password"
            :class="_password.status"
          />
          <button type="button" @click="isPasswordVisible = !isPasswordVisible">
            <i v-if="isPasswordVisible" class="fas fa-eye-slash"></i>
            <i v-else class="fas fa-eye"></i>
          </button>
        </div>
      </div>
      <div class="contain-button-register">
        <button class="btn" type="submit" :disabled="!isValidForm">Se connecter</button>
      </div>
      <div class="backup">
        Créer un compte&nbsp;?
        <router-link :to="{ name: 'register' }">S'inscrire</router-link>
      </div>
    </form>
    <alert-message ref="alert" />
  </main>
</template>

<script>
import LogoLogin from '@/components/LogoLogin.vue';
import AlertMessage from '@/components/AlertMessage.vue';
import { regex, getStatus } from '@/assets/js';
import { mapActions, mapState } from 'vuex';

export default {
  metaInfo: {
    title: 'Connexion',
  },
  components: { LogoLogin, AlertMessage },
  data() {
    return {
      email: '',
      password: '',
      isPasswordVisible: false,
      isFocused: {
        email: false,
      },
      isTooltipVisible: {
        email: false,
      },
    };
  },
  created() {
    if (this.user) this.$router.push({ name: 'home' });
  },
  computed: {
    ...mapState(['user']),
    _email() {
      return getStatus(regex.email.test(this.email));
    },
    _password() {
      return getStatus(this.password.length > 0);
    },
    isValidForm() {
      return this._email.isValid && this._password.isValid;
    },
  },
  methods: {
    ...mapActions(['setToken']),
    onInput() {
      this.isTooltipVisible.email = this.email.length > 0 && this.isFocused.email;
    },
    async onSubmit() {
      try {
        if (!this.isValidForm) return;
        const body = {
          email: this.email,
          password: this.password,
        };
        const res = await this.fetch('/auth/login', {
          method: 'POST',
          body,
        });
        const data = await res.json();
        if (res.status !== 200) {
          this.$refs.alert.show(data);
          return;
        }
        this.setToken(data.token);
      } catch (e) {
        this.$refs.alert.show(e);
        return;
      }
      this.$router.push({ name: 'home' });
    },

    // permet de connaitre l'élément focus dans le formulaire
    onFocusChange(arg, evt) {
      this.isFocused[arg] = evt.type === 'focus';
      this.onInput();
    },
  },

  /**
   * crée une directive v-focus:
   * surveille le champ ciblé
   */
  directives: {
    focus: {
      bind(el, { arg }, { context }) {
        el.addEventListener('focus', context.onFocusChange.bind(this, arg));
        el.addEventListener('blur', context.onFocusChange.bind(this, arg));
      },
      // permet d'entrer directement dans le champ email lors de l'arrivée sur la page
      inserted(el, { arg }) {
        if (arg === 'email') el.focus();
      },
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss';
@import '@/assets/scss/signinup';
</style>
