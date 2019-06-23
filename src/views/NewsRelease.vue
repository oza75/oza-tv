<template>
    <div class="news-release">
        <list-movies :url="url" :queries="[]" :sortable="false"/>
    </div>
</template>

<script lang="ts">
    import {Vue, Component} from 'vue-property-decorator'

    @Component
    export default class NewsRelease extends Vue {
        name: string = "NewsRelease"

        get url() {
            // @ts-ignore
            return this.$root.dataType === 'movie' ? 'movie/now_playing' : 'tv/on_the_air'
        }
    }
</script>

<style scoped lang="scss">

</style>
