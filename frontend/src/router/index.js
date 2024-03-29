import Vue from 'vue';
import VueRouter from 'vue-router';
import HomeView from '@/views/HomeView.vue';

Vue.use(VueRouter);

const routes = [
  // TODO
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/RegisterView.vue'),
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
  },
  {
    path: '/posts/create',
    name: 'post-create',
    component: () => import('@/views/CreatePostView.vue'),
  },
  {
    path: '/posts/:id/modify',
    name: 'post-modify',
    component: () => import('@/views/CreatePostView.vue'),
  },
  {
    path: '/posts/:id',
    name: 'post-view',
    component: () => import('@/views/CommentView.vue'),
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@/views/ModifyProfilView.vue'),
  },
  {
    path: '/logout',
    name: 'logout',
    component: () => import('@/views/LogoutView.vue'),
  },
];

// Gestion système d'historique
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  window.scrollTo(0, 0);
  const publicPages = ['login', 'register'];
  const authRequired = !publicPages.includes(to.name);
  const loggedIn = localStorage.getItem('token');
  if (authRequired && !loggedIn) {
    next({ name: 'login' });
  } else {
    next();
  }
});

export default router;
