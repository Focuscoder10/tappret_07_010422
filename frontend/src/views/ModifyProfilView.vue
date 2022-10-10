<template>
  <main role="main">
    <div class="container small">
      <return-block title="Modifier votre profil" />
      <form role="form" v-if="!isModified" @submit.prevent="onSubmit" @input="onInput" novalidate>
        <avatar-profile @avatar-change="avatarChange" />
        <div>
          <label for="email">Adresse email</label>
          <div class="relative">
            <input
              aria-label="Modifiez votre adresse email"
              type="email"
              id="email"
              name="email"
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
        </div>
        <div>
          <label for="firstname">Prénom</label>
          <div class="relative">
            <input
              aria-label="Modifiez votre prénom"
              type="text"
              id="firstname"
              name="firstname"
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
        </div>
        <div>
          <label for="lastname">Nom</label>
          <div class="relative">
            <input
              aria-label="Modifiez votre nom"
              type="text"
              id="lastname"
              name="lastname"
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
        </div>
        <div>
          <button @click="editPassword = !editPassword" class="btn small tertiary" type="button">
            Changer votre mot de passe
          </button>
          <label v-if="editPassword" for="password">Mot de passe</label>
          <div class="relative">
            <div v-if="editPassword" class="eyed">
              <input
                aria-label="Modifiez votre mot de passe"
                :type="isPasswordVisible ? 'text' : 'password'"
                id="password"
                name="password"
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
        </div>
        <div class="contain-button-register">
          <button class="btn" type="submit" :disabled="!isValidForm">
            Enregistrer vos modifications
          </button>
        </div>
      </form>
      <alert-message ref="alert" />
    </div>
  </main>
</template>

<script>
import AlertMessage from '@/components/AlertMessage.vue';
import AvatarProfile from '@/components/AvatarProfile.vue';
import ReturnBlock from '@/components/ReturnBlock.vue';
import { regex, getStatus, genPasswordValidator } from '@/assets/js';
import { mapActions, mapState } from 'vuex';

const passwordValidator = genPasswordValidator();

export default {
  metaInfo() {
    return {
      title: `Profil de ${this.user.firstname} ${this.user.lastname}`,
    };
  },
  components: { AlertMessage, AvatarProfile, ReturnBlock },
  data() {
    return {
      email: '',
      password: '',
      firstname: '',
      lastname: '',
      avatar: null,
      file: null,
      editPassword: false,
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
      isModified: false,
      details: [],
    };
  },
  created() {
    this.firstname = this.user.firstname;
    this.lastname = this.user.lastname;
    this.email = this.user.email;
    this.avatar = this.user.avatar;
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
        this.password.length === 0 ||
          (this._min.isValid && this._case.isValid && this._digits.isValid && this._symbols.isValid)
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
    ...mapActions(['setToken']),
    avatarChange(file) {
      this.file = file;
    },

    // vérifie la présence d'un type d'erreur
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
        const body = new FormData();
        const user = {
          firstname: this.firstname,
          lastname: this.lastname,
          email: this.email,
        };
        if (this.password.length > 0) user.password = this.password;
        body.set('user', JSON.stringify(user));
        if (this.file) body.set('file', this.file);
        const res = await this.fetch('/users/me', {
          method: 'PUT',
          headers: {},
          body,
        });
        const data = await res.json();
        if (res.status !== 200) {
          this.$refs.alert.show(data);
          return;
        }
        this.setToken(data.token);
        this.$refs.alert.show({
          message: 'Votre compte a bien été mise à jour',
          mode: 'success',
        });
        this.isModified = true;
        setTimeout(() => {
          this.$router.push({ name: 'home' });
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
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss';
@import '@/assets/scss/signinup';
.relative > input {
  width: 100%;
}
</style>
