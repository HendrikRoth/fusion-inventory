import Vue from "vue";
import Buefy from "buefy";
// @ts-ignore
import StarRating from "vue-star-rating";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import { i18n } from "./plugins/i18n";

Vue.config.productionTip = false;
Vue.use(Buefy);
Vue.component("star-rating", StarRating);

Vue.filter("truncate", (text: string, stop: number, clamp: string) => {
  return text.slice(0, stop) + (stop < text.length ? clamp || ".." : "");
});

new Vue({
  i18n,
  router,
  store,
  render: (h: any) => h(App)
}).$mount("#app");
