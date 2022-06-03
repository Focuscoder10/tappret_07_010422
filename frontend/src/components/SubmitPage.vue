<template>
  <form action="submit">
    <input type="text" name="adresse email">
    <input type="text" name="mot de passe">
    <button type="submit" name="send"></button>
  </form>
</template>

<script>
import { defineComponent } from '@vue/composition-api'

export default {
  name: SubmitPage,
  props: string,
  methods: {

  }
}
</script>

<style lang="scss" scoped>

</style>