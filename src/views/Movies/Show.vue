<template>
    <div class="show-page " v-if="movie">
        <div class="row">
            <div class="col-md-5 col-lg-5 col-sm-12 col-xs-12 image-wrapper">
                <img :src="$root.image(movie.poster_path, 'w342') || require('../../assets/images/default_poster.jpg')"
                     class="img" :alt="movie.title">
            </div>
            <div class="col-md-7 col-lg-7 col-xs-12 col-sm-12 details-section">
                <h3 class="title">{{movie.title}}</h3>
                <ul class="list-genres">
                    <li class="genre-item" v-for="(genre, k) in movie.genres.slice(0, 5)" :key="'genre-'+k">
                        {{genre.name}}
                    </li>
                </ul>
                <div class="d-inline-block">
                    <Votes :note="movieNote" color="#ffbc38"/>
                </div>
                <span class="vote_average pl-3">{{movie.vote_average}}</span>
                <h3 class="title with_margin " id="casting">Le casting</h3>
                <Casting :casting="movie.credits.cast"/>

                <h3 class="title with_margin mb-2">Date de sortie</h3>
                <p class="mt-1 capitalize">
                    {{releaseDate}}
                    <span class="badge tiny rounded bold yellow">{{released ? "Dejà Sortie" : "A venir"}}</span>
                </p>

                <h3 class="title with_margin mb-1">Synopsis</h3>

                <p class="overview">{{movie.overview}}</p>

                <a :href="movie.homepage" v-if="movie.homepage" target="_blank"
                   class="link-btn d-inline-block custom-btn btn-dark">
                    Site Officiel
                </a>
                <span v-if="showForbidenLinks">
                <a :href="`https://openloadmovies.bz/?s=${encodeURI(movie.original_title)}`" target="_blank"
                   class="custom-btn d-inline-block ml-2 link-btn  btn-success">Regarder sur Openload</a>
                <a :href="`https://ww1.streamay.com/?s=${encodeURI(movie.title)}#section-movies`" target="_blank"
                   class="custom-btn d-inline-block ml-2 link-btn  btn-primary">Regarder sur Streamay</a>
                </span>

            </div>
        </div>
        <div class="row" v-if="movie && movie.videos.results.length">
            <div class="col-12 pl-4">
                <div class="title with_margin">Bande D'annonce</div>
                <Videos :videos="movie.videos.results"/>
            </div>
        </div>
        <div class="row">
            <div class="col-12 pl-4">
                <div class="title with_margin" id="similar-section">Recommadations</div>
                <list-movies :url="`movie/${movie.id}/recommendations`" :sortable="false" :is-similar="true"/>
            </div>
        </div>
    </div>

</template>

<script lang="ts">
    import {Vue, Component, Watch} from 'vue-property-decorator'
    import {Route} from "vue-router";
    import TMDb from "@/classes/TMDb";
    import Votes from "@/components/Votes.vue";
    import Movie from "@/components/Movie.vue";
    import Storage from "@/classes/Storage";
    import {description, meta, title} from "@/utils";
    import Videos from "@/components/Videos.vue";
    import Casting from "@/components/Casting.vue";

    @Component({
        components: {Votes, Movie, Videos, Casting}
    })
    export default class Show extends Vue {
        name: string = "Show";
        movie: any = null;
        lastTitle: string | null = null;
        lastDescription: string | null = null;

        @Watch('$route', {immediate: true, deep: true})
        onRouteChanged(route: Route) {
            if (!this.lastTitle) this.lastTitle = title.get();
            if (!this.lastDescription) this.lastDescription = description.get()

            let id: any = route.params.id;
            if (id) this.fetch(id)
        }

        fetch(id: any) {
            TMDb.get(`movie/${id}`, [{name: 'append_to_response', value: 'videos,credits'}]).then((res: any) => {
                this.movie = res.data;
                this.setPageInfo();
                window.scrollTo({behavior: "smooth", top: 0, left: 0})
            })
        }

        setPageInfo() {
            title.set("[Bande Annonce] " + this.movie.title);
            description.set(this.movie.overview);
            meta.add("og:url", window.location.href)
        }

        get movieNote() {
            return Math.round((this.movie.vote_average * 5) / 10);
        }

        get showForbidenLinks() {
            return this.released && Storage.has('hack-mode');
        }


        get firstCrew() {
            if (!this.movie) return null;
            return this.movie.credits.crew[0];
        }

        get released() {
            return new Date(this.movie.release_date).getTime() <= new Date().getTime();
        }

        get releaseDate() {
            return new Date(this.movie.release_date).toLocaleDateString('fr-MA', {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric"
            })
        }

        get width() {
            let len: number = this.movie.production_companies.length;
            if (len > 4) {
                return "w45";
            } else if (len > 2) {
                return "w95";
            } else {
                return "w185";
            }
        }

        destroyed() {
            if (this.lastTitle) title.set(this.lastTitle);
            if (this.lastDescription) description.set(this.lastDescription);
        }
    }
</script>

<style scoped lang="scss" src="../../assets/scss/movie_show.scss"></style>
