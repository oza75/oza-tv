<template>
    <div class="listing-movies">
        <div class="filter-container mb-3 custom-select" style="width:400px;" v-if="sortable">
            <label for="filter">Trier Par : </label>
            <div class="d-flex">
                <v-select :options="sorts" id="filter" label="name" v-model="sort" class="mr-2"
                          style="width: 300px;"></v-select>
                <inline-select :options="sortTypes" label-name="name" value-name="value" v-model="type"/>
            </div>
        </div>

        <transition-group name="route-animation" tag="div" class="movies-container grid">
            <Movie @liked="liked" @un-liked="unLiked"
                   v-for="(movie, k) in movies" :key="'movie-'+k"
                   :movie="movie"/>
        </transition-group>

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
        @Prop({default: true}) sortable !: boolean
        name: string = "ListMovies"
        page: number | null = null;
        totalPage: number = 0;
        totalResults: number = 0;
        movies: Array<any> = [];
        sort: any = {name: "Popularité", value: "popularity"}
        type: string = "desc"

        fetch(page: number) {
            this.movies = [];
            let query: Array<Query> = [...this.queries,
                {name: 'language', value: lang()},
                {name: 'page', value: page}
            ]

            if (this.sortable) query = [...query, {name: 'sort_by', value: this.sort.value + '.' + this.type}]

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
            let sortData: any = route.query.sort

            if (sortData) {
                let sort: string = sortData.split('.')[0] || 'popularity'
                let type: string = sortData.split('.')[1] || 'desc'
                this.sort = this.sorts.find((s: any) => s.value == sort);
                this.type = type;
            }


            this.fetch(page || 1);
        }

        @Watch('url')
        onUrlChanged(url: string) {
            this.fetch(1)
        }

        @Watch('sort')
        onSorted() {
            this.reload(1);
        }

        @Watch('type')
        onSortTypeChanged() {
            this.reload(1)
        }

        @Watch('page')
        onPageChanged(page: number) {
            // @ts-ignore
            this.reload(page)
            window.scrollTo({behavior: "smooth", top: 0, left: 0})
        }

        reload(page: number = 1) {
            // @ts-ignore
            this.$router.push({
                name: this.$route.name,
                params: this.$route.params,
                query: {...this.$route.query, page: page, sort: this.sort.value + '.' + this.type}
            })
        }

        addSort(name: string, value: string) {
            return {name, value}
        }

        get sortTypes() {
            return [
                {name: 'Decroissante', value: 'desc'},
                {name: 'Croissante', value: 'asc'}
            ]
        }

        get sorts() {
            return [
                this.addSort('Popularité ', 'popularity'),
                this.addSort('Date de sortie ', 'release_date'),
                this.addSort('Vote Moyen ', 'vote_average'),
                this.addSort('Revenue  ', 'revenue'),
            ]
        }

        liked(movie: any) {
            this.$emit('liked', movie)
        }

        unLiked(movie: any) {
            this.$emit('unLiked', movie)
        }

    }
</script>

<style scoped>

</style>
