<template>
  <div :class="wrapClasses">
    <label-list v-model='labelModel'></label-list>
  </div>
</template>

<script>
  import LabelList from './label-list';
  const prefixCls = 'ivu-label';
  const iconPrefixCls = 'ivu-icon';

  export default {
    name: 'Label',
    components: { LabelList },
    
    props: {

    },
    data() {
      return {
        labelModel: [
          { name: 'xxx', color: 'primary' },
          { name: 'xxx1', color: 'primary' },
          { name: 'xxx2', color: 'primary' }
        ]
      }
    },
    computed: {
      wrapClasses () {
        return [
          `${prefixCls}`
        ]
      }
    }
  }
</script>