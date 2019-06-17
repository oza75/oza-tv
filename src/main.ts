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
// You need a specific loader for CSS files like https://github.com/webpack/css-loader
import 'v-autocomplete/dist/v-autocomplete.css'
import 'vue-select/dist/vue-select.css';

Vue.config.productionTip = false
Vue.component("pagination", require('@/components/Pagination').default)
Vue.component("list-movies", require('@/components/ListMovies').default)
Vue.component('v-select', VSelect)

Vue.use(VueCarousel);
Vue.use(Autocomplete)

new Vue({
    router,
    store,
    render: h => h(App),
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
        addMovieToLikedList(movie: any) {
            let likedList: any = Storage.get('liked-list', {})
            let movies: Array<any> = likedList.movies || []
            if (!this.likedMoviesHas(movie.id, movies))
                movies.push(movie)
            likedList.movies = movies;

            Storage.put('liked-list', likedList);
            Recommended.sync('movies');
        },
        removeMovieToLikedList(movie: any) {
            let likedList: any = Storage.get('liked-list', {})
            let movies: Array<any> = likedList.movies || []
            let index: number = movies.findIndex((m: any) => m.id == movie.id);
            if (index > -1) movies.splice(index, 1);
            likedList.movies = movies;

            Storage.put('liked-list', likedList);
            Recommended.sync('movies');
        },
        likedMoviesHas(id: string, movies?: Array<any>) {
            movies = movies || Storage.get('liked-list', {}).movies || []
            // @ts-ignore
            let index: number = movies.findIndex((m: any) => m.id === id)
            return index > -1;
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
