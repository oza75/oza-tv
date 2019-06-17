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
                            Vous aimez les films que vous aimez, plus vos recommandations seront pertinentes.
                        </div>
                    </div>
                </div>
            </div>
            <ListMovies @liked="liked" :url="url" class="mt-4"/>
        </div>
        <div class="recommended-movies" v-else>
            <div class="listing-movies">
                <div class="movies-container grid">
                    <Movie v-for="(movie, k) in pageMovies" :key="'movie-'+k" :movie="movie"/>
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

    @Component({
        components: {Movie, ListMovies}
    })
    export default class Recommended extends Vue {
        name: string = "Recommended"
        page: number = 1
        perPage: number = 20
        pageMovies: Array<any> = []
        url: string = 'discover/movie'
        left: number = 5

        get movies() {
            return Storage.get('recommended', [])
        }

        get chunks() {
            // @ts-ignore
            return this.$root.chunk(this.movies, this.perPage);
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
            this.fetch(this.page)
        }

        liked(movie: any) {
            this.url = `movie/${movie.id}/recommendations`
            this.left = this.left - 1
        }
    }
</script>

<style scoped>

</style>
