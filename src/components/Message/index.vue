<template>
  <div class="top-message">
    <el-badge :value="200" :max="99" class="item">
      <svg-icon icon-class="message" @click="click"/>
    </el-badge>
    <el-dialog title="我的消息" :visible.sync="messageFormVisible">
      <el-table
        :data="msgList"
        style="width: 100%">
        <el-table-column
          prop="msgTitle"
          label="标题"
          width="180">
        </el-table-column>
        <el-table-column
          prop="msgTypeSub"
          label="类型"
          width="180">
        </el-table-column>
        <el-table-column
          prop="msgContent"
          label="内容">
        </el-table-column>
        <el-table-column
          prop="msgFrom"
          label="发布人">
        </el-table-column>
        <el-table-column
          prop="sendTime"
          label="发布时间">
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { queryMsg } from '@/api/common/home-page.js'
export default {
  name: 'Message',
  data() {
    return {
      messageFormVisible: false,
      isPoll: false,
      msgList: []
    }
  },
  methods: {
    click() {
      this.messageFormVisible = true
    },
    getMsg() {
      console.log('消息轮询')
    },
    start() {
      this.getMsg()
      if (this.isPoll) {
        setTimeout(this.start, 5000)
      }
    }
  },
  mounted() {
    this.start()
  }
}
</script>

<style lang="scss">
.top-message {
  .el-badge__content {
    &.is-fixed {
      top: 10px !important;
    }
  }
}
</style>
