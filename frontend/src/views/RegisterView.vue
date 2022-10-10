<template>
  <main role="main">
    <logo-login />
    <form
      role="form"
      class="container small"
      v-if="!isRegistered"
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
          v-focus:email
          :class="_email.status"
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
        <input
          aria-label="Saisissez votre prénom"
          type="text"
          name="firstname"
          placeholder="Prénom"
          v-model="firstname"
          v-focus:firstname
          :class="_firstname.status"
        />
        <transition name="fade">
          <div v-if="isTooltipVisible.firstname" class="tooltip">
            <div>
              <ul>
                <li :class="_firstname.status">
                  Le prénom est {{ _firstname.isValid ? 'correct' : 'incorrect' }}
                </li>
              </ul>
            </div>
          </div>
        </transition>
      </div>
      <div class="relative">
        <input
          aria-label="Saisissez votre nom"
          type="text"
          name="lastname"
          placeholder="Nom"
          v-model="lastname"
          v-focus:lastname
          :class="_lastname.status"
        />
        <transition name="fade">
          <div v-if="isTooltipVisible.lastname" class="tooltip">
            <div>
              <ul>
                <li :class="_lastname.status">
                  Le nom est {{ _firstname.isValid ? 'correct' : 'incorrect' }}
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
            v-focus:password
            :class="_password.status"
          />
          <button type="button" @click="isPasswordVisible = !isPasswordVisible">
            <i v-if="isPasswordVisible" class="fas fa-eye-slash"></i>
            <i v-else class="fas fa-eye"></i>
          </button>
        </div>
        <transition name="fade">
          <div v-if="isTooltipVisible.password" class="tooltip">
            <div>
              <div>Le mot de passe doit contenir&nbsp;:</div>
              <ul>
                <li :class="_min.status">8 caractères minimum</li>
                <li :class="_case.status">Lettres majuscules et minuscules</li>
                <li :class="_digits.status">Au moins un chiffre</li>
                <li :class="_symbols.status">Au moins un caractère spécial</li>
              </ul>
            </div>
          </div>
        </transition>
      </div>
      <div class="contain-button-register">
        <button class="btn" type="submit" :disabled="!isValidForm">S'inscrire</button>
      </div>
      <div class="backup">
        Déjà un compte&nbsp;?
        <router-link :to="{ name: 'login' }">Se connecter</router-link>
      </div>
    </form>
    <transition name="fade">
      <alert-message ref="alert" />
    </transition>
  </main>
</template>

<script>
import LogoLogin from '@/components/LogoLogin.vue';
import AlertMessage from '@/components/AlertMessage.vue';
import { regex, getStatus, genPasswordValidator } from '@/assets/js';
import { mapState } from 'vuex';

const passwordValidator = genPasswordValidator();

export default {
  metaInfo: {
    title: 'Inscription',
  },
  components: { LogoLogin, AlertMessage },
  data() {
    return {
      email: '',
      password: '',
      firstname: '',
      lastname: '',
      isPasswordVisible: false,
      isTooltipVisible: {
        email: false,
        password: false,
        firstname: false,
        lastname: false,
      },
      isFocused: {
        email: false,
        password: false,
        firstname: false,
        lastname: false,
      },
      isRegistered: false,
      details: [],
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
    _firstname() {
      return getStatus(regex.name.test(this.firstname));
    },
    _lastname() {
      return getStatus(regex.name.test(this.lastname));
    },
    _password() {
      return getStatus(
        this.password.length > 0 &&
          this._min.isValid &&
          this._case.isValid &&
          this._digits.isValid &&
          this._symbols.isValid
      );
    },
    _min() {
      return getStatus(this.fieldCheck('min'));
    },
    _case() {
      return getStatus(this.fieldCheck('lowercase') && this.fieldCheck('uppercase'));
    },
    _digits() {
      return getStatus(this.fieldCheck('digits'));
    },
    _symbols() {
      return getStatus(this.fieldCheck('symbols'));
    },
    isValidForm() {
      return (
        this._email.isValid &&
        this._firstname.isValid &&
        this._lastname.isValid &&
        this._password.isValid
      );
    },
  },
  methods: {
    fieldCheck(field) {
      return !this.details.some((e) => e.validation === field);
    },
    onInput() {
      for (const field of ['email', 'password', 'firstname', 'lastname']) {
        this.isTooltipVisible[field] = this[field].length > 0 && this.isFocused[field];
      }
      this.details = passwordValidator.validate(this.password, { details: true });
    },
    async onSubmit() {
      try {
        if (!this.isValidForm) return;
        const body = {
          email: this.email,
          password: this.password,
          firstname: this.firstname,
          lastname: this.lastname,
        };
        const res = await this.fetch('/auth/signup', {
          method: 'POST',
          body,
        });
        const data = await res.json();
        if (res.status !== 201) {
          this.$refs.alert.show(data);
          return;
        }
        this.$refs.alert.show({
          message: 'Votre compte a bien été crée',
          mode: 'success',
        });
        this.isRegistered = true;
        setTimeout(() => {
          this.$router.push({ name: 'login' });
        }, 3000);
      } catch (e) {
        this.$refs.alert.show(e);
      }
    },
    onFocusChange(arg, evt) {
      this.isFocused[arg] = evt.type === 'focus';
      this.onInput();
    },
  },
  directives: {
    focus: {
      bind(el, { arg }, { context }) {
        el.addEventListener('focus', context.onFocusChange.bind(this, arg));
        el.addEventListener('blur', context.onFocusChange.bind(this, arg));
      },
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
