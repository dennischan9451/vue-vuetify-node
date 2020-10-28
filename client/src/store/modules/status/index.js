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
  staff_status: [],
  repair_status: [],
  error: {},
  repair_total: 0,
  staff_total: 0,
  created_flag: false
};

// getters
const getters = {
  getRepairStatus: state => {
    return state.repair_status;
  },
  getStaffStatus: state => {
    return state.staff_status;
  },

  getStatusError: state => {
    return state.error;
  },
  getStatusCreatedFlag: state => {
    return state.created_flag;
  }
};

// actions
const actions = {
  resetStatusErrors(context, payload) {
    context.commit("resetStatusErrors", payload);
  },
  addStatus(context, payload) {
    // context.commit("signupUser");
    let url = ""
    if (payload.statustype == 0) {
      url = `${AppConfig.baseURL}/api/status/repair/create`;
    } else {
      url = `${AppConfig.baseURL}/api/status/staff/create`;
    }
    axios
      .post(url, payload)
      .then(response => {
        if (response.data.success) {
          Nprogress.done();

          setTimeout(() => {
            context.commit(
              "createStatusSuccess",
              "New Status created successfully."
            );
          }, 100);
          if (payload.statustype == 0) {
            return context.dispatch("getRepairStatusList", payload);
          } else {
            return context.dispatch("getStaffStatusList", payload);
          }
        } else {
          return context.commit("createStatusFailure", response.data);
        }
      })
      .catch(err => {
        return context.commit("createStatusFailure", err);
      });
  },
  updateStatus(context, payload) {
    // context.commit("signupUser");
    let url = "";
    if (payload.statustype == 0) {
      url = `${AppConfig.baseURL}/api/status/repair/update`;
    } else {
      url = `${AppConfig.baseURL}/api/status/staff/update`;
    }
    axios
      .post(url, payload)
      .then(response => {
        if (response.data.success) {
          Nprogress.done();
          setTimeout(() => {
            context.commit(
              "createStatusSuccess",
              "Status updated successfully."
            );
          }, 100);
          if (payload.statustype == 0) {
            return context.dispatch("getRepairStatusList", payload);
          } else {
            return context.dispatch("getStaffStatusList", payload);
          }
        } else {
          return context.commit("createStatusFailure", response.data);
        }
      })
      .catch(err => {
        return context.commit("createStatusFailure", err);
      });
  },
  deleteStatus(context, payload) {
    let url = "";
    if (payload.statustype == 0) {
      url = `${AppConfig.baseURL}/api/status/repair/delete`;
    } else {
      url = `${AppConfig.baseURL}/api/status/staff/delete`;
    }
    axios
      .post(url, payload)
      .then(response => {
        if (response.data.success) {
          Vue.notify({
            group: "loggedIn",
            type: "success",
            text: "Status deleted successfully."
          });
          if (payload.statustype == 0) {
            context.dispatch("getRepairStatusList", payload);
          } else {
            context.dispatch("getStaffStatusList", payload);
          }
        }
      })
      .catch(err => console.log(err));
  },
  getStaffStatusList(context, payload) {
    axios.post(`${AppConfig.baseURL}/api/status/staff`, payload).then(response => {
      if (response.data) {
        Nprogress.done();
        context.commit("getStaffStatusListSuccess", response.data);
      } else {
        context.commit("getStaffStatusListFailure");
      }
    });
  },

  getRepairStatusList(context, payload) {
    axios.post(`${AppConfig.baseURL}/api/status/repair`, payload).then(response => {
      if (response.data) {
        Nprogress.done();
        context.commit("getRepairStatusListSuccess", response.data);
      } else {
        context.commit("getRepairStatusListFailure");
      }
    });
  },
  clearCreateState(context) { }
};

// mutations
const mutations = {
  createStatusSuccess(state, text) {
    Vue.notify({
      group: "loggedIn",
      type: "success",
      text: text
    });
    state.created_flag = true;
    return true;
  },
  createStatusFailure(state, error) {
    Nprogress.done();
    state.error = error;
    state.created_flag = false;
    return false;
  },
  getStaffStatusListSuccess(state, data) {
    Nprogress.done();
    state.staff_status = data.staff_status;
    state.staff_total = data.totals;
    state.error = {};
    state.created_flag = false;
  },

  getRepairStatusListSuccess(state, data) {
    Nprogress.done();
    state.repair_status = data.repair_status;
    state.repair_total = data.totals;
    state.error = {};
    state.created_flag = false;
  },
  getStaffStatusListFailure(state) {
    Nprogress.done();
    state.staff_status = [];
    state.staff_total = 0;
    state.created_flag = false;
  },
  getRepairStatusListFailure(state) {
    Nprogress.done();
    state.repair_status = [];
    state.repair_total = 0;
    state.created_flag = false;
  },
  resetStatusErrors(state, data) {
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
