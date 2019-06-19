<template>
    <div class="home">
        <list-movies url="trending/movie/day"  :sortable="false"/>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import PopularPage from "@/components/PopularPage.vue";

    @Component({
        components: {PopularPage},
    })
    export default class Home extends Vue {
    }
</script>
