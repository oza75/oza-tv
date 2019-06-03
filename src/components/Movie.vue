<template>
    <div class="movie" @mouseover="loadCasts">
        <router-link tag="div" :to="{name: 'movies.show', params: {id: movie.id}}">
            <div class="image">
                <img class="image__img" :src="$root.image(movie.poster_path)"
                     :alt="movie.title || movie.original_title">
                <div class="image-overlay">
                    <i class="far fa-play-circle"></i>
                </div>
            </div>
            <div class="overlay-wrapper">
                <div class="overlay">
                    <div class="overlay-content">
                        <h3 class="title" :title="movie.title">
                            <span class="title__text">{{$root.limit(movie.title || movie.original_title, 20)}}</span>
                            <span class="release_date">({{$root.date(movie.release_date)}})</span>
                        </h3>

                        <Votes :note="movieNotes"/>

                        <p class="description">
                            {{$root.limit(movie.overview, 200)}}
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
    import TMDb, {url} from "@/classes/TMDb";
    import Votes from "@/components/Votes.vue";

    @Component({
        components: {Votes}
    })
    export default class Movie extends Vue {
        name: string = "Movie"
        @Prop({required: true}) movie!: any;
        casting: any = null
        liked: boolean = false

        addToLikedList(movie: any) {
            // @ts-ignore
            this.$root.addMovieToLikedList(movie)
            this.liked = !this.liked;
        }

        removeToLikedList(movie: any) {
            // @ts-ignore
            this.$root.removeMovieToLikedList(movie)
            this.liked = !this.liked;
        }

        loadCasts() {
            if (this.casting) return;
            TMDb.get(`movie/${this.movie.id}/credits`).then((res: any) => {
                this.casting = res.data;
            })
        }

        created() {
            // @ts-ignore
            this.liked = this.$root.likedMoviesHas(this.movie.id)
        }

        get canLike() {
            //@ts-ignore
            return !(this.liked || this.$root.likedMoviesHas(this.movie.id))
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
    }
</script>

<style scoped>

</style>
