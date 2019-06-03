<template>
    <div class="home">
        <list-movies url="discover/movie" />
    </div>
</template>

<script lang="ts">
    import {Vue, Component} from 'vue-property-decorator'
    import PopularPage from "../components/PopularPage.vue";

    @Component({
        components: {PopularPage}
    })
    export default class NewRelease extends Vue {
        name: string = "NewRelease"
    }
</script>

<style scoped>

</style>
