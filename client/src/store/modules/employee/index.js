/**
 * Auth Module
 */
import Vue from "vue";
// import firebase from 'firebase';
import Nprogress from "nprogress";
import axios from "axios";
import AppConfig from "Constants/AppConfig";

const state = {
  employees: [],
  error: {},
  total: 0,
  created_flag: false
};

// getters
const getters = {
  getEmployees: state => {
    return state.employees;
  },

  getEmployeeError: state => {
    return state.error;
  },
  getEmployeeCreatedFlag: state => {
    return state.created_flag;
  }
};

// actions
const actions = {
  resetEmployErrors(context, payload) {
    return context.commit("resetEmployErrors", payload);
  },
  addEmployee(context, payload) {
    // context.commit("signupUser");
    axios
      .post(`${AppConfig.baseURL}/api/users/create`, payload)
      .then(response => {
        if (response.data.success) {
          Nprogress.done();

          setTimeout(() => {
            context.commit(
              "createEmployeeSuccess",
              "New Employee created successfully."
            );
          }, 100);
          return context.dispatch("getEmployeeList", payload);
        } else {
          return context.commit("createEmployeeFailure", response.data);
        }
      })
      .catch(err => {
        return context.commit("createEmployeeFailure", err);
      });
  },
  updateEmployee(context, payload) {
    // context.commit("signupUser");
    axios
      .post(`${AppConfig.baseURL}/api/users/update`, payload)
      .then(response => {
        if (response.data.success) {
          Nprogress.done();
          setTimeout(() => {
            context.commit(
              "createEmployeeSuccess",
              "Employee updated successfully."
            );
          }, 100);
          return context.dispatch("getEmployeeList", payload);
        } else {
          return context.commit("createEmployeeFailure", response.data);
        }
      })
      .catch(err => {
        return context.commit("createEmployeeFailure", err);
      });
  },
  deleteEmployee(context, payload) {
    axios
      .post(`${AppConfig.baseURL}/api/users/delete`, payload)
      .then(response => {
        if (response.data.success) {
          Vue.notify({
            group: "loggedIn",
            type: "success",
            text: "Employee deleted successfully."
          });
          context.dispatch("getEmployeeList", payload);
        }
      })
      .catch(err => console.log(err));
  },
  getEmployeeList(context, payload) {
    axios.post(`${AppConfig.baseURL}/api/users`, payload).then(response => {
      if (response.data) {
        Nprogress.done();
        context.commit("getEmployeeListSuccess", response.data);
      } else {
        context.commit("getEmployeeListFailure");
      }
    });
  },
  clearCreateState(context) {}
};

// mutations
const mutations = {
  createEmployeeSuccess(state, text) {
    Vue.notify({
      group: "loggedIn",
      type: "success",
      text: text
    });
    state.created_flag = true;
    return true;
  },
  createEmployeeFailure(state, error) {
    Nprogress.done();
    state.error = error;
    state.created_flag = false;
    return false;
  },
  getEmployeeListSuccess(state, data) {
    Nprogress.done();
    state.employees = data.users;
    state.total = data.totals;
    state.error = {};
    state.created_flag = false;
  },
  getEmployeeListFailure(state) {
    Nprogress.done();
    state.employees = [];
    state.total = 0;
    state.created_flag = false;
  },
  resetEmployErrors(state, data) {
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
