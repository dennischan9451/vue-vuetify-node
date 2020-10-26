<template>
  <v-app :dark="darkMode" id="inspire" :class="[{ 
		'box-layout': boxLayout, 
		'collapse-sidebar': collapseSidebar, 
		'rtl-layout': rtlLayout
	}]">
    <router-view :auth="auth" :authenticated="authenticated"></router-view>
    <notifications group="loggedIn" position="top right" animation-type="velocity" />
  </v-app>
</template>

<script>
import { mapGetters } from "vuex";

import AuthService from "./auth/AuthService";

import jwt_decode from "jwt-decode";

import common from "@/common";

const auth = new AuthService();

const { login, logout, authenticated, authNotifier } = auth;

export default {
  data() {
    authNotifier.on("authChange", authState => {
      this.authenticated = authState.authenticated;
    });
    return {
      auth,
      authenticated,
      animation: {
        enter: {
          opacity: [1, 0],
          translateX: [0, -300],
          scale: [1, 0.2]
        },
        leave: {
          opacity: 0,
          height: 0
        }
      }
    };
  },
  mounted() {
    if (
      this.selectedLocale.locale === "he" ||
      this.selectedLocale.locale === "ar"
    ) {
      this.$store.dispatch("rtlLayout");
    }
  },
  beforeUpdate() {
    // Check for token
    if (localStorage.jwtToken) {
      // Set auth token header authoriztion
      common.setAuthToken(localStorage.jwtToken);
      // Decode token and get user info and exp
      const decoded = jwt_decode(localStorage.jwtToken);
      // Set user and isAuthenticated
      this.$store.dispatch("setCurrentUser", decoded);
      // Check for expired token
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        console.log("expired");
        // Logout user
        this.$store.dispatch("logout");
        // TODO: Clear current profile
        // Redirect to login
      }
    } else {
    }
  },
  computed: {
    ...mapGetters([
      "darkMode",
      "collapseSidebar",
      "boxLayout",
      "rtlLayout",
      "selectedLocale"
    ])
  }
};
</script>
