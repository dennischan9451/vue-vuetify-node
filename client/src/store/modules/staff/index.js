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
  staffs: [],
  error: {},
  total: 0,
  created_flag: false
};

// getters
const getters = {
  getStaffs: state => {
    return state.staffs;
  },

  getStaffError: state => {
    return state.error;
  },
  getStaffCreatedFlag: state => {
    return state.created_flag;
  }
};

// actions
const actions = {
  resetStaffErrors(context, payload) {
    return context.commit("resetStaffErrors", payload);
  },
  addStaff(context, payload) {
    // context.commit("signupUser");
    axios
      .post(`${AppConfig.baseURL}/api/staffs/create`, payload)
      .then(response => {
        if (response.data.success) {
          Nprogress.done();

          setTimeout(() => {
            context.commit(
              "createStaffSuccess",
              "New Staff created successfully."
            );
          }, 100);
          return context.dispatch("getStaffList", payload);
        } else {
          return context.commit("createStaffFailure", response.data);
        }
      })
      .catch(err => {
        return context.commit("createStaffFailure", err);
      });
  },
  updateStaff(context, payload) {
    // context.commit("signupUser");
    axios
      .post(`${AppConfig.baseURL}/api/staffs/update`, payload)
      .then(response => {
        if (response.data.success) {
          Nprogress.done();
          setTimeout(() => {
            context.commit("createStaffSuccess", "Staff updated successfully.");
          }, 100);
          return context.dispatch("getStaffList", payload);
        } else {
          return context.commit("createStaffFailure", response.data);
        }
      })
      .catch(err => {
        return context.commit("createStaffFailure", err);
      });
  },
  deleteStaff(context, payload) {
    axios
      .post(`${AppConfig.baseURL}/api/staffs/delete`, payload)
      .then(response => {
        if (response.data.success) {
          Vue.notify({
            group: "loggedIn",
            type: "success",
            text: "Staff deleted successfully."
          });
          context.dispatch("getStaffList", payload);
        }
      })
      .catch(err => console.log(err));
  },
  getStaffList(context, payload) {
    axios.post(`${AppConfig.baseURL}/api/staffs`, payload).then(response => {
      if (response.data) {
        Nprogress.done();
        context.commit("getStaffListSuccess", response.data);
      } else {
        context.commit("getStaffListFailure");
      }
    });
  },
  clearCreateState(context) {}
};

// mutations
const mutations = {
  createStaffSuccess(state, text) {
    Vue.notify({
      group: "loggedIn",
      type: "success",
      text: text
    });
    state.created_flag = true;
    return true;
  },
  createStaffFailure(state, error) {
    Nprogress.done();
    state.error = error;
    state.created_flag = false;
    return false;
  },
  getStaffListSuccess(state, data) {
    Nprogress.done();
    state.staffs = data.staffs;
    state.total = data.totals;
    state.error = {};
    state.created_flag = false;
  },
  getStaffListFailure(state) {
    Nprogress.done();
    state.staffs = [];
    state.total = 0;
    state.created_flag = false;
  },
  resetStaffErrors(state, data) {
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
