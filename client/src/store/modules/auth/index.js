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
  user: {},
  isUserSigninWithAuth0: Boolean(localStorage.getItem("isUserSigninWithAuth0")),
  error: {}
};

// getters
const getters = {
  getUser: state => {
    return state.user;
  },
  isUserSigninWithAuth0: state => {
    return state.isUserSigninWithAuth0;
  },
  error: state => {
    return state.error;
  }
};

// actions
const actions = {
  setCurrentUser(context, userinfo) {
    state.user = userinfo;
  },
  logout(context) {
    Nprogress.start();
    context.commit("logoutUser");
  },
  register(context, payload) {
    context.commit("signupUser");
    axios
      .post(`${AppConfig.baseURL}/api/users/register`, payload)
      .then(response => {
        if (response.data.success) {
          Nprogress.done();
          setTimeout(() => {
            context.commit("signUpUserSuccess");
          }, 500);
        } else {
          context.commit("signUpUserFailure", response.data.error);
        }
      })
      .catch(err => {
        context.commit("signUpUserFailure", error);
      });
  },
  signIn(context, payload) {
    context.commit("loginUser");
    axios
      .post(`${AppConfig.baseURL}/api/users/login`, payload)
      .then(response => {
        if (response.data.success) {
          Nprogress.done();
          setTimeout(() => {
            context.commit("loginUserSuccess", response.data);
          }, 300);
        } else {
          context.commit("loginUserFailure", {
            message: "Your credentials are incorrect"
          });
        }
      })
      .catch(error => {
        console.log({ error });
        if (error.response.status == 400) {
          if (error.response.data) {
            context.commit("loginUserFailure", {
              message: "Your credentials are incorrect"
            });
            return;
          }
        }
        context.commit("loginUserFailure", error.response.email);
      });
  }
};

// mutations
const mutations = {
  loginUser(state) {
    Nprogress.start();
  },
  loginUserSuccess(state, payload) {
    state.user = payload.user;
    localStorage.setItem("user_role", payload.user.role);
    localStorage.setItem("jwtToken", payload.token);
    state.isUserSigninWithAuth0 = false;
    router.push("/ftu/customer");
    setTimeout(function() {
      Vue.notify({
        group: "loggedIn",
        type: "success",
        text: "User Logged In Successfully!"
      });
    }, 300);
  },
  loginUserFailure(state, error) {
    state.error = error;
    Nprogress.done();
    if (error.message) {
      Vue.notify({
        group: "loggedIn",
        type: "error",
        text: error.message
      });
    }
  },
  logoutUser(state) {
    state.user = null;
    localStorage.removeItem("user_role");
    localStorage.removeItem("jwtToken");
    Nprogress.done();
    router.push("/login");
  },
  signUpUser(state) {
    Nprogress.start();
  },
  signUpUserSuccess(state) {
    Vue.notify({
      group: "loggedIn",
      type: "success",
      text: "User account registered successfully."
    });
    router.push("/login");
  },
  signUpUserFailure(state, error) {
    Nprogress.done();
    state.error = error;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
