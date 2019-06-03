import Vue from 'vue'
import Router, {RouteConfig} from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

export const isString = function (obj: any) {
    return typeof obj === "string";
}

export const makeRoute = function (path: string, component: any, name?: string, meta?: any) {
    return {
        path,
        name,
        component: isString(component) ? () => import(/* webpackChunkName: "[request]" */ `./views/${component}.vue`) : component,
        meta
    }
}

const routes: Array<RouteConfig> = [
    makeRoute('/', 'Home', 'home', {title: "Tendance"}),
    makeRoute('/new-release', 'NewRelease', 'release', {title: "Nouvelles Sortie"}),
    makeRoute('/recommended', 'Recommended', 'recommended', {title: "Ca va vous plaire"}),
    makeRoute('/coming-soon', 'ComingSoon', 'coming_soon', {title: "Films à venir"}),
    makeRoute('/category/:id', 'Category', 'categories.show', {title: "Catégorie", isCategory: true}),
    makeRoute('/movies/:id', 'Movies/Show', 'movies.show', {title: "Détails"}),
]


export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})
