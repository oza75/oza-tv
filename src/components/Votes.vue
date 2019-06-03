<template>
    <div class="votes-container">
        <div class="item" v-for="n in 5" :key="'note-'+n">
            <i class="fas fa-star" :style="styles(n)"></i>
        </div>
    </div>
</template>

<script lang="ts">
    import {Vue, Component, Prop} from 'vue-property-decorator'

    @Component
    export default class Votes extends Vue {
        name: string = "Votes"
        @Prop({required: true}) note!: any;
        @Prop({default: "yellow"}) color !: string;

         styles(n : number) {
            return n <= this.note ? `color: ${this.color};` : ''
        }
    }
</script>

<style scoped lang="scss">
    .votes-container {
        display: flex;
        width: 100px;
        justify-content: space-between;

        .item {
            margin-right: 5px;

            .yellow {
                color: yellow;
            }
        }
    }
</style>
