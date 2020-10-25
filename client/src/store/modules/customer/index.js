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
  customers: [],
  error: {},
  total: 0,
  created_flag: false
};

// getters
const getters = {
  getCustomers: state => {
    return state.customers;
  },

  getCustomerError: state => {
    return state.error;
  },
  getCustomerCreatedFlag: state => {
    return state.created_flag
  }
};

// actions
const actions = {
  addCustomer(context, payload) {
    // context.commit("signupUser");
    axios
      .post(`${AppConfig.baseURL}/api/customers/create`, payload)
      .then(response => {
        if (response.data.success) {
          Nprogress.done();

          setTimeout(() => {
            context.commit("createCustomerSuccess", "New Customer created successfully.");
          }, 100);
          return context.dispatch('getCustomerList', payload);
        } else {
          return context.commit("createCustomerFailure", response.data);
        }
      })
      .catch(err => {
        return context.commit("createCustomerFailure", err);
      });
  },
  updateCustomer(context, payload) {
    // context.commit("signupUser");
    axios
      .post(`${AppConfig.baseURL}/api/customers/update`, payload)
      .then(response => {
        if (response.data.success) {
          Nprogress.done();
          setTimeout(() => {
            context.commit("createCustomerSuccess", "Customer updated successfully.");
          }, 100);
          return context.dispatch('getCustomerList', payload);
        } else {
          return context.commit("createCustomerFailure", response.data);
        }
      })
      .catch(err => {
        return context.commit("createCustomerFailure", err);
      });
  },
  deleteCustomer(context, payload) {
    axios
      .post(`${AppConfig.baseURL}/api/customers/delete`, payload)
      .then(response => {
        if (response.data.success) {
          Vue.notify({
            group: "loggedIn",
            type: "success",
            text: "Customer deleted successfully."
          });
          context.dispatch('getCustomerList', payload);
        }
      })
      .catch(err => console.log(err))
  },
  getCustomerList(context, payload) {
    axios
      .post(`${AppConfig.baseURL}/api/customers`, payload)
      .then(response => {
        if (response.data) {
          Nprogress.done();
          context.commit("getCustomerListSuccess", response.data);
        } else {
          context.commit("getCustomerListFailure");

        }
      })
  },
  clearCreateState(context) {

  }
};

// mutations
const mutations = {
  createCustomerSuccess(state, text) {
    Vue.notify({
      group: "loggedIn",
      type: "success",
      text: text
    });
    state.created_flag = true;
    return true;
  },
  createCustomerFailure(state, error) {
    Nprogress.done();
    state.error = error;
    state.created_flag = false;
    return false;
  },
  getCustomerListSuccess(state, data) {
    Nprogress.done();
    state.customers = data.customers;
    state.total = data.totals;
    state.error = {};
    state.created_flag = false;
  },
  getCustomerListFailure(state) {
    Nprogress.done();
    state.customers = [];
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
