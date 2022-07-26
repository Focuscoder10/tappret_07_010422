<template>
<div class="alert">
  <i class="fa-regular fa-circle-check"></i>
  {{ message }}
  </div>
</template>

<script>
export default {
  props: {
    message: String,
  },
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/_variables.scss";
.alert {
  border-radius: 2rem;
  margin: 1rem;
  padding: 2rem;
  text-align: center;
  // border: 1px solid;
  box-shadow: $shadow;
  i {
    color: green;
    
    
  }
}

</style>