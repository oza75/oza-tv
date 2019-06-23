<template>
    <div class="home">
        <list-movies :url="url" :queries="queries"/>
    </div>
</template>

<script lang="ts">
    import {Vue, Component} from 'vue-property-decorator'
    import {Query} from "@/classes/TMDb";
    import {now} from "@/utils";

    @Component({
        components: {}
    })
    export default class Discover extends Vue {
        name: string = "Discover.vue"


        get queries() {
            let q: Array<Query> = []
            // @ts-ignore
            // if (this.$root.dataType === 'tv') {
            //     q.push({name: 'air_date.lte', value: now()})
            // } else {
            //     q.push({name: 'release_date.lte', value: now()})
            // }
            return q;
        }

        get url() {
            // @ts-ignore
            return this.$root.dataType === 'tv' ? "discover/tv" : "discover/movie"
        }
    }
</script>

<style scoped>

</style>
