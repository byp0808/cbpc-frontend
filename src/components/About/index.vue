<template>
  <div>
    <svg-icon icon-class="about" @click="click" />
    <el-dialog title="关于" :visible.sync="aboutFormVisible">
      <el-row>
        <el-col :span="24">
          <div class="grid-content bg-purple-dark">
            <p>{{ sysInfo }}</p>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <div class="grid-content bg-purple-dark">
            <p>{{ sysVersion }}</p>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <div class="grid-content bg-purple-dark">
            <p>{{ sysCopyright }}</p>
          </div>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { queryAboutInfo } from '@/api/common/home-page.js'
export default {
  name: 'About',
  data() {
    return {
      aboutFormVisible: false,
      sysInfo: '',
      sysCopyright: '',
      sysVersion: ''
    }
  },
  methods: {
    click() {
      this.aboutFormVisible = true
      queryAboutInfo().then(response => {
        const { SYSTEM_VERSION, SYSTEM_COPYRIGHT, SYSTEM_INFO } = response
        this.sysVersion = SYSTEM_VERSION
        this.sysCopyright = SYSTEM_COPYRIGHT
        this.sysInfo = SYSTEM_INFO
      })
    }
  }
}
</script>

<style scoped>

</style>
