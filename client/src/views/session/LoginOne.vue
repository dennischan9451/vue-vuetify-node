<template>
	<div class="session-wrapper">
		<!-- <div class="session-left">
			<session-slider-widget></session-slider-widget>
		</div> -->
		<div class="session-right ml-0 text-xs-center h-vh-100">
			<div class="session-table-cell my-auto h-100">
				<div class="session-content">
					<!-- <img :src="appLogo" class="img-responsive mb-3" width="78" height="78" /> -->
          <v-layout row wrap justify-space-between>
          <v-flex xs12 sm1 class="h-vh-100 mt--100">
          </v-flex>
          <v-flex xs12 sm11 class="my-auto">
            <h2 class="mb-3">{{$t('message.loginToAdmin')}}</h2>
            <p class="fs-14">{{$t('message.enterUsernameAndPasswordToAccessControlPanelOf')}} {{brand}}.</p>
            <v-form v-model="valid" class="mb-4">
              <v-text-field label="Email" v-model="email" :rules="emailRules" :error-messages="this.error.email" required></v-text-field>
              <v-text-field label="Password" @keydown.enter="submit" v-model="password" type="password" :rules="passwordRules" :error-messages="this.error.password" required></v-text-field>

              <!-- <router-link class="mb-1" to="/session/forgot-password">{{$t('message.forgotPassword')}}?</router-link> -->
              <div>
                <v-btn large @click="submit" :disabled="this.email.length === 0 || this.password.length === 0 " block color="primary">{{$t('message.loginNow')}}</v-btn>
                <!-- <v-btn large @click="onCreateAccount" block color="warning">{{$t('message.createAccount')}}</v-btn> -->
              </div>
              
            </v-form>
          </v-flex>
          </v-layout>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
// import firebase from "firebase";
import { mapGetters } from "vuex";
import SessionSliderWidget from "Components/Widgets/SessionSlider";
import AppConfig from "Constants/AppConfig";

import AuthService from "../../auth/AuthService";

const auth = new AuthService();
const { login, logout, authenticated, authNotifier } = auth;

export default {
  components: {
    SessionSliderWidget
  },
  data() {
    return {
      checkbox: false,
      valid: false,
      email: "",
      emailRules: [v => !!v || "Email is required"],
      password: "",
      passwordRules: [v => !!v || "Password is required"],
      appLogo: AppConfig.appLogo2,
      brand: AppConfig.brand
    };
  },
  methods: {
    submit() {
      const user = {
        email: this.email,
        password: this.password
      };
      this.$store.dispatch("signIn", user);
    },
    onCreateAccount() {
      this.$router.push("/register");
    }
  },
  computed: {
    ...mapGetters(["error"])
  }
};
</script>