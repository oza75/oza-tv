<template>
    <div>
        <div v-if="!movies.length">
            <div class="row">
                <div class="col-md-6 col-lg-8 col-xs-12 col-sm-12">
                    <div class="alert default has-icon">
                        <div class="icon"><i class="fas fa-info"></i></div>
                        <div class="content">
                            Commencer par aimez plus de {{left < 0 ? 0 : left}} films pour avoir des recommandations.
                            <br>
                            Plus Vous aimez les films que vous aimez, plus vos recommandations seront pertinentes.
                        </div>
                    </div>
                </div>
            </div>
            <ListMovies @liked="liked" :likedCallback="likedCallback" :url="url" class="mt-4"/>
        </div>
        <div class="recommended-movies" v-else>
            <div class="listing-movies">
                <div class="movies-container grid">
                    <component :is="component" @liked="liked" v-for="(movie, k) in pageMovies" :key="'movie-'+k"
                               :movie="movie"/>
                </div>
                <div class="pagination-container">
                    <pagination v-model="page" :totals="movies.length" :perPage="perPage"></pagination>
                </div>
            </div>
        </div>

    </div>
</template>

<script lang="ts">
    import {Vue, Component, Watch} from 'vue-property-decorator'
    import Storage from "../classes/Storage";
    import Movie from "../components/Movie.vue";
    import {Route} from "vue-router";
    import ListMovies from "@/components/ListMovies.vue";
    import DataType from "@/classes/DataType";
    import Tv from "@/components/Tv.vue";
    import TMDb from "@/classes/TMDb";

    @Component({
        components: {Movie, ListMovies}
    })
    export default class Recommended extends Vue {
        name: string = "Recommended"
        page: number = 1
        perPage: number = 20
        pageMovies: Array<any> = []
        left: number = 5
        url: string = 'discover/movie'
        type: any = DataType
        movies: Array<any> = []

        fetchMovies() {
            let data: any = Storage.get('recommended', {})
            this.movies = data[this.type.value === 'tv' ? 'tv' : 'movies'] || []
        }


        get chunks() {
            // @ts-ignore
            return this.$root.chunk(this.movies, this.perPage);
        }

        get component() {
            return this.type.value === 'tv' ? Tv : Movie
        }

        fetch(page: number) {
            this.pageMovies = this.chunks[page - 1]
            window.scrollTo(0, 0)
        }

        @Watch('page')
        onPageChanged(page: number) {
            // @ts-ignore
            this.$router.push({name: this.$route.name, query: {page}})
        }

        @Watch('$route', {immediate: true})
        onRouteChanged(route: Route) {
            this.url = this.type.value === 'tv' ? `discover/tv` : `discover/movie`
            this.fetchMovies()
            this.fetch(this.page)
        }

        @Watch('type', {deep: true})
        onTypeChanged(type: any) {
            this.url = this.type.value === 'tv' ? `discover/tv` : `discover/movie`
            this.page = 1
            this.fetchMovies()
            this.pageMovies = this.chunks[this.page - 1]
        }

        likedCallback(movie: any, movies: Array<any>) {
            let index: any = movies.findIndex((m: any) => {
                return m.id == movie.id
            });
            if (index > -1) {
                TMDb.get(`${this.type.value}/${movie.id}/recommendations`).then((res: any) => {
                    let data: Array<any> = res.data.results;
                    let moviesIds: Array<string> = movies.map((m: any) => m.id)
                    let movieToAdd = data.filter((m: any) => !moviesIds.includes(m.id))
                    movies.splice(index + 1, 0, ...movieToAdd)
                })
            }
        }

        liked(movie: any) {
            this.left = this.left - 1;
            this.likedCallback(movie, this.movies)
        }
    }
</script>

<style scoped>

</style>
