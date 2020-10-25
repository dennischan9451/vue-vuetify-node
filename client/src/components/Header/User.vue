<template>
   <v-menu offset-y origin="right top" left content-class="language-dropdown" transition="slide-y-transition" nudge-top="-10" class="user-block-wrap d-none">
		<v-btn icon large slot="activator">
			<img src="/static/avatars/user-13.jpg" alt="avatar" height="40" width="40" class="img-responsive rounded-circle" />
		</v-btn>
		<div class="dropdown-content">
         <div class="dropdown-top white--text primary">
            <span class="white--text fs-14 fw-bold d-block">{{getUser.username}}</span>
            <span class="d-block fs-12 fw-light">{{getUser.nickname}}</span>
         </div>
         <v-list class="dropdown-list">
            <template v-for="userLink in userLinks" v-if="userLink.id !== 4">
               <v-list-tile :to="getMenuLink(userLink.path)" :key="userLink.id">
                  <i :class="userLink.icon"></i>
                  <span>{{$t(userLink.title)}}</span>
               </v-list-tile>
            </template>
            <template v-else>
               <v-list-tile @click="logoutUser" :key="userLink.id">
                  <i :class="userLink.icon"></i>
                  <span>{{$t(userLink.title)}}</span>
               </v-list-tile>
            </template>
         </v-list>
      </div>
	</v-menu>
</template>
<script>
import { getCurrentAppLayout } from "Helpers/helpers";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      userLinks: [
        {
          id: 1,
          title: "message.logOut",
          icon: "ti-power-off mr-3 error--text"
        }
      ]
    };
  },
  methods: {
    logoutUser() {
      this.$store.dispatch("logout", this.$router);
    },
    getMenuLink(path) {
      return "/" + getCurrentAppLayout(this.$router) + path;
    }
  },
  computed: {
    ...mapGetters(["getUser"])
  }
};
</script>
