<template>
    <div class="tv-season" v-if="season && movie">
        <div class="row">
            <div class="col-md-5 col-lg-5 col-sm-12 col-xs-12 image-wrapper">
                <img :src="$root.image(season.poster_path, 'w342') || require('../../assets/images/default_poster.jpg')"
                     class="img" :alt="season.name">
            </div>
            <div class="col-md-7 col-lg-7 col-xs-12 col-sm-12 details-section">
                <h3 class="title">{{movie.name}} / {{season.name}}</h3>
                <ul class="list-genres">
                    <li class="genre-item" v-for="(genre, k) in movie.genres.slice(0, 5)" :key="'genre-'+k">
                        {{genre.name}}
                    </li>
                </ul>
                <div class="d-inline-block">
                    <Votes :note="movieNote" color="#ffbc38"/>
                </div>
                <span class="vote_average pl-3">{{season.vote_average}}</span>
                <h3 class="title with_margin " id="casting">Le casting</h3>

                <Casting :casting="movie.credits.cast"/>

                <h3 class="title with_margin mb-1">Synopsis</h3>

                <p class="overview">{{season.overview}}</p>

                <a :href="movie.homepage" v-if="movie.homepage" target="_blank"
                   class="link-btn d-inline-block custom-btn btn-dark">
                    Site Officiel
                </a>
                <!--                <span v-if="showForbidenLinks">-->
                <!--                <a :href="`https://openloadmovies.bz/?s=${encodeURI(movie.original_title)}`" target="_blank"-->
                <!--                   class="custom-btn d-inline-block ml-2 link-btn  btn-success">Regarder sur Openload</a>-->
                <!--                <a :href="`https://ww1.streamay.com/?s=${encodeURI(movie.title)}#section-movies`" target="_blank"-->
                <!--                   class="custom-btn d-inline-block ml-2 link-btn  btn-primary">Regarder sur Streamay</a>-->
                <!--                </span>-->
            </div>
        </div>
        <div class="row">
            <div class="col-12 pl-4">
                <h3 class="title with_margin mb-1">Episodes</h3>
                <carousel :per-page="4" :scroll-per-page="false" :pagination-enabled="false"
                          navigation-next-label="<i class='fas fa-long-arrow-alt-right fa-2x'></i>"
                          navigation-prev-label="<i class='fas fa-long-arrow-alt-left fa-2x'></i>"
                          :navigation-enabled="true" class="episode-container">
                    <slide v-for="(ep, j) in season.episodes" :key="'episode-'+j">
                        <div class="episode mr-1">
                            <img :src="$root.image(ep.still_path, 'w300')" :alt="ep.name" class="img">
                            <div class="overlay">
                                <div class="name"> {{ep.name}}</div>
                                <div class="number">Episode {{ep.episode_number}}</div>
                            </div>
                            <div class="content-overlay">
                                {{$root.limit(ep.overview, 260)}}
                            </div>
                        </div>
                    </slide>
                </carousel>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Vue, Component, Watch} from 'vue-property-decorator'
    import TMDb, {Query} from "../../classes/TMDb";
    import {Route} from "vue-router";
    import Votes from "@/components/Votes.vue";
    import DataType from "@/classes/DataType";
    import Casting from "@/components/Casting.vue";

    @Component({
        components: {Votes, Casting}
    })
    export default class Season extends Vue {
        name: string = "Season"
        season: any = null
        movie: any = null

        fetch(tv_id: string, season_id: string) {
            let queries: Array<Query> = [{name: "append_to_response", value: "videos,genres,tv"}]

            TMDb.get(`tv/${tv_id}`, [{name: 'append_to_response', value: 'genres,credits'}]).then((res: any) => {
                this.movie = res.data;
            })

            TMDb.get(`tv/${tv_id}/season/${season_id}`, queries).then((res: any) => {
                this.season = res.data;

                window.scrollTo({behavior: "smooth", left: 0, top: 0})
            })
        }

        get movieNote() {
            return Math.round((this.movie.vote_average * 5) / 10);
        }


        @Watch('$route', {immediate: true, deep: true})
        onRouteChanged(route: Route) {
            let tv_id: string = route.params.tv_id;
            let season_id: string = route.params.season_id;

            if (tv_id && season_id) {
                this.fetch(tv_id, season_id)
            }
        }

        created() {
            DataType.setValue('tv')
        }
    }
</script>

<style scoped lang="scss" src="../../assets/scss/movie_show.scss">

</style>
