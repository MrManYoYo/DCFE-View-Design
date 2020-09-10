<template>
  <div>
    <Label v-model='labelModel' :labelList='labelList'></Label>
    <Button type="primary" @click="changeModel">change</Button>
  </div>
</template>

<script>
  export default {
    name: 'LabelPage',
    data() {
      return {
        labelModel: [
          { name: 'xxx', color: 'primary' },
        ],
        labelList: [
          { name: 'xxx', color: 'primary' },
          { name: 'xxx1', color: 'primary' },
          { name: 'xxx2', color: 'primary' }
        ]
      }
    },
    methods: {
      changeModel () {
        this.labelModel = [
          { name: 'xxx1', color: 'primary' },
          { name: 'xxx2', color: 'primary' }
        ]
      }
    }
  }
</script>

<style lang="" scoped>
  
</style>