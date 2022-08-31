import Vue from "vue";
import VueRouter from "vue-router";
import HomeView from "@/views/HomeView.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/about",
    name: "about",
    component: () => import("@/views/AboutView.vue"),
  },
  {
    path: "/register",
    name: "register",
    component: () => import("@/views/RegisterView.vue"),
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/LoginView.vue"),
  },
  {
    path: "/posts/create",
    name: "posts-create",
    component: () => import("@/views/CreatePostView.vue"),
  },
  {
    path: "/posts/:id/modify",
    name: "posts-modify",
    component: () => import("@/views/CreatePostView.vue"),
  },
  {
    path: "/posts/:id/comments",
    name: "comments",
    component: () => import("@/views/CommentView.vue"),
  },
  {
    path: "/profile",
    name:"profile",
    component: () => import("@/views/ModifyProfilView.vue"),
  },
  {
    path: "/logout",
    name: "logout",
    component: () => import("@/views/LogoutView.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  const publicPages = ['/login', '/register'];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem('token');
  if (authRequired && !loggedIn) {
    next('/login');
  }else {
    next();
  }
})

export default router;
