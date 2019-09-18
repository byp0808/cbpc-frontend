<template>
  <div>
    <svg-icon icon-class="about" @click="click" />
    <el-dialog title="关于" :visible.sync="aboutFormVisible">
      <el-row>
        <el-col :span="24">
          <div class="grid-content bg-purple-dark">
            <p>产品介绍</p>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <div class="grid-content bg-purple-dark">
            <p>版本信息</p>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <div class="grid-content bg-purple-dark">
            <p>版权所有</p>
          </div>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'About',
  data() {
    return {
      aboutFormVisible: false
    }
  },
  methods: {
    click() {
      this.aboutFormVisible = true
    }
  }
}
</script>

<style scoped>

</style>
