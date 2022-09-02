import Vue from "vue";
import Vuex from "vuex";
import moment from "moment";
import jwtd from "jwt-decode";

moment.locale("fr");

Vue.use(Vuex);

Vue.mixin({
  methods: {
    fetch(resource, options = {}) {
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
      return fetch(
        this.$store.state.apiUrl + this.$store.state.apiPath + resource,
        obj
      );
    },
  },
});

Vue.prototype.moment = moment;

export default new Vuex.Store({
  state: {
    apiUrl: "http://localhost:3000",
    apiPath: "/api",
    token: null,
    user: null,
  },
  mutations: {
    setToken(state, token) {
      try {
        localStorage.setItem("token", token);
        state.user = jwtd(token);
        state.token = token;
      } catch (e) {
        state.user = null;
        state.token = null;
        localStorage.removeItem("token");
      }
    },
  },
});
