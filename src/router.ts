import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "list",
      component: () => import(/* webpackChunkName: "list" */ "./views/List.vue")
    },
    {
      path: "/settings",
      name: "settings",
      component: () =>
        import(/* webpackChunkName: "settings" */ "./views/Settings.vue")
    },
    {
      path: "/qr-list",
      name: "qrlist",
      component: () =>
        import(/* webpackChunkName: "qrlist" */ "./views/QRList.vue")
    },
    {
      path: "/qr/:userId/:guid",
      name: "qr",
      component: () => import(/* webpackChunkName: "qr" */ "./views/QR.vue")
    }
  ]
});
