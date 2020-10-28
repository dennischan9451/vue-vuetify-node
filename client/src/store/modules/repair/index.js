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
  repairs: [],
  error: {},
  total: 0,
  created_flag: false
};

// getters
const getters = {
  getRepairs: state => {
    return state.repairs;
  },

  getRepairError: state => {
    return state.error;
  },
  getRepairCreatedFlag: state => {
    return state.created_flag;
  }
};

// actions
const actions = {
  resetErrors(context, payload) {
    return context.commit("resetErrors", payload);
  },
  addRepair(context, payload) {
    // context.commit("signupUser");
    axios
      .post(`${AppConfig.baseURL}/api/repairs/create`, payload)
      .then(response => {
        if (response.data.success) {
          Nprogress.done();

          setTimeout(() => {
            context.commit(
              "createRepairSuccess",
              "New Repair created successfully."
            );
          }, 100);
          return context.dispatch("getRepairList", payload);
        } else {
          return context.commit("createRepairFailure", response.data);
        }
      })
      .catch(err => {
        return context.commit("createRepairFailure", err);
      });
  },
  updateRepair(context, payload) {
    // context.commit("signupUser");
    axios
      .post(`${AppConfig.baseURL}/api/repairs/update`, payload)
      .then(response => {
        if (response.data.success) {
          Nprogress.done();
          setTimeout(() => {
            context.commit(
              "createRepairSuccess",
              "Repair updated successfully."
            );
          }, 100);
          return context.dispatch("getRepairList", payload);
        } else {
          return context.commit("createRepairFailure", response.data);
        }
      })
      .catch(err => {
        return context.commit("createRepairFailure", err);
      });
  },
  deleteRepair(context, payload) {
    axios
      .post(`${AppConfig.baseURL}/api/repairs/delete`, payload)
      .then(response => {
        if (response.data.success) {
          Vue.notify({
            group: "loggedIn",
            type: "success",
            text: "Repair deleted successfully."
          });
          context.dispatch("getRepairList", payload);
        }
      })
      .catch(err => console.log(err));
  },
  getRepairList(context, payload) {
    axios.post(`${AppConfig.baseURL}/api/repairs`, payload).then(response => {
      if (response.data) {
        Nprogress.done();
        context.commit("getRepairListSuccess", response.data);
      } else {
        context.commit("getRepairListFailure");
      }
    });
  },
  clearCreateState(context) { }
};

// mutations
const mutations = {
  createRepairSuccess(state, text) {
    Vue.notify({
      group: "loggedIn",
      type: "success",
      text: text
    });
    state.created_flag = true;
    return true;
  },
  createRepairFailure(state, error) {
    Nprogress.done();
    state.error = error;
    state.created_flag = false;
    return false;
  },
  getRepairListSuccess(state, data) {
    Nprogress.done();
    state.repairs = data.repairs;
    state.total = data.totals;
    state.error = {};
    state.created_flag = false;
    return true;
  },
  getRepairListFailure(state) {
    Nprogress.done();
    state.repairs = [];
    state.total = 0;
    state.created_flag = false;
    return true;
  },
  resetErrors(state, data) {
    state.error = {};
    return true;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
