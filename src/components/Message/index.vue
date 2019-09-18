<template>
  <div class="top-message">
    <el-badge :value="newMsgCount" :max="99" class="item">
      <svg-icon icon-class="message" @click="click" />
    </el-badge>
    <el-dialog title="我的消息" :visible.sync="messageFormVisible">
      <el-table
        :data="msg.msgList"
        style="width: 100%"
      >
        <el-table-column
          prop="msgTitle"
          label="标题"
          width="180"
        />
        <el-table-column
          prop="msgTypeSub"
          label="类型"
          width="180"
        />
        <el-table-column
          prop="msgContent"
          label="内容"
        />
        <el-table-column
          prop="msgFrom"
          label="发布人"
        />
        <el-table-column
          prop="sendTime"
          label="发布时间"
        />
      </el-table>
      <el-pagination
        :current-page="msg.page.pageNumber"
        :page-sizes="[10, 20, 30, 40, 50]"
        :page-size="msg.page.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="msg.page.totalRecord"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-dialog>
  </div>
</template>

<script>
import { queryNewMsgCount } from '@/api/common/home-page.js'
export default {
  name: 'Message',
  data() {
    return {
      messageFormVisible: false,
      isPoll: false,
      newMsgCount: ''
    }
  },
  computed: {
    msg: {
      get() {
        return this.$store.state.homePage.message
      }
    }
  },
  mounted() {
    this.start()
  },
  methods: {
    click() {
      this.messageFormVisible = true
      this.$store.dispatch('homePage/queryMsgList', {})
    },
    handleSizeChange(pageSize) {
      this.page.pageSize = pageSize
      this.$store.dispatch('homePage/queryMsgList', { pageSize: pageSize })
    },
    handleCurrentChange(currentPage) {
      this.$store.dispatch('homePage/queryMsgList', { pageNumber: currentPage })
    },
    getMsg() {
      const that = this
      queryNewMsgCount().then(response => {
        const { unread, latest } = response
        that.newMsgCount = parseInt(unread) + parseInt(latest)
        if (latest > 0) {
          this.$notify({
            title: '最新消息提醒',
            message: `您有${latest}条新的未读消息,请到消息列表查看`,
            position: 'bottom-right',
            type: 'warning'
          })
        }
      })
    },
    start() {
      this.getMsg()
      if (this.isPoll) {
        setTimeout(this.start, 5000)
      }
    }
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
