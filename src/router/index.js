import { createRouter, createWebHistory } from 'vue-router';

/* INFO rule
 * path
    1. camelCase 로 작성
    2. 파일 path와 동일하게 작성 예) folder1/folder2/my-file
 * name
    1. 파일명 작성 -> PascalCase 사용.
 * component
    1. 파일 path 작성
 */

const routes = [
  {
    path: '/',
    redirect: '/home' // Redirect root path to dashboard
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import(/* webpackChunkName: "home" */ "@/pages/Home.vue")
  },
  {
    path: '/loading',
    name: 'Load',
    component: () => import(/* webpackChunkName: "home" */ "@/pages/Load.vue")
  },
  {
    path: '/end',
    name: 'End',
    component: () => import(/* webpackChunkName: "end" */ "@/pages/End")
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;
export { routes }