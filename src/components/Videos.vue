<template>
    <div class="videos">
        <div class="video-container" v-if="currentVid">
            <iframe class="yt-frame"
                    :src="`https://www.youtube.com/embed/${currentVid.key}`" frameborder="0"
                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen></iframe>
        </div>
        <ul class="list-yt-videos">
            <li class="item"
                v-for="(vid, u) in videos.slice(0,6)"
                @click="selectVid(vid)" :key="'vid-'+u">
                <img :src="ytImage(vid)" alt="">
                <div class="overlay" title="En Lecture" v-if="vid.key === currentVid.key"></div>
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
    import {Vue, Component, Prop, Watch} from 'vue-property-decorator'

    @Component
    export default class Videos extends Vue {
        name: string = "Videos"
        @Prop({required: true}) videos !: Array<any>
        currentVid: any = null

        selectVid(vid: any) {
            this.currentVid = vid;
        }

        ytImage(video: any, large: boolean = false) {
            return `https://img.youtube.com/vi/${video.key}/${large ? "0" : "3"}.jpg`
        }

        @Watch('videos', {immediate: true, deep: true})
        onVideosChanged(videos: Array<any>) {
            this.currentVid = videos[0] || null
        }
    }
</script>

<style scoped lang="scss">
    .list-yt-videos {
        display: flex;
        flex-wrap: wrap;
        margin-left: 0;
        margin-right: 0;
        margin-top: 5px;
        padding-left: 0;
        list-style: none;
        justify-content: flex-start;

        .item {
            margin-right: 10px;
            cursor: pointer;
            box-shadow: 0 4px 2px rgba(0, 0, 0, 0.08);
            position: relative;

            .overlay {
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(28, 28, 28, 0.9);
            }

            .img {
                border-radius: 4px;
            }
        }
    }

    .yt-frame {
        width: 853px;
        height: 480px;
        @media only screen and (max-width: 768px) {
            width: 100% !important;
        }
    }
</style>
