/**
 * Vuely Global Components
 */
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import AppSectionLoader from "Components/AppSectionLoader/AppSectionLoader";
import { RotateSquare2 } from "vue-loading-spinner";

// App Card component
import AppCard from "Components/AppCard/AppCard";

const GlobalComponents = {
  install(Vue) {
    Vue.component("appCard", AppCard);
    Vue.component("vuePerfectScrollbar", VuePerfectScrollbar);
    Vue.component("appSectionLoader", AppSectionLoader);
    Vue.component("rotateSquare2", RotateSquare2);
  }
};

export default GlobalComponents;
