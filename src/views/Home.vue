<template>
    <div class="home">
        <list-movies :url="`trending/${dataType.value}/day`" :sortable="false"/>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import PopularPage from "@/components/PopularPage.vue";
    import DataType from "@/classes/DataType";

    @Component({
        components: {PopularPage},
    })
    export default class Home extends Vue {
        dataType: any = DataType
    }
</script>
