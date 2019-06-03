<template>
    <div class="recommended-movies">
        <div class="listing-movies">
            <div class="movies-container grid">
                <Movie v-for="(movie, k) in pageMovies" :key="'movie-'+k" :movie="movie"/>
            </div>
            <div class="pagination-container">
                <pagination v-model="page" :totals="movies.length" :perPage="perPage"></pagination>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Vue, Component, Watch} from 'vue-property-decorator'
    import Storage from "../classes/Storage";
    import Movie from "../components/Movie.vue";
    import {Route} from "vue-router";

    @Component({
        components: {Movie}
    })
    export default class Recommended extends Vue {
        name: string = "Recommended"
        page: number = 1
        perPage: number = 20
        pageMovies: Array<any> = []

        get movies() {
            return Storage.get('recommended', [])
        }

        get chunks() {
            // @ts-ignore
            return this.$root.chunk(this.movies, this.perPage);
        }

        fetch(page: number) {
            this.pageMovies = this.chunks[page]
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
    }
</script>

<style scoped>

</style>
