<template>
    <div class="result-item" tabindex="1">
        <div class="poster">
            <img :src="$root.image(item.poster_path, 'w45')" :alt="item.title" class="img">
        </div>
        <div class="title" v-html="title"></div>
    </div>
</template>

<script lang="ts">
    import {Vue, Component, Prop} from 'vue-property-decorator'

    @Component
    export default class ResultItem extends Vue {
        name: string = "ResultItem"
        @Prop({required: true}) item !: any;
        @Prop({required: true}) searchText !: any;

        get title() {
            let tit: string = this.item.title || this.item.original_title;
            tit = tit.replace(this.searchText, `<span class="keyword"> ${this.searchText} </span>`);
            tit += ` <span class="genre"> ${this.item.genres[0].name}</span>`
            return tit;
        }
    }
</script>

<style scoped lang="scss">
    .result-item {
        width: 100%;
        display: flex;
        align-items: center;
        border-bottom: 1px solid #cacaca;
        padding: 5px 15px;

        .poster {
            margin-right: 10px;

            img {
                width: 45px;
                height: 45px;
                -webkit-border-radius: 6px;
                -moz-border-radius: 6px;
                border-radius: 6px;
                border-bottom: 2px solid darken(#212330, 20%);
            }

        }

        .title {
            font-weight: bold;
        }

    }
</style>
