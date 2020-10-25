/**
 * App Entry File
 * Vuely: A Powerfull Material Design Admin Template
 * Copyright 2018. All Rights Reserved
 * Created By: The Iron Network, LLC
 * Made with Love
 */
import "babel-polyfill";
import Vue from "vue";
import Vuetify from "vuetify";
import Notifications from "vue-notification";
import velocity from "velocity-animate";
import Nprogress from "nprogress";
import VueI18n from "vue-i18n";
import fullscreen from "vue-fullscreen";
// global components
import GlobalComponents from "./globalComponents";

// app.vue
import App from "./App";

// router
import router from "./router";

// store
import { store } from "./store/store";

// firebase
// import './firebase'

// include all css files
import "./lib/VuelyCss";

// messages
import messages from "./lang";
/* import axios from "axios"; */
import "@mdi/font/css/materialdesignicons.css";
import "material-design-icons-iconfont/dist/material-design-icons.css";

// navigation guards before each
router.beforeEach((to, from, next) => {
  Nprogress.start();
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (localStorage.getItem("jwtToken") === null) {
      next({
        path: "/login",
        query: { redirect: to.fullPath }
      });
    } else {
      next();
    }
  } else {
    next(); // make sure to always call next()!
  }
});

// navigation guard after each
router.afterEach((to, from) => {
  Nprogress.done();
  setTimeout(() => {
    const contentWrapper = document.querySelector(".v-content__wrap");
    if (contentWrapper !== null) {
      contentWrapper.scrollTop = 0;
    }
    const boxedLayout = document.querySelector(
      ".app-boxed-layout .app-content"
    );
    if (boxedLayout !== null) {
      boxedLayout.scrollTop = 0;
    }
    const miniLayout = document.querySelector(".app-mini-layout .app-content");
    if (miniLayout !== null) {
      miniLayout.scrollTop = 0;
    }
  }, 200);
});

// plugins
/* Vue.use(axios); */

Vue.use(Vuetify, {
  theme: store.getters.selectedTheme.theme,
  icons: {
    iconfont: "mdi" // default - only for display purposes,
  }
});
Vue.use(VueI18n);
Vue.use(Notifications, { velocity });
Vue.use(fullscreen);
Vue.use(GlobalComponents);

// Create VueI18n instance with options
const i18n = new VueI18n({
  locale: store.getters.selectedLocale.locale, // set locale
  messages // set locale messages
});

/* eslint-disable no-new */
new Vue({
  store,
  i18n,
  router,
  render: h => h(App),
  components: { App }
}).$mount("#app");
