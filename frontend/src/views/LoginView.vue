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
      </div>

      <div class="contain-button-register">
        <button class="btn" type="submit" :disabled="!isValidLogin">
          Se connecter
        </button>
      </div>
      <div class="backup">
        Créer un compte&nbsp;?
        <router-link to="/register">S'inscrire</router-link>
      </div>
    </form>
    <transition name="fade">
      <alert-message v-if="message" :message="message" type="error" />
    </transition>
  </main>
</template>

<script>
import LogoLogin from "@/components/LogoLogin.vue";
import AlertMessage from "@/components/AlertMessage.vue";

function getStatus(bool) {
  return bool ? "success" : "error";
}

const emailRegex =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export default {
  components: { LogoLogin, AlertMessage },
  data() {
    return {
      email: "",
      password: "",
      message: "",
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

    verifyPassword() {
      return this.password.length > 0;
    },
    classPassword() {
      return getStatus(this.verifyPassword);
    },

    isValidLogin() {
      return this.verifyEmail && this.verifyPassword;
    },
  },
  methods: {
    verify() {
      this.isEmailTooltipVisible = this.email.length > 0 && this.isEmailFocused;
    },
    login() {
      if (!this.isValidLogin) return;
      const data = {
        email: this.email,
        password: this.password,
      };
      fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }).then(async res => {
        const data = await res.json();
        if (res.status !== 200) {
          this.message = data.error;
          return;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/_variables.scss";
@import "@/assets/scss/_signinup.scss";
</style>
