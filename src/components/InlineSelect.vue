<template>
    <div class="inline-select">
        <div class="item" tabindex="-1" v-for="(item, j) in options" :key="'select-'+j" v-html="label(item)"
             @click="select(item)" :class="{'selected' : isSelected(item)}"></div>
    </div>
</template>

<script lang="ts">
    import {Vue, Component, Prop} from 'vue-property-decorator'

    @Component
    export default class InlineSelect extends Vue {
        name: string = "InlineSelect"
        @Prop({required: true}) options!: any
        @Prop({default: null}) value !: any
        @Prop({default: null}) labelName !: any
        @Prop({default: null}) valueName !: any

        label(item: any) {
            if (this.isObject(item)) return item[this.labelName]

            return item;
        }

        v(item: any) {
            if (this.isObject(item)) return item[this.valueName]

            return item;
        }

        select(item: any) {
            this.$emit('input', this.v(item))
        }

        isObject(item: any) {
            return typeof item === "object"
        }

        isSelected(item: any) {
            return this.v(item) === this.value
        }
    }
</script>

<style scoped lang="scss">
    $primary: blue;
    .inline-select {
        display: flex;
        justify-content: flex-start;

        .item {
            padding: 7px 8px;
            background-color: white;
            color: $primary;
            font-weight: bold;
            transition: all .3s ease;
            border: 1px solid $primary;
            cursor: pointer;
            outline: none;

            &.selected, &:hover {
                background-color: $primary;
                color: white;
            }

            &:focus {
                /*border: 2px solid $primary;*/
            }
        }
    }
</style>
