<template>
    <div class="topbar">
        <SearchBar/>

        <div class="title">
            <h3 class="text">{{title}}</h3>
        </div>

        <div class="left-side">
            <div class="list-type-container">
                <div class="list-type active">
                    Films
                </div>
                <div class="list-type">
                    Séries
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Vue, Component, Watch} from 'vue-property-decorator'
    import TMDb from "@/classes/TMDb";
    import SearchBar from "@/components/SearchBar.vue";

    @Component({components: {SearchBar}})
    export default class Topbar extends Vue {
        name: string = "Topbar"
        title: string = 'OZA TV';

        @Watch('$route', {immediate: true})
        onRouteChanged() {
            if (this.$route.meta.isCategory) {
                TMDb.get(`genre/${this.$route.params.id}`).then((res: any) => {
                    this.title = res.data.name;
                })
            } else this.title = this.$route.meta.title
        }
    }
</script>

<style scoped src="../assets/scss/topbar.scss" lang="scss"></style>
