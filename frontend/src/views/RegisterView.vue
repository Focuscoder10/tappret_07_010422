<template>
  <main>
    <logo-login />
    <form @submit.prevent="register" @input.prevent="verify" novalidate>
      <label>
        <span>Adresse Email</span>
        <input
          type="email"
          name="email"
          placeholder="Adresse email"
          v-model="email"
        />
        <transition name="fade">
          <div v-if="isEmailTooltipVisible" class="tooltip">
            <ul>
              <li :class="classEmail">
                L'adresse email est
                {{ verifyEmail ? "correcte" : "incorrecte" }}
              </li>
            </ul>
          </div>
        </transition>
      </label>

      <label>
        <span>Prénom</span>
        <input
          type="text"
          name="firstname"
          placeholder="Prénom"
          v-model="firstname"
        />
        <transition name="fade">
          <div v-if="isEmailTooltipVisible" class="tooltip">
            <ul>
              <li :class="classEmail">TODO</li>
            </ul>
          </div>
        </transition>
      </label>

       <label>
        <!-- <span>Nom</span> -->
        <input
          type="text"
          name="lastname"
          placeholder="Nom"
          v-model="lastname"
        />
        <transition name="fade">
          <div v-if="isEmailTooltipVisible" class="tooltip">
            <ul>
              <li :class="classEmail">TODO</li>
            </ul>
          </div>
        </transition>
      </label>

      <label>
        <span>Mot de passe</span>
        <div class="eyed">
          <input
            :type="visible ? 'text' : 'password'"
            name="password"
            placeholder="Mot de passe"
            v-model="password"
          />
          <button @click="visible = !visible">
            <i v-if="visible" class="fas fa-eye-slash"></i>
            <i v-else class="fas fa-eye"></i>
          </button>
        </div>
        <transition name="fade">
          <div v-if="isPasswordTooltipVisible" class="tooltip">
            <div>Le mot de passe doit contenir&nbsp;:</div>
            <ul>
              <li :class="classMin">{{ constains.min }} caractères minimum</li>
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
        </transition>
      </label>

      <div class="contain-button-register">
        <button class="btn" type="submit" :disabled="!isValidPassword">
          S'inscrire
        </button>
      </div>
      <div>
        Déjà un compte <a class="btn small tertiary" href="#">Se connecter</a>
      </div>
    </form>
  </main>
</template>

<script>
import passwordValidator from "password-validator";
import LogoLogin from "../components/LogoLogin.vue";

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
  components: { LogoLogin },
  data() {
    return {
      email: "",
      password: "",
      firstname: "",
      lastname: "",
      visible: false,
      isPasswordTooltipVisible: false,
      isEmailTooltipVisible: false,
      constains,
      details: [],
    };
  },
  computed: {
    verifyEmail() {
      return emailRegex.test(this.email);
    },
    classEmail() {
      return getStatus(this.verifyEmail);
    },

    verifyMin() {
      return this.fieldCheck("min");
    },
    classMin() {
      if (!this.password) return;
      return getStatus(this.verifyMin);
    },

    verifyCase() {
      return this.fieldCheck("lowercase") && this.fieldCheck("uppercase");
    },
    classCase() {
      if (!this.password) return;
      return getStatus(this.verifyCase);
    },

    verifyDigits() {
      return this.fieldCheck("digits");
    },
    classDigits() {
      if (!this.password) return;
      return getStatus(this.verifyDigits);
    },

    verifySymbols() {
      return this.fieldCheck("symbols");
    },
    classSymbols() {
      if (!this.password) return;
      return getStatus(this.verifySymbols);
    },

    isValidPassword() {
      return (
        this.email &&
        this.password &&
        this.verifyEmail &&
        this.verifyMin &&
        this.verifyCase &&
        this.verifyDigits &&
        this.verifySymbols
      );
    },
  },
  methods: {
    fieldCheck(field) {
      return !this.details.some((e) => e.validation === field);
    },
    verify() {
      this.isPasswordTooltipVisible = this.password.length > 0;
      this.isEmailTooltipVisible = this.email.length > 0;
      this.details = passValidator.validate(this.password, { details: true });
    },
    register() {
      console.log(this.isValidPassword);
      // TODO
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./src/assets/scss/_variables.scss";

form {
  margin-top: 3rem;
  display: flex;
  flex-direction: column;
  padding: 0.5rem;
  gap: 1rem;
  margin-left: auto;
  margin-right: auto;
  max-width: 450px;
  label,
  .eyed {
    display: flex;
    flex-direction: column;
  }
  label {
    span {
      margin-bottom: 0.5rem;
    }
  }
  button[type="submit"]:disabled {
    opacity: 0.5;
  }
  .eyed {
    position: relative;
    button {
      position: absolute;
      right: 0;
      height: 100%;
      aspect-ratio: 1/1;
      background: none;
      border: none;
    }
  }
  input {
    text-align: center;
    border: 1px solid #4e5166;
    padding: 0.7rem;
    border-radius: 0.5rem;
    &[name="password"] {
      position: relative;
      padding-right: 2.5rem;
    }
  }
  .contain-button-register {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    > * {
      flex: 1;
      text-align: center;
    }
  }
}

.tooltip {
  margin-top: 0.5rem;
  > div {
    font-weight: bold;
  }
  > ul {
    list-style: none;
    margin: 0;
    padding: 0;
    > li {
      display: flex;
      align-items: center;
      &::before {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        width: 1rem;
        font-family: "Font Awesome 6 Free";
        font-weight: 900;
        content: "\f111";
        margin-right: 0.5rem;
      }
      &.success {
        color: green;
        &::before {
          content: "\f058";
        }
      }
      &.error {
        color: $primary;
        &::before {
          content: "\f057";
        }
      }
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
