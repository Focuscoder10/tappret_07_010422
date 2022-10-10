import Vue from 'vue';
import Vuex from 'vuex';
import moment from 'moment';
import jwtd from 'jwt-decode';
import { regex } from '@/assets/js';

moment.locale('fr');

Vue.use(Vuex);

Vue.mixin({
  methods: {
    fetch(resource, options = {}) {
      const { token } = this.$store.state;
      const obj = {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      };
      Object.assign(obj, options);
      if (typeof obj.body !== 'string' && !(obj.body instanceof FormData)) {
        obj.body = JSON.stringify(obj.body);
      }
      if (token) obj.headers.Authorization = `Bearer ${token}`;
      return fetch(`${this.$store.getters.apiUrl}/api${resource}`, obj);
    },
  },
});

Vue.prototype.moment = moment;

export default new Vuex.Store({
  state: {
    token: null,
    user: null,
  },
  getters: {
    apiUrl: () => `http://${location.hostname}:3000`,
    uploadUrl: (state, getters) => (file) => {
      if (!file) return null;
      return regex.proto.test(file) ? file : `${getters.apiUrl}/upload/${file}`;
    },
  },
  actions: {
    setToken({ commit, dispatch }, token) {
      try {
        localStorage.setItem('token', token);
        commit('setUser', jwtd(token));
        commit('setToken', token);
      } catch (e) {
        dispatch('clearToken');
      }
    },
    clearToken({ commit }) {
      localStorage.removeItem('token');
      commit('clearUser');
      commit('clearToken');
    },
  },
  mutations: {
    setToken(state, token) {
      state.token = token;
    },
    setUser(state, user) {
      state.user = user;
    },
    clearToken(state) {
      state.token = null;
    },
    clearUser(state) {
      state.user = null;
    },
  },
});
