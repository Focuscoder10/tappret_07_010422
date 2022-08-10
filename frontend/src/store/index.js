import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

Vue.mixin({
  methods: {
    fetch(resource, options = {}) {
      if (!this.$store.state.token)
        this.$store.state.token = localStorage.getItem("token");
      const obj = {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      };
      Object.assign(obj, options);
      if (this.$store.state.token) {
        obj.headers.Authorization = "Bearer " + this.$store.state.token;
      }
      return fetch(this.$store.state.apiUrl + this.$store.state.apiPath + resource, obj);
    },
  },
});

export default new Vuex.Store({
  state: {
    apiUrl: "http://localhost:3000",
    apiPath: "/api",
    token: null,
  },
});
