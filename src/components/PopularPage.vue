<template>
    <div class="popular-page">
        <div class="movies-container grid">
            <Movie v-for="(movie, k) in movies" :key="'movie-'+k" :movie="movie"/>
        </div>
        <div class="pagination-container">
            <pagination v-model="page" :totals="totalResults" :perPage="20"></pagination>
        </div>
    </div>
</template>

<script lang="ts">
    import {Vue, Component, Watch} from 'vue-property-decorator'
    import TMDb, {Query} from "@/classes/TMDb";
    import {lang, mapGenre} from "@/utils";
    import Movie from "@/components/Movie.vue";
    import {Route} from "vue-router";

    @Component({
        components: {Movie}
    })
    export default class PopularPage extends Vue {
        name: string = "PopularPage"
        page: number | null = null;
        totalPage: number = 0;
        totalResults: number = 0;
        movies: Array<any> = [];
        sort: any = null

        created() {
            // this.fetch(this.page || 1);
        }

        fetch(page: number) {
            this.movies = [];
            let query: Array<Query> = [{name: 'language', value: lang()}, {name: 'page', value: page}]
            TMDb.get('discover/movie', query).then((res: any) => {
                let result: any = res.data
                this.page = result.page;
                this.totalPage = result.total_pages;
                this.totalResults = result.total_results;
                this.movies = result.results.filter((m: any) => !!m.poster_path).map((movie: any) => {
                    movie.genres = movie.genre_ids.map(mapGenre)
                    return movie;
                });
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
