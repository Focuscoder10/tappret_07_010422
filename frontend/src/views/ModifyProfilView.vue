<template>
  <main role="main">
    <navbar-navigation @click="redirect" />
    <form role="form"
      v-if="!isModified"
      @submit.prevent="modifyProfile"
      @input="verify"
      novalidate
    >
      <avatar-profile @avatar-change="avatarChange" />
      <div class="relative">
        <label for="email">Adresse email</label>
        <input
          aria-label="éditer votre adresse email"
          type="email"
          id="email"
          name="email"
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
        <label for="firstname">Prénom</label>
        <input
          aria-label="éditer votre prénom"
          type="text"
          id="firstname"
          name="firstname"
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
        <label for="lastname">Nom</label>
        <input
          aria-label="éditer votre nom"
          type="text"
          id="lastname"
          name="lastname"
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
        <button @click="show = !show" class="btn toggle-pass" type="button">
          Changer votre mot de passe
        </button>
        <label v-if="show" for="password">Mot de passe</label>
        <div v-if="show" class="eyed">
          <input
            aria-label="éditer votre mot de passe"
            :type="visible ? 'text' : 'password'"
            id="password"
            name="password"
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
          Enregistrer vos modifications
        </button>
      </div>
      <div class="return">
        <router-link to="/"><i class="fa-solid fa-arrow-left"></i></router-link>
      </div>
    </form>
    <transition name="fade">
      <alert-message
        v-if="isModified || alert.type"
        :message="alert.message"
        :type="alert.type"
      />
    </transition>
  </main>
</template>

<script>
import passwordValidator from "password-validator";
import AlertMessage from "@/components/AlertMessage.vue";
import NavbarNavigation from "@/components/NavbarNavigation.vue";
import AvatarProfile from "@/components/AvatarProfile.vue";
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
  components: { AlertMessage, NavbarNavigation, AvatarProfile },

  data() {
    return {
      avatar: null,
      file: null,
      show: false,
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
      isModified: false,
      constains,
      details: [],
      alert: {
        message: "",
        type: "",
      },
    };
  },
  created() {
    const user = this.$store.state.user;
    this.firstname = user.firstname;
    this.lastname = user.lastname;
    this.email = user.email;
    this.avatar = user.avatar;
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
        this.password.length === 0 ||
        (this.verifyMin &&
          this.verifyCase &&
          this.verifyDigits &&
          this.verifySymbols)
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
    avatarChange(file) {
      this.file = file;
    },
    redirect() {
      this.$router.push({ path: "/" });
    },
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
    modifyProfile() {
      if (!this.isValidRegister) return;
      const fd = new FormData();
      fd.set("firstname", this.firstname);
      fd.set("lastname", this.lastname);
      fd.set("email", this.email);
      if(this.password.length > 0) fd.set("password", this.password);
      if (this.file) fd.set("file", this.file);
      this.fetch("/users/me", {
        method: "PUT",
        headers: {},
        body: fd,
      }).then(async res => {
        const data = await res.json();
        if (res.status !== 200) {
          this.alert.message = data.error;
          this.alert.type = "error";
          return;
        }
        this.$store.commit("setToken", data.token)
        this.alert.message = "Votre compte a bien été mise à jour";
        this.alert.type = "success";
        this.isModified = true;
        setTimeout(() => {
          this.$router.push({ path: "/" });
        }, 3000);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@use "sass:math";
@import "@/assets/scss/_variables.scss";
@import "@/assets/scss/_signinup.scss";
@import "@/assets/scss/_mixins.scss";

.return {
  align-items: flex-start;
}
.fa-arrow-left {
  font-size: 2rem;
}
label {
  padding: $usePadding 0;
}
</style>
