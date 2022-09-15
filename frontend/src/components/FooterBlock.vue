<template>
  <footer role="contentinfo">
    <a href="#">Mentions Légales</a>
    <a href="#">Conditions d'utilisations</a>
  </footer>
</template>

<style lang="scss" scoped>
footer {
  background-color: white;
  box-shadow: 0 -0.25rem 1rem rgb(black, 0.19), 0 -0.125rem 0.5rem rgb(black, 0.23);
  position: sticky;
  bottom: 0;
  margin-top: auto;
  display: flex;
  gap: 1rem;
  padding: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  text-align: center;
  a {
    text-decoration: none;
  }
}
</style>
