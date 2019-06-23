<template>
    <div class="movie" @mouseover="loadCasts">
        <router-link tag="div" :to="{name: 'tv.show', params: {id: movie.id}}">
            <div class="image">
                <img class="image__img"
                     :src="$root.image(movie.poster_path) || require('../assets/images/default_poster.jpg')"
                     :alt="movie.name || movie.original_name">
                <div class="image-overlay">
                    <i class="far fa-play-circle"></i>
                </div>
            </div>
            <div class="overlay-wrapper">
                <div class="overlay">
                    <div class="overlay-content">
                        <h3 class="title" :title="movie.name || movie.original_name">
                            <span class="title__text">{{$root.limit(movie.name || movie.original_name, 20)}}</span>
                            <!--                            <span class="release_date">(<small>Début: </small>{{$root.date(movie.first_air_date)}})</span>-->
                        </h3>
                        <div class="badge blue tiny d-inline-block bold rounded episode_badge" v-if="lastEpisode">
                            E{{lastEpisode.episode_number}}-S{{lastEpisode.season_number}} : <span class="episode_name">{{lastEpisode.name}}</span>
                        </div>
                        <Votes :note="movieNotes"/>

                        <p class="description">
                            {{$root.limit(movie.overview, 160)}}
                        </p>
                        <p class="crew" v-if="firstCrew">
                            <span class="job">{{firstCrew.job}} : </span>
                            <span class="name">{{firstCrew.name}}</span>
                        </p>
                        <div class="like" @click.stop="addToLikedList(movie)" v-if="canLike">
                            <i class="fas fa-heart "></i>
                            J'aime
                        </div>
                        <div class="like" @click.stop="removeToLikedList(movie)" v-else>
                            <i class="fas fa-heart-broken "></i>
                            Je n'aime plus
                        </div>
                    </div>
                    <div class="overlay-casting">
                        <div class="cast" :title="cast.name" v-for="(cast, n) in casts" :key="'cast-'+n"
                             :style="`background-image: url(${$root.image(cast.profile_path, 'w45')})`">
                        </div>
                    </div>
                </div>
            </div>
        </router-link>
    </div>
</template>

<script lang="ts">
    import {Vue, Component, Prop} from 'vue-property-decorator'
    import Votes from "./Votes.vue";
    import TMDb, {url} from "@/classes/TMDb";


    @Component({
        components: {Votes}
    })
    export default class Tv extends Vue {
        name: string = "Tv"
        @Prop({required: true}) movie!: any;
        casting: any = null
        liked: boolean = false
        details: any = null

        addToLikedList(movie: any) {
            // @ts-ignore
            this.$root.addTvToLikedList(movie)
            this.liked = !this.liked;
            this.$emit('liked', movie);
        }

        removeToLikedList(movie: any) {
            // @ts-ignore
            this.$root.removeTvToLikedList(movie)
            this.liked = !this.liked;
            this.$emit('unLiked', movie);
        }

        loadCasts() {
            if (this.casting) return;
            TMDb.get(`tv/${this.movie.id}/credits`).then((res: any) => {
                this.casting = res.data;
            })
            TMDb.get(`tv/${this.movie.id}`).then((res: any) => {
                this.details = res.data;
            })
        }

        created() {
            // @ts-ignore
            this.liked = this.$root.likedMoviesHas(this.movie.id)
        }

        get canLike() {
            //@ts-ignore
            return !(this.liked || this.$root.likedTvHas(this.movie.id))
        }

        get casts() {
            if (!this.casting) return [];
            return this.casting.cast.slice(0, 5);
        }

        get firstCrew() {
            if (!this.casting) return null;
            return this.casting.crew[0];
        }

        get movieNotes() {
            return Math.round((this.movie.vote_average * 5) / 10);
        }

        get lastEpisode() {
            if (!this.details) return null;
            return this.details.last_episode_to_air
        }
    }
</script>

<style scoped lang="scss">
    .episode_badge {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 300px;
    }
</style>
