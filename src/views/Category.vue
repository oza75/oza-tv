<template>
    <div class="category">
        <list-movies :url="`discover/${$root.dataType}`" :queries="query"/>
    </div>
</template>

<script lang="ts">
    import {Vue, Component} from 'vue-property-decorator'

    @Component
    export default class Category extends Vue {
        name: string = "Category"

        get query() {
            return [
                {name: 'with_genres', value: this.$route.params.id}
            ]
        }
    }
</script>

<style scoped>

</style>
