<template>
    <div class="topbar">
        <SearchBar/>

        <div class="title">
            <h3 class="text">{{title}}</h3>
        </div>

        <div class="left-side">
            <div class="list-type-container" id="list-type-container">
                <div id="type-of-content" class="mr-4"></div>
                <div class="list-type" :id="`list-type-${j}`" :class="{active: dataType.value === item.value}"
                     @click="dataType.setValue(item.value)"
                     :key="'type-'+j" v-for="(item, j) in types">
                    {{item.name}}
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Vue, Component, Watch} from 'vue-property-decorator'
    import TMDb from "@/classes/TMDb";
    import SearchBar from "@/components/SearchBar.vue";
    import DataType from "@/classes/DataType";

    @Component({components: {SearchBar}})
    export default class Topbar extends Vue {
        name: string = "Topbar"
        title: string = 'OZA TV';
        dataType: any = DataType;

        @Watch('$route', {immediate: true})
        onRouteChanged() {
            if (this.$route.meta.isCategory) {
                TMDb.get(`genre/${this.$route.params.id}`).then((res: any) => {
                    this.title = res.data.name;
                })
            } else this.title = this.$route.meta.title
        }

        get types() {
            return [
                {name: 'Films', value: 'movie'},
                {name: 'Séries', value: 'tv'}
            ]
        }

    }
</script>

<style scoped src="../assets/scss/topbar.scss" lang="scss"></style>
