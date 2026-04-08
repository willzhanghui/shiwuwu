import { createRouter, createWebHistory } from 'vue-router';
import BigScreen from '../views/BigScreen.vue';
import Management from '../views/Management.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'BigScreen',
      component: BigScreen,
    },
    {
      path: '/manage',
      name: 'Management',
      component: Management,
    },
  ],
});

export default router;
