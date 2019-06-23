<template>
    <carousel :per-page="9" :pagination-enabled="false"
              navigation-next-label="<i class='fas fa-long-arrow-alt-right fa-2x'></i>"
              navigation-prev-label="<i class='fas fa-long-arrow-alt-left fa-2x'></i>"
              :navigation-enabled="true"
              class="casting-container">
        <slide class="" v-for="(cast, n) in casting" :key="'cast-'+n">
            <CastPopover :cast="cast" :index="n"/>
        </slide>
    </carousel>
</template>

<script lang="ts">
    import {Vue, Component, Prop} from 'vue-property-decorator'
    import CastPopover from "./Movie/CastPopover.vue";

    @Component({components: {CastPopover}})
    export default class Casting extends Vue {
        name: string = "Casting"
        @Prop({required: true}) casting !: Array<any>
    }
</script>

<style scoped lang="scss">

</style>
