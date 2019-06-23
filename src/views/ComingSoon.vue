<template>
    <div class="coming-soon">
        <list-movies url="movie/upcoming" :sortable="false" :queries="[{name: 'region', value: ''}]"/>
    </div>
</template>

<script lang="ts">
    import {Vue, Component} from 'vue-property-decorator'

    @Component
    export default class ComingSoon extends Vue {
        name: string ="ComingSoon"

        get region () {
            return 'ma'
        }
    }
</script>

<style scoped>

</style>
