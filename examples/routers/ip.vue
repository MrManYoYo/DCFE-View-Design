<template>
  <div>
    <Ip v-model='ipModel1'></Ip>
    <br />
    <Ip v-model='ipModel2'></Ip>
    <br />
    <Ip v-model='ipModel3'></Ip>
    <br />
    <Ip v-model='ipModel4'></Ip>
    <br />
    <Ip v-model='ipModel5'></Ip>
    <br />
  </div>
</template>

<script>
  export default {
    name: 'IpPage',
    data() {
      return {
        ipModel1: '192.168.50.98',
        ipModel2: '1.1.1.1',
        ipModel3: 'a.b',
        ipModel4: '333.333',
        ipModel5: 'a.b.c.d',
      }
    }
  }
</script>

<style lang="" scoped>
  
</style>