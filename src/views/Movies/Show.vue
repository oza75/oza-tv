<template>
    <div class="show-page " v-if="movie">
        <div class="row">
            <div class="col-md-5 col-lg-5 col-sm-12 col-xs-12 image-wrapper">
                <img :src="$root.image(movie.poster_path, 'w342')" class="img" :alt="movie.title">
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
                <h3 class="title with_margin ">Le casting</h3>

                <carousel :per-page="9" :pagination-enabled="false"
                          navigation-next-label="<i class='fas fa-long-arrow-alt-right fa-2x'></i>"
                          navigation-prev-label="<i class='fas fa-long-arrow-alt-left fa-2x'></i>"
                          :navigation-enabled="true"
                          class="casting-container">
                    <slide class="" v-for="(cast, n) in casts" :key="'cast-'+n">
                        <div class="cast" :title="cast.name"
                             :style="`background-image: url(${$root.image(cast.profile_path, 'w342')})`">
                        </div>
                    </slide>
                </carousel>

                <h3 class="title with_margin">Synopsis</h3>

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
        <div class="row" v-if="videos.length">
            <div class="col-12 pl-4">
                <div class="title with_margin">Bande D'annonce</div>

                <div class="video-container" v-if="currentVid">
                    <iframe class="yt-frame"
                            :src="`https://www.youtube.com/embed/${currentVid.key}`" frameborder="0"
                            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                            allowfullscreen></iframe>
                </div>
                <ul class="list-yt-videos">
                    <li class="item"
                        v-for="(vid, u) in videos.slice(0,6)"
                        @click="selectVid(vid)" :key="'vid-'+u">
                        <img :src="ytImage(vid)" alt="">
                        <div class="overlay" title="En Lecture" v-if="vid.key === currentVid.key"></div>
                    </li>
                </ul>
            </div>
        </div>
        <div v-if="released && similars.length">
            <div class="row">
                <div class="col-12 pl-4">
                    <div class="title with_margin" id="similar-section">Recommadations</div>
                    <div class="similar-container grid">
                        <Movie :movie="movie" v-for="(movie, t) in similars" :key="'similar-'+t"/>
                    </div>
                </div>
            </div>
            <div class="pagination-container">
                <pagination v-model="similarsPage" :totals="similarsTotalResults" :perPage="20"></pagination>
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
    import axios from 'axios'
    import Video from "@/classes/Video";
    import Storage from "@/classes/Storage";
    import {description, meta, title} from "@/utils";

    @Component({
        components: {Votes, Movie}
    })
    export default class Show extends Vue {
        name: string = "Show";
        movie: any = null;
        casting: any = null;
        videos: Array<any> = [];
        currentVid: any = null;
        similars: Array<any> = [];
        similarsPage: number = 1;
        similarsTotalResults: number = 0;
        ticket: any = null;
        lastTitle: string | null = null;
        lastDescription: string | null = null;

        @Watch('$route', {immediate: true, deep: true})
        onRouteChanged(route: Route) {
            if (!this.lastTitle) this.lastTitle = title.get();
            if (!this.lastDescription) this.lastDescription = description.get()

            let id: any = route.params.id;
            if (id) this.fetch(id)
        }

        @Watch('similarsPage')
        onPageChanged(page: number) {
            if (page) {
                this.fetchSimilar(this.movie.id, page);
                let p: HTMLElement | null = document.getElementById('similar-section');
                if (p) p.scrollIntoView({behavior: "smooth"});
                // window.scrollBy({top: p.offsetTop, left: p.offsetLeft, behavior: "smooth"})
            }
        }

        fetch(id: any) {
            TMDb.get(`movie/${id}`).then((res: any) => {
                this.movie = res.data;
                TMDb.get(`movie/${this.movie.id}/credits`).then((res: any) => {
                    this.casting = res.data;
                });
                TMDb.get(`movie/${this.movie.id}/videos`).then((res: any) => {
                    this.videos = res.data.results;
                    this.currentVid = this.videos[0] || null
                    if (this.currentVid) {
                        meta.add('og:image', this.ytImage(this.currentVid, true))
                    }
                });
                this.setPageInfo();
                this.fetchSimilar(this.movie.id, 1)
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

        get casts() {
            if (!this.casting) return [];
            return this.casting.cast;
        }

        get firstCrew() {
            if (!this.casting) return null;
            return this.casting.crew[0];
        }

        get released() {
            return this.movie.status == 'Released';
        }

        selectVid(vid: any) {
            this.currentVid = vid;
        }

        ytImage(video: any, large: boolean = false) {
            return `https://img.youtube.com/vi/${video.key}/${large ? "0" : "3"}.jpg`
        }

        fetchSimilar(id: any, page: number) {
            this.similars = [];
            TMDb.get(`movie/${id}/recommendations`, [{name: 'page', value: page}]).then((res: any) => {
                this.similars = res.data.results;
                this.similarsTotalResults = res.data.total_results;
                this.similarsPage = res.data.page;
            })
            // window.scrollTo(0, 0)
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
