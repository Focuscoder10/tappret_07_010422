<template>
  <div></div>
</template>

<script>
export default {
  created() {
    localStorage.removeItem("token");
    this.$store.state.token = null;
    this.$router.push({ path: "/login" });
  },
};
</script>
