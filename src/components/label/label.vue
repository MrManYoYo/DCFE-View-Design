<template>
  <div :class="wrapClasses">
    <label-list
      v-model='choosedLabel'
      :labelList='labelList'
      :viewMode='viewMode'
      @onLabelListChange='onLabelListChange'
      @onLabelSelectedChange='onLabelSelectedChange'
      @onLabelDelete='onLabelDelete'></label-list>
  </div>
</template>

<script>
  import LabelList from './label-list';
  const prefixCls = 'ivu-label';
  const iconPrefixCls = 'ivu-icon';

  export default {
    name: 'Label',
    components: { LabelList },
    model: {
      prop: 'value',
      event: 'change'
    },
    props: {
      value: {
        type: Array
      },
      labelList: {
        type: Array
      },
      viewMode: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        choosedLabel: [],
      }
    },
    watch: {
      value (newVal) {
        this.choosedLabel = newVal
        this.$emit('change', newVal)
      },
      labelList (newVal) {
        this.labelList = newVal
      }
    },
    computed: {
      wrapClasses () {
        return [
          `${prefixCls}`
        ]
      }
    },
    created () {
      this.choosedLabel = this.value
    },
    methods: {
      onLabelListChange (labelList, selected) {
        this.$emit('onListChange', labelList, selected)
      },
      onLabelSelectedChange (selected) {
        this.$emit('onSelectedChange', selected)
      },
      onLabelDelete (deleteItem) {
        this.$emit('onLabelDelete', deleteItem)
      }
    }
  }
</script>