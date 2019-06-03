<template>
    <div class="pagination-container">
        <ul class="list-items">
            <li class="item prev" @click="prev" v-if="value - 1 >= 1"><i class="fas fa-long-arrow-alt-left"></i></li>
            <template v-for="(item, n) in rangePage">
                <li class="item" @click="setPage(item)" :key="'item-'+n"
                    :class="{'dots': item.type === 'dots', 'active': value === item.value}">
                    {{item.value}}
                </li>
            </template>
            <li class="item next" @click="next" v-if="value + 1 <= nbPage"><i class="fas fa-long-arrow-alt-right"></i>
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
    import {Vue, Component, Prop} from 'vue-property-decorator'

    @Component
    export default class Pagination extends Vue {
        name: string = "Pagination"
        @Prop({required: true}) totals!: number;
        @Prop({required: true}) value!: number;
        @Prop({required: true}) perPage !: number;


        get nbPage() {
            return Math.round(this.totals / this.perPage);
        }

        get rangePage() {
            let range: Array<any> = [];
            let n: number = 4;
            let start: number = this.value - n > 0 ? this.value - n : 1;
            let end: number = this.value + n < this.nbPage ? this.value + n : this.value + (this.nbPage - this.value);

            if (this.nbPage / 2 < this.value) {
                range.push({type: 'number', value: 1})
                range.push({type: 'number', value: 2});
                range.push({type: 'dots', value: '...'});
            }

            for (let i = start; i < end; i++) {
                range.push({type: 'number', value: i})
            }

            if (this.nbPage / 2 > this.value) {
                range.push({type: 'dots', value: '...'});
                range.push({type: 'number', value: this.nbPage - 1})
                range.push({type: 'number', value: this.nbPage})
            }

            return range;
        }

        setPage(item: any) {
            if (item.type == 'dots') return;
            this.$emit('input', item.value)
        }

        prev() {
            this.$emit('input', this.value - 1);
        }

        next() {
            this.$emit('input', this.value + 1)
        }
    }
</script>

<style scoped src="../assets/scss/pagination.scss" lang="scss"></style>
