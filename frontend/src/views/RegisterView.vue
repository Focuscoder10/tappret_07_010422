<template>
  <div>
    <form @submit.prevent="register" @input.prevent="verify" novalidate>
      <input
        type="email"
        name="email"
        placeholder="Adresse email"
        v-model="email"
      />
      <input
        :type="visible ? 'text' : 'password'"
        name="password"
        placeholder="Mot de passe"
        v-model="password"
      />
      <button class="pass" @click="visible = !visible">
        <span v-if="visible">Hide</span>
        <span v-else>Show</span>
      </button>
      <div v-if="errors.length" class="error">
        <div v-for="error of errors" :key="error">{{ error }}</div>
      </div>
      <button type="submit" :disabled="!valid">Envoyer</button>
    </form>
  </div>
</template>

<script>
import passwordValidator from "password-validator";
const passValidator = new passwordValidator();
const emailRegex =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
passValidator
  .is()
  .min(8)
  .is()
  .max(64)
  .has()
  .uppercase()
  .has()
  .lowercase()
  .has()
  .digits()
  .has()
  .symbols();
export default {
  data() {
    return {
      email: null,
      password: null,
      visible: false,
      valid: false,
      errors: [],
    };
  },
  methods: {
    verify() {
      this.valid = true;
      this.errors = [];
      if (!emailRegex.test(this.email)) {
        this.valid = false;
        this.errors.push("Adresse email incorrecte");
      }
      const details = passValidator.validate(this.password, { details: true });
      if (details.length) {
        this.valid = false;
        this.errors.push(...details.map((e) => e.message));
      }
    },
    register() {
      if (this.valid) {
        console.log(this.valid);
        // TODO
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.clic:hover {
  cursor: pointer;
}
</style>
