import Vue from "vue";
import Router from "vue-router";

//routes
import defaultRoutes from "./default";

// session components
//const SignUpOne = () => import("Views/session/SignUpOne");
const LoginOne = () => import("Views/session/LoginOne");
//const LockScreen = () => import("Views/session/LockScreen");
//const ForgotPassword = () => import("Views/session/ForgotPassword");
//const ResetPassword = () => import("Views/session/ResetPassword");

const Auth0CallBack = () => import("Components/Auth0Callback/Auth0Callback");

Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    defaultRoutes,
    {
      path: "/callback",
      component: Auth0CallBack
    },
    {
      path: "/login",
      component: LoginOne,
      meta: {
        title: "message.login",
        breadcrumb: "Session / Login"
      }
    }
  ]
});
