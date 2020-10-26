/**
 * Sidebar Module
 */

import { menus } from "./data.js";

const state = {
  menus
};

const getters = {
  menus: state => {
    return state.menus;
  }
};

const actions = {
  setActiveMenuGroup(context, payload) {
    context.commit("setActiveMenuGroupHandler", payload);
  },
  resetMenu(context) {
    const index = state.menus.Basic.map((value, index) => {
      return value.path;
    }).indexOf("/employee");
    if (localStorage.user_role == "0" && index < 0) {
      state.menus.Basic.push({
        action: "zmdi-crop",
        title: "message.employee",
        active: false,
        items: null,
        icon: "ti-medall",
        path: "/employee"
      });
    } else if (localStorage.user_role == "1") {
      if (index > -1) {
        state.menus.Basic.pop();
      }
    }
  }
};

const mutations = {
  setActiveMenuGroupHandler(state, router) {
    let fullPath = router.history.current.fullPath;
    let path = fullPath.split("/");
    let matchedPath = "/" + path[2] + "/" + path[3];
    for (const category in state.menus) {
      for (const menuGroup in state.menus[category]) {
        if (state.menus[category][menuGroup].items !== null) {
          for (const matched in state.menus[category][menuGroup].items) {
            if (
              state.menus[category][menuGroup].items[matched].path ==
                matchedPath ||
              state.menus[category][menuGroup].items[matched].path == fullPath
            ) {
              state.menus[category][menuGroup].active = true;
            }
          }
        }
      }
    }
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
