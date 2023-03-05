import type { App } from 'vue'
import { createWebHistory, createRouter } from "vue-router";

const router = createRouter({
    history : createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'init',
            component: () => import("@/pages/Init.vue")
        },
        {
            path: '/create',
            name: 'create',
            component: () => import("@/pages/Create.vue")
        },
        {
            path: '/home',
            name: 'home',
            component: () => import("@/pages/Home.vue")
        },
        {
            path: '/di/:name',
            name: 'di',
            component: () => import("@/pages/DI.vue")
        },
        {
            path: '/da/:daid',
            name: 'da',
            component: () => import("@/pages/DA.vue")
        },
        {
            path: '/auth/:name',
            name: 'auth',
            component: () => import("@/pages/Auth.vue")
        },
        {
            path: '/test',
            component: () => import("@/pages/Test.vue")
        }
    ]
})

export function setupRouter(app: App<Element>) {
    app.use(router);
}

export default router