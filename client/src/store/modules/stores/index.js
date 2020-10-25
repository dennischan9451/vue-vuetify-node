/**
 * Auth Module
 */
import Vue from "vue";
// import firebase from 'firebase';
import Nprogress from "nprogress";
import axios from "axios";
import AppConfig from "Constants/AppConfig";

import { mapGetters } from "vuex";

const state = {
  stores: [],
  error: {},
  total: 0,
  created_flag: false
};

// getters
const getters = {
  getStores: state => {
    return state.stores;
  },

  getStoreError: state => {
    return state.error;
  },
  getStoreCreatedFlag: state => {
    return state.created_flag
  }
};

// actions
const actions = {
  addStore(context, payload) {
    // context.commit("signupUser");
    axios
      .post(`${AppConfig.baseURL}/api/stores/create`, payload)
      .then(response => {
        if (response.data.success) {
          Nprogress.done();

          setTimeout(() => {
            context.commit("createStoreSuccess", "New Store created successfully.");
          }, 100);
          return context.dispatch('getStoreList', payload);
        } else {
          return context.commit("createStoreFailure", response.data);
        }
      })
      .catch(err => {
        return context.commit("createStoreFailure", err);
      });
  },
  updateStore(context, payload) {
    // context.commit("signupUser");
    axios
      .post(`${AppConfig.baseURL}/api/stores/update`, payload)
      .then(response => {
        if (response.data.success) {
          Nprogress.done();
          setTimeout(() => {
            context.commit("createStoreSuccess", "Store updated successfully.");
          }, 100);
          return context.dispatch('getStoreList', payload);
        } else {
          return context.commit("createStoreFailure", response.data);
        }
      })
      .catch(err => {
        return context.commit("createStoreFailure", err);
      });
  },
  deleteStore(context, payload) {
    axios
      .post(`${AppConfig.baseURL}/api/stores/delete`, payload)
      .then(response => {
        if (response.data.success) {
          Vue.notify({
            group: "loggedIn",
            type: "success",
            text: "Store deleted successfully."
          });
          context.dispatch('getStoreList', payload);
        }
      })
      .catch(err => console.log(err))
  },
  getStoreList(context, payload) {
    axios
      .post(`${AppConfig.baseURL}/api/stores`, payload)
      .then(response => {
        if (response.data) {
          Nprogress.done();
          context.commit("getStoreListSuccess", response.data);
        } else {
          context.commit("getStoreListFailure");

        }
      })
  },
  clearCreateState(context) {

  }
};

// mutations
const mutations = {
  createStoreSuccess(state, text) {
    Vue.notify({
      group: "loggedIn",
      type: "success",
      text: text
    });
    state.created_flag = true;
    return true;
  },
  createStoreFailure(state, error) {
    Nprogress.done();
    state.error = error;
    state.created_flag = false;
    return false;
  },
  getStoreListSuccess(state, data) {
    Nprogress.done();
    state.stores = data.stores;
    state.total = data.totals;
    state.error = {};
    state.created_flag = false;
  },
  getStoreListFailure(state) {
    Nprogress.done();
    state.stores = [];
    state.total = 0;
    state.created_flag = false;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
