<template>
  <main>
    <logo-login />
    <form @submit.prevent="login" @input="verify" novalidate>
      <div class="relative">
        <input
          type="email"
          name="email"
          placeholder="Adresse email"
          v-model="email"
          @focus="
            isEmailFocused = true;
            verify();
          "
          @blur="
            isEmailFocused = false;
            verify();
          "
          :class="classEmail"
        />
        <transition name="fade">
          <div v-if="isEmailTooltipVisible" class="tooltip">
            <div>
              <ul>
                <li :class="classEmail">
                  L'adresse email est
                  {{ verifyEmail ? "correcte" : "incorrecte" }}
                </li>
              </ul>
            </div>
          </div>
        </transition>
      </div>

      <div class="relative">
        <div class="eyed">
          <input
            :type="visible ? 'text' : 'password'"
            name="password"
            placeholder="Mot de passe"
            v-model="password"
            @focus="
              isPasswordFocused = true;
              verify();
            "
            @blur="
              isPasswordFocused = false;
              verify();
            "
            :class="classPassword"
          />
          <button @click="visible = !visible">
            <i v-if="visible" class="fas fa-eye-slash"></i>
            <i v-else class="fas fa-eye"></i>
          </button>
        </div>
        <transition name="fade">
          <div v-if="isPasswordTooltipVisible" class="tooltip">
            <div>
              <div>Le mot de passe doit contenir&nbsp;:</div>
              <ul>
                <li :class="classMin">
                  {{ constains.min }} caractères minimum
                </li>
                <li v-if="constains.bothcase" :class="classCase">
                  Lettres majuscules et minuscules
                </li>
                <li v-if="constains.digits" :class="classDigits">
                  Au moins un chiffre
                </li>
                <li v-if="constains.symbols" :class="classSymbols">
                  Au moins un caractère spécial
                </li>
              </ul>
            </div>
          </div>
        </transition>
      </div>

      <div class="contain-button-register">
        <button class="btn" type="submit">Se connecter</button>
      </div>
      <div class="backup">
        Créer un compte&nbsp;?
        <router-link to="/register">S'inscrire</router-link>
      </div>
    </form>
  </main>
</template>

<script>
import LogoLogin from "@/components/LogoLogin.vue";

function getStatus(bool) {
  return bool ? "success" : "error";
}

const emailRegex =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export default {
  components: { LogoLogin },
  data() {
    return {
      email: "",
      password: "",
      visible: false,
      isEmailTooltipVisible: false,
      isEmailFocused: false,
      isPasswordFocused: false,
    };
  },
  computed: {
    verifyEmail() {
      return emailRegex.test(this.email);
    },
    classEmail() {
      return getStatus(this.verifyEmail);
    },

    isValidLogin() {
      return this.verifyEmail;
    },
  },
  methods: {
    verify() {
      this.isEmailTooltipVisible = this.email.length > 0 && this.isEmailFocused;
      this.isPasswordTooltipVisible =
        this.password.length > 0 && this.isPasswordFocused;
    },
    login() {
      console.log(this.isValidLogin);
      // TODO
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/_variables.scss";
@import "@/assets/scss/_signinup.scss";
</style>
