import Vue from "vue";
import Vuex from "vuex";

// modules
import auth from "./modules/auth";
import settings from "./modules/settings";
import sidebar from "./modules/sidebar";
import customer from "./modules/customer";
import stores from "./modules/stores";
import service from "./modules/service";
import staff from "./modules/staff";
import repair from "./modules/repair";
import employee from "./modules/employee";

Vue.use(Vuex);

export const store = new Vuex.Store({
  modules: {
    auth,
    settings,
    customer,
    stores,
    service,
    sidebar,
    staff,
    repair,
    employee,
  }
});
