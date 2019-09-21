<template>
  <div class="top-message">
    <el-badge :value="newMsgCount" :max="99" class="item">
      <svg-icon icon-class="message" @click="click" />
    </el-badge>
    <el-dialog title="我的消息" :visible.sync="messageFormVisible">
      <el-table
        ref="msgTable"
        :data="msg.msgList"
        style="width: 100%"
        @expand-change="readMsg"
      >
        <el-table-column type="expand" class="expend">
          <template slot-scope="{ $index }">
            <el-form label-position="left" class="table-expand">
              <el-form-item label="标题">
                <span>{{ msg.msgList[$index].msgTitle }}</span>
              </el-form-item>
              <el-form-item label="消息内容">
                <span>{{ msg.msgList[$index].msgContent }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          prop="msgTitle"
          label="标题"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          prop="msgTypeSub"
          label="类型"
          width="65"
        >
          <template slot-scope="{ row }">
            <el-tag size="mini" type="">{{ $dft("MSG_TYPE", row.msgTypeSub) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="msgContent"
          label="内容"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          prop="msgFrom"
          label="发布人"
        />
        <el-table-column
          prop="status"
          label="状态"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="{ row }">
            <el-tag v-if="row.status === '1'" size="mini" type="danger">{{ $dft("MSG_TYPE", row.status) }}</el-tag>
            <el-tag v-if="row.status === '2'" size="mini" type="danger">{{ $dft("MSG_TYPE", row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="sendTime"
          label="发布时间"
          :show-overflow-tooltip="true"
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
import { queryNewMsgCount, readMsg } from '@/api/common/home-page.js'
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
    readMsg(row, expandedRows) {
      if (expandedRows.length > 1) {
        this.$refs.msgTable.toggleRowExpansion(expandedRows[0], false)
      }
      if (row.status === '1') {
        readMsg({ id: row.id }).then(response => {
          this.$store.commit('homePage/updateMsgStatus', response)
          this.$refs.msgTable.toggleRowExpansion(response, true)
        })
      }
    },
    getMsg() {
      const that = this
      queryNewMsgCount().then(response => {
        const { unread, latest } = response
        that.newMsgCount = parseInt(unread) + parseInt(latest)
        that.newMsgCount = that.newMsgCount === 0 ? '' : that.newMsgCount
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
