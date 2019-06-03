<template>
    <div class="coming-soon">
        <list-movies url="movie/upcoming"/>
    </div>
</template>

<script lang="ts">
    import {Vue, Component} from 'vue-property-decorator'

    @Component
    export default class ComingSoon extends Vue {
        name: string ="ComingSoon"
    }
</script>

<style scoped>

</style>
