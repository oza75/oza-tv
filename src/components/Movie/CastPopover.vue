<template>
    <div>
        <v-popover offset="0" :placement="placement" :class="{[placement]: true}" trigger="hover" @show="fetchCredit"
                   class="bg-transparent">
            <!-- This will be the popover target (for the events and position) -->
            <div class="cast" :title="cast.name" @mouseover="setPlacement"
                 :style="`background-image: url(${$root.image(cast.profile_path, 'w342') || require('../../assets/images/profile2.png') })`">
            </div>

            <!-- This will be the content of the popover -->
            <template slot="popover">
                <div class="d-flex info-wrapper" ref="content">
                    <img class="img"
                         :src="$root.image(cast.profile_path, 'w185') || require('../../assets/images/profile2.png')"
                         :alt="`Photo de ${cast.character}`">
                    <div class="content">
                        <h3 class="character">{{cast.character}}</h3>
                        <p class="name">Interpreté par : <a href="#" class="cast-name">{{cast.name}}</a></p>
                        <div class="known-for-section">
                            <h3 class="title">Connu Pour</h3>
                            <transition-group name="route-animation" tag="div" class="movies-section">
                                <router-link :to="{name: 'movies.show', params: {id: item.id}}" class="item"
                                             :title="item.title" v-for="(item, k) in knowForMovies" :key="'item-'+k">
                                    <img :src="$root.image(item.poster_path, 'w185')" alt="" class="img">
                                    <div class="movie-title">
                                        {{item.title}}
                                    </div>
                                </router-link>
                            </transition-group>
                        </div>
                    </div>
                </div>
            </template>
        </v-popover>

    </div>

</template>

<script lang="ts">
    import {Vue, Component, Prop} from 'vue-property-decorator'
    import TMDb from "@/classes/TMDb";

    @Component
    export default class CastPopover extends Vue {
        name: string = "CastPopover"
        @Prop({required: true}) cast!: any
        @Prop({default: 0}) index!: any
        credit: any = null
        scrolled: boolean = false
        placement: any = "bottom"

        mounted() {

        }

        fetchCredit() {
            this.scroll();
            if (this.credit) return;
            TMDb.get(`credit/${this.cast.credit_id}`).then((res: any) => {
                this.credit = res.data
            })
        }

        scroll() {
            let casting: HTMLElement | null = document.getElementById('casting');
            if (casting && !this.scrolled) {
                window.scrollBy({behavior: "smooth", top: casting.scrollTop, left: casting.scrollLeft})
                this.scrolled = true
            }
        }

        setPlacement(event: MouseEvent) {
            if (this.index % 9 > 4) {
                this.placement = 'left';
            }
        }

        get knowForMovies() {
            if (!this.credit) return []

            return this.credit.person.known_for.sort((a: any, b: any) => b.vote_average - a.vote_average).slice(0, 3)
        }
    }
</script>

<style scoped lang="scss">
    .cast {
        width: 50px;
        height: 50px;
        -webkit-border-radius: 50%;
        -moz-border-radius: 50%;
        border-radius: 50%;
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center center;
        margin-right: 10px;
        cursor: pointer;

    }

    .info-wrapper {
        .img {
            width: 185px;
            height: 278px;
            margin-right: 8px;
        }

        .content {
            margin-top: -23px;
            padding: 0 10px 10px;
            list-style: none;

            .character {
                font-weight: bold;
                font-size: 20px;
                margin-bottom: 6px;
            }

            .name {
                font-weight: bold;
                opacity: 0.9;
                color: #000;


            }
        }
    }

    .known-for-section {
        .movies-section {
            display: flex;
            justify-content: flex-start;

            .item {
                width: 100px;
                margin-right: 10px;
                display: block;

                .img {
                    width: 100px;
                    height: 150px;
                }

                .movie-title {
                    width: 100%;
                    font-weight: bold;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
            }
        }
    }

    .title {
        font-weight: 900;
        text-transform: uppercase;
        font-size: 20px;
        margin-top: 0;
        margin-bottom: 5px;
        color: #0a1627;
    }
</style>
