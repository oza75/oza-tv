<template>
    <div class="search">
        <button class="search-icon">
            <i class="fas fa-search"></i>
        </button>

        <v-autocomplete :items="results" v-model="selected" class="d-inline-block"
                        :get-label="getLabel"
                        :input-attrs="{class:'form-input search-input borderless', 'placeholder': 'Films, TV, actors, directors, genres ...'}"
                        :component-item='template'
                        :keep-open="false"
                        @update-items="search">
        </v-autocomplete>
    </div>
</template>

<script lang="ts">
    import {Vue, Component, Watch} from 'vue-property-decorator'
    import TMDb from "@/classes/TMDb";
    // @ts-ignore
    import ResultItem from '@/components/ResultItem';
    import {mapGenre} from "@/utils";

    @Component({})
    export default class SearchBar extends Vue {
        name: string = "SearchBar"
        query: string = ''
        results: Array<any> = []
        timer: any = null
        showResults: boolean = false
        template: any = ResultItem
        selected: any = null

        @Watch('query')
        onSearch(query: string) {
            if (query.trim().length) {
                this.search(query)
            }
        }

        @Watch('selected')
        onSelect(selected: any) {
            if (selected) {
                this.$router.push({name: 'movies.show', params: {id: selected.id}})
            }
        }

        search(query: string) {
            clearTimeout(this.timer)
            this.timer = setTimeout(() => {
                clearTimeout(this.timer)
                TMDb.get(`search/movie`, [{name: 'query', value: encodeURI(query)}]).then((res: any) => {
                    this.results = res.data.results.sort((a: any, b: any) => b.vote_average - a.vote_average).map((m: any) => {
                        m.genres = m.genre_ids.map((g: any) => mapGenre(g))
                        return m;
                    });
                    this.showResults = true;
                })
            }, 0)
        }

        getLabel(item: any) {
            return item.title || item.original_title;
        }

        show() {
            this.showResults = true;
        }

        hideResults() {
            setTimeout(() => {
                this.showResults = false
            }, 0);
        }

        mounted() {
        }

        formattedDisplay(result: any) {
            return result.title
        }
    }
</script>

<style scoped src="../assets/scss/search-bar.scss" lang="scss"></style>
