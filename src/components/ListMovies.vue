<template>
    <div class="listing-movies">
        <div class="movies-container grid">
            <Movie v-for="(movie, k) in movies" :key="'movie-'+k" :movie="movie"/>
        </div>
        <div class="pagination-container">
            <pagination v-model="page" :totals="totalResults" :perPage="20"></pagination>
        </div>
    </div>
</template>

<script lang="ts">
    import {Vue, Component, Prop, Watch} from 'vue-property-decorator'
    import TMDb, {Query} from "@/classes/TMDb";
    import {lang, mapGenre} from "@/utils";
    import Movie from "@/components/Movie.vue";
    import {Route} from "vue-router";

    @Component({components: {Movie}})
    export default class ListMovies extends Vue {
        @Prop({required: true}) url!: string;
        @Prop({default: () => ([])}) queries!: Array<any>
        name: string = "ListMovies"
        page: number | null = null;
        totalPage: number = 0;
        totalResults: number = 0;
        movies: Array<any> = [];
        sort: any = null

        fetch(page: number) {
            this.movies = [];
            let query: Array<Query> = [...this.queries, {name: 'language', value: lang()}, {name: 'page', value: page}]
            TMDb.get(this.url, query).then((res: any) => {
                let result: any = res.data
                this.page = result.page;
                this.totalPage = result.total_pages;
                this.totalResults = result.total_results;
                this.movies = result.results.map((movie: any) => {
                    movie.genres = movie.genre_ids.map(mapGenre)
                    return movie;
                });
                if (this.totalPage > 1000) {
                    this.totalResults = 20 * 1000;
                }
            })
        }

        @Watch('$route', {immediate: true, deep: true})
        onRouteChanged(route: Route) {
            let page: any = route.query.page
            this.fetch(page || 1);
        }

        @Watch('sort')
        onSorted() {
            this.fetch(this.page || 1);
        }

        @Watch('page')
        onPageChanged(page: number) {
            // @ts-ignore
            this.$router.push({
                name: this.$route.name,
                params: this.$route.params,
                query: {...this.$route.query, page: page}
            })
        }

        addSort(name: string, value: string) {
            return {name, value}
        }

        get sorts() {
            return [
                this.addSort('Popularité', 'popularity.desc'),
                this.addSort('Date de sortie', 'release_date.desc'),
                this.addSort('Vote ', 'vote_average.desc'),
                this.addSort('Revenue ', 'revenue.desc')
            ]
        }
    }
</script>

<style scoped>

</style>
