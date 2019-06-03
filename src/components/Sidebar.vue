<template>
    <div class="sidebar hidden-xs">
        <div class="app-name">{{appName}}
            <span class="tmdb">
                <i class="fas fa-heart icon"></i>
                <a href="https://www.themoviedb.org/?language=fr" target="_blank" class="text">TMDb</a>
            </span>
        </div>
        <div class="items-container">
            <div class="items" v-for="(item, n) in items" :key="'items-'+n">
                <span class="section">
                    {{item.section}}
                </span>
                <ul class="list" :data-simplebar="item.hasScroll">
                    <li v-for="(link, k) in item.items" :key="'link-'+k">
                        <router-link :to="link.to" :class="{active: $route.path === link.to}" class="item">
                            <i :class="link.icon" class="icon"></i>
                            <span class="text">{{link.text}}</span>
                        </router-link>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Vue, Component, Watch} from 'vue-property-decorator'
    import {Route} from "vue-router";
    import Storage from "@/classes/Storage";
    import TMDb from "@/classes/TMDb";

    const items = require("@/assets/json/sidebar.json")

    @Component
    export default class Sidebar extends Vue {
        name: string = "Sidebar"
        items: Array<any> = []

        get appName() {
            return process.env.VUE_APP_NAME;
        }

        created() {
            this.items = items;
            if (!Storage.has('genres')) {
                TMDb.get('genre/movie/list').then((res: any) => {
                    let genres: Array<any> = res.data.genres;
                    this.items[1].items = this.items[1].items
                        .concat(genres.map((g: any) => {
                            return {
                                text: g.name,
                                to: "/category/" + g.id,
                                icon: "fas fa-tag"
                            }
                        }))
                })
            } else {
                this.items[1].items = this.items[1].items
                    .concat(Storage.get('genres', []).map((g: any) => {
                        return {
                            text: g.name,
                            to: "/category/" + g.id,
                            icon: "fas fa-tag"
                        }
                    }))
            }

        }
    }
</script>

<style scoped src="../assets/scss/sidebar.scss" lang="scss"></style>
