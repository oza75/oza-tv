import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/assets/scss/main.scss'
import './registerServiceWorker'
import {url} from "@/classes/TMDb";
// @ts-ignore
import VueCarousel from 'vue-carousel';
import Storage from "@/classes/Storage";
import Recommended from "@/classes/Recommended";
import 'simplebar'; // or "import SimpleBar from 'simplebar';" if you want to use it manually.
import 'simplebar/dist/simplebar.css';
// @ts-ignore
import Autocomplete from 'v-autocomplete'
// @ts-ignore
import VSelect from 'vue-select';
// @ts-ignore
import VTooltip from 'v-tooltip'
// You need a specific loader for CSS files like https://github.com/webpack/css-loader
import 'v-autocomplete/dist/v-autocomplete.css'
import 'vue-select/dist/vue-select.css';
import DataType from "@/classes/DataType";

Vue.config.productionTip = false
Vue.component("pagination", require('@/components/Pagination').default)
Vue.component("list-movies", require('@/components/ListMovies').default)
Vue.component('v-select', VSelect)
Vue.component('inline-select', require("@/components/InlineSelect").default)
Vue.use(VueCarousel);
Vue.use(Autocomplete)
Vue.use(VTooltip)

// @ts-ignore
new Vue({
    router,
    store,
    render: h => h(App),
    data: {
        type: DataType
    },
    computed: {
        dataType: function () {
            // @ts-ignore
            return this.type.value
        }
    },
    methods: {
        image(link: string, size: string = "w185") {
            return link ? url + size + link : null;
        },
        date(date: string) {
            let d: Date = new Date(date);
            return d.getFullYear();
        },
        limit(text: string, take: number) {
            return text ? text.substr(0, take) + (text.length > take ? "..." : "") : text;
        },
        addToLikedList(item: any, type: string = 'movies', base: string = 'movie') {
            let likedList: any = Storage.get('liked-list', {})
            let items: Array<any> = likedList[type] || []
            // @ts-ignore
            if (!this.likedHas(item.id, items, 'movies'))
                items.push(item)
            likedList[type] = items;

            Storage.put('liked-list', likedList);
            Recommended.sync(type, base);
        },
        addMovieToLikedList(item: any) {
            // @ts-ignore
            this.addToLikedList(item, 'movies')
        },
        addTvToLikedList(item: any) {
            // @ts-ignore
            this.addToLikedList(item, 'tv', 'tv')
        },
        removeToLikedList(movie: any, type: string = 'movies', base: string = 'movie') {
            let likedList: any = Storage.get('liked-list', {})
            let movies: Array<any> = likedList[type] || []
            let index: number = movies.findIndex((m: any) => m.id == movie.id);
            if (index > -1) movies.splice(index, 1);
            likedList[type] = movies;

            Storage.put('liked-list', likedList);
            Recommended.sync(type, base);
        },
        removeMovieToLikedList(movie: any) {
            // @ts-ignore
            this.removeToLikedList(movie, 'movies')
        },
        removeTvToLikedList(movie: any) {
            // @ts-ignore
            this.removeToLikedList(movie, 'tv', 'tv')
        },
        likedHas(id: string, movies?: Array<any>, type: string = 'movies') {
            movies = movies || Storage.get('liked-list', {})[type] || []
            // @ts-ignore
            let index: number = movies.findIndex((m: any) => m.id === id)
            return index > -1;
        },
        likedMoviesHas(id: string, movies?: Array<any>) {
            // @ts-ignore
            return this.likedHas(id, movies)
        },
        likedTvHas(id: string, movies?: Array<any>) {
            // @ts-ignore
            return this.likedHas(id, movies, 'tv')
        },
        chunk(array: Array<any>, size: number) {
            const chunked_arr = [];
            for (let i = 0; i < array.length; i++) {
                const last = chunked_arr[chunked_arr.length - 1];
                if (!last || last.length === size) {
                    chunked_arr.push([array[i]]);
                } else {
                    last.push(array[i]);
                }
            }
            return chunked_arr;
        }
    }
}).$mount('#app')
