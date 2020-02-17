<!--
*@描述:test
*@版本:V1.0
*@作者:白爱民
*@Date:2019年12月11日20:16:26
*@最后修改人:herry
*@LastEditTime:2019年12月11日20:16:31
*@说明：-->
<template>
  <div>
    <van-field readonly clickable :value="value" @touchstart.native.stop="show = true" />

    <van-number-keyboard v-model="value" :show="show" :maxlength="6" @blur="show = false" />
  </div>
</template>
<style scoped>
</style>
<script>
export default {
  data() {
    return {
      show: false,
      value: ""
    };
  },
  mounted() {},
  methods: {
    // newitems() {
    //   var searchArr = [];
    //   if (this.searchMessage === "") {
    //   }
    // }
  }
};
</script>
