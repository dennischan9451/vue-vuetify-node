<template>
	<v-content>
		<div class="session-wrapper">
			<div class="session-left">
				<session-slider-widget></session-slider-widget>
			</div>
			<div class="session-right text-xs-center">
				<div class="session-table-cell">
					<div class="session-content">
						<!-- <img 
						:src="appLogo" 
						class="img-responsive mb-3" 
						width="78" 
						height="78" 
					/> -->
						<h2 class="mb-3">{{$t('message.signUp')}}</h2>
						<p class="fs-14">{{$t('message.havingAnAccount')}}
							<router-link to="/session/login">{{$t('message.login')}}</router-link>
						</p>
						<v-form class="mb-4">
							<v-text-field label="First name" v-model="first_name" :rules="nameRules" :counter="20" :error-messages="this.error.first_name" required></v-text-field>
							<v-text-field label="Last name" v-model="last_name" :rules="nameRules" :counter="20" :error-messages="this.error.last_name" required></v-text-field>
							<v-text-field label="E-mail" v-model="email" :rules="emailRules" :error-messages="this.error.email" required></v-text-field>
							<v-text-field label="Password" v-model="password" :rules="passwordRules" :error-messages="this.error.password" type="password" required></v-text-field>
							<v-text-field label="Confirm Password" v-model="password2" :rules="passwordRules" type="password" :error-messages="this.error.password2" required></v-text-field>
							<v-btn large @click="submit" block color="primary" class="mb-3">{{$t('message.signUp')}}</v-btn>
						</v-form>
					</div>
				</div>
			</div>
		</div>
	</v-content>

</template>

<script>
import SessionSliderWidget from "Components/Widgets/SessionSlider";
import AppConfig from "Constants/AppConfig";
import { mapGetters } from "vuex";
import Dropzone from "Components/Widgets/Dropzone";

export default {
  components: {
    SessionSliderWidget,
    Dropzone
  },
  data() {
    return {
      valid: false,
      email: "",
      first_name: "",
      last_name: "",
      nameRules: [
        v => !!v || "Name must be entered.",
        v => v.length <= 20 || "Number of characters must be less than 20."
      ],
      email: "",
      emailRules: [
        v =>
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
          "E-mail must be valid"
      ],
      password: "",
      password2: "",
      passwordRules: [v => !!v || "Password must be entered."],
      appLogo: AppConfig.appLogo2,
      brand: AppConfig.brand
    };
  },
  methods: {
    submit() {
      let userDetail = {
        first_name: this.first_name,
        last_name: this.last_name,
        email: this.email,
        password: this.password,
        password2: this.password2
      };
      this.$store.dispatch("register", userDetail);
      if (this.valid) {
      }
    }
  },
  computed: {
    ...mapGetters(["error"])
  }
};
</script>
