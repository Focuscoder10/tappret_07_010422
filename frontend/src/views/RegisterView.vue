<template>
  <main role="main">
    <logo-login />
    <form role="form"
      v-if="!isRegistered"
      @submit.prevent="register"
      @input="verify"
      novalidate
    >
      <div class="relative">
        <input
          aria-label="entrer votre adresse email"
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
        <input
          aria-label="entrer votre prénom"
          type="text"
          name="firstname"
          placeholder="Prénom"
          v-model="firstname"
          @focus="
            isFirstNameFocused = true;
            verify();
          "
          @blur="
            isFirstNameFocused = false;
            verify();
          "
          :class="classFirstName"
        />
        <transition name="fade">
          <div v-if="isFirstNameTooltipVisible" class="tooltip">
            <div>
              <ul>
                <li :class="classFirstName">
                  Veuillez saisir un prénom correct
                </li>
              </ul>
            </div>
          </div>
        </transition>
      </div>

      <div class="relative">
        <input
          aria-label="entrer votre nom"
          type="text"
          name="lastname"
          placeholder="Nom"
          v-model="lastname"
          @focus="
            isLastNameFocused = true;
            verify();
          "
          @blur="
            isLastNameFocused = false;
            verify();
          "
          :class="classLastName"
        />
        <transition name="fade">
          <div v-if="isLastNameTooltipVisible" class="tooltip">
            <div>
              <ul>
                <li :class="classLastName">Veuillez saisir un nom correct</li>
              </ul>
            </div>
          </div>
        </transition>
      </div>

      <div class="relative">
        <div class="eyed">
          <input
            aria-label="entrer votre mot de passe"
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
          <button type="button" @click="visible = !visible">
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
        <button class="btn" type="submit" :disabled="!isValidRegister">
          S'inscrire
        </button>
      </div>
      <div class="backup">
        Déjà un compte&nbsp;?
        <router-link to="/login">Se connecter</router-link>
      </div>
    </form>
    <transition name="fade">
      <alert-message
        v-if="isRegistered || alert.type"
        :message="alert.message"
        :type="alert.type"
      />
    </transition>
  </main>
</template>

<script>
import passwordValidator from "password-validator";
import LogoLogin from "@/components/LogoLogin.vue";
import AlertMessage from "@/components/AlertMessage.vue";
const constains = {
  min: 8,
  max: 64,
  bothcase: true,
  digits: true,
  symbols: true,
};

const passValidator = new passwordValidator();

function getStatus(bool) {
  return bool ? "success" : "error";
}

const emailRegex =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const nameRegex = /^[\p{L} ,.'-]+$/u;

passValidator.is().min(constains.min).is().max(constains.max);

if (constains.bothcase) {
  passValidator.has().uppercase().has().lowercase();
}

if (constains.digits) {
  passValidator.has().digits();
}

if (constains.symbols) {
  passValidator.has().symbols();
}

export default {
  components: { LogoLogin, AlertMessage },
  data() {
    return {
      email: "",
      password: "",
      firstname: "",
      lastname: "",
      visible: false,
      isPasswordTooltipVisible: false,
      isEmailTooltipVisible: false,
      isFirstNameTooltipVisible: false,
      isLastNameTooltipVisible: false,
      isEmailFocused: false,
      isFirstNameFocused: false,
      isLastNameFocused: false,
      isPasswordFocused: false,
      isRegistered: false,
      constains,
      details: [],
      alert: {
        message: "",
        type: "",
      },
    };
  },
  computed: {
    verifyEmail() {
      return emailRegex.test(this.email);
    },
    classEmail() {
      return getStatus(this.verifyEmail);
    },

    verifyFirstName() {
      return nameRegex.test(this.firstname);
    },
    classFirstName() {
      return getStatus(this.verifyFirstName);
    },

    verifyLastName() {
      return nameRegex.test(this.lastname);
    },
    classLastName() {
      return getStatus(this.verifyLastName);
    },

    verifyMin() {
      return this.fieldCheck("min");
    },
    classMin() {
      return getStatus(this.verifyMin);
    },

    verifyCase() {
      return this.fieldCheck("lowercase") && this.fieldCheck("uppercase");
    },
    classCase() {
      return getStatus(this.verifyCase);
    },

    verifyDigits() {
      return this.fieldCheck("digits");
    },
    classDigits() {
      return getStatus(this.verifyDigits);
    },

    verifySymbols() {
      return this.fieldCheck("symbols");
    },
    classSymbols() {
      return getStatus(this.verifySymbols);
    },

    verifyPassword() {
      return (
        this.password.length > 0 &&
        this.verifyMin &&
        this.verifyCase &&
        this.verifyDigits &&
        this.verifySymbols
      );
    },
    classPassword() {
      return getStatus(this.verifyPassword);
    },

    isValidRegister() {
      return (
        this.verifyEmail &&
        this.verifyFirstName &&
        this.verifyLastName &&
        this.verifyPassword
      );
    },
  },
  methods: {
    fieldCheck(field) {
      return !this.details.some(e => e.validation === field);
    },
    verify() {
      this.isEmailTooltipVisible = this.email.length > 0 && this.isEmailFocused;
      this.isFirstNameTooltipVisible =
        this.firstname.length > 0 && this.isFirstNameFocused;
      this.isLastNameTooltipVisible =
        this.lastname.length > 0 && this.isLastNameFocused;
      this.isPasswordTooltipVisible =
        this.password.length > 0 && this.isPasswordFocused;
      this.details = passValidator.validate(this.password, { details: true });
    },
    register() {
      if (!this.isValidRegister) return;
      const data = {
        email: this.email,
        password: this.password,
        firstname: this.firstname,
        lastname: this.lastname,
      };
      this.fetch("/auth/signup", {
        method: "POST",
        body: JSON.stringify(data),
      }).then(async res => {
        const data = await res.json();
        if (res.status !== 201) {
          this.alert.message = data.error;
          this.alert.type = "error";
          return;
        }
        this.alert.message = "Votre compte a bien été crée";
        this.alert.type = "success";
        this.isRegistered = true;
        setTimeout(() => {
          this.$router.push({ path: "/login" });
        }, 3000);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/_variables.scss";
@import "@/assets/scss/_signinup.scss";
</style>
