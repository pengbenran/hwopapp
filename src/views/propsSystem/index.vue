<template>
  <div id="propsSystem">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="道具配置" name="propIndex">
        <propIndex />
      </el-tab-pane>
      <el-tab-pane label="商城配置" name="mallIndex">
        <mallIndex />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import propIndex from "./components/propIndex"; // 道具配置
import mallIndex from "./components/mallIndex"; // 商城配置
export default {
  components: {
    propIndex,
    mallIndex
  },
  data() {
    return {
      activeName: "propIndex"
    };
  },
  methods: {
    handleClick() {
      console.log(this.activeName);
    }
  }
};
</script>

<style scoped>
#propsSystem {
  padding: 10px;
}
</style>
