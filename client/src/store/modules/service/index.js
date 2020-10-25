/**
 * Auth Module
 */
import Vue from "vue";
// import firebase from 'firebase';
import Nprogress from "nprogress";
import router from "../../../router";
import axios from "axios";
import AppConfig from "Constants/AppConfig";

import { mapGetters } from "vuex";

const state = {
  services: [],
  error: {},
  total: 0,
  created_flag: false
};

// getters
const getters = {
  getServices: state => {
    return state.services;
  },

  getServiceError: state => {
    return state.error;
  },
  getServiceCreatedFlag: state => {
    return state.created_flag
  }
};

// actions
const actions = {
  addService(context, payload) {
    // context.commit("signupUser");
    axios
      .post(`${AppConfig.baseURL}/api/services/create`, payload)
      .then(response => {
        if (response.data.success) {
          Nprogress.done();

          setTimeout(() => {
            context.commit("createServiceSuccess", "New Service created successfully.");
          }, 100);
          return context.dispatch('getServiceList', payload);
        } else {
          return context.commit("createServiceFailure", response.data);
        }
      })
      .catch(err => {
        return context.commit("createServiceFailure", err);
      });
  },
  updateService(context, payload) {
    // context.commit("signupUser");
    axios
      .post(`${AppConfig.baseURL}/api/services/update`, payload)
      .then(response => {
        if (response.data.success) {
          Nprogress.done();
          setTimeout(() => {
            context.commit("createServiceSuccess", "Service updated successfully.");
          }, 100);
          return context.dispatch('getServiceList', payload);
        } else {
          return context.commit("createServiceFailure", response.data);
        }
      })
      .catch(err => {
        return context.commit("createServiceFailure", err);
      });
  },
  deleteService(context, payload) {
    axios
      .post(`${AppConfig.baseURL}/api/services/delete`, payload)
      .then(response => {
        if (response.data.success) {
          Vue.notify({
            group: "loggedIn",
            type: "success",
            text: "Service deleted successfully."
          });
          context.dispatch('getServiceList', payload);
        }
      })
      .catch(err => console.log(err))
  },
  getServiceList(context, payload) {
    axios
      .post(`${AppConfig.baseURL}/api/services`, payload)
      .then(response => {
        if (response.data) {
          Nprogress.done();
          context.commit("getServiceListSuccess", response.data);
        } else {
          context.commit("getServiceListFailure");

        }
      })
  },
  clearCreateState(context) {

  }
};

// mutations
const mutations = {
  createServiceSuccess(state, text) {
    Vue.notify({
      group: "loggedIn",
      type: "success",
      text: text
    });
    state.created_flag = true;
    return true;
  },
  createServiceFailure(state, error) {
    Nprogress.done();
    state.error = error;
    state.created_flag = false;
    return false;
  },
  getServiceListSuccess(state, data) {
    Nprogress.done();
    state.services = data.services;
    state.total = data.totals;
    state.error = {};
    state.created_flag = false;
  },
  getServiceListFailure(state) {
    Nprogress.done();
    state.services = [];
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
