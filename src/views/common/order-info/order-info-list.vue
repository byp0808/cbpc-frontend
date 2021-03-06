<template>
  <div class="app-container">
    <el-form ref="queryForm" status-icon :model="queryForm" label-width="80px">
      <el-row :gutter="20">
        <el-col :span="3">
          <el-button type="primary" @click="toAdd">新增批次</el-button>
        </el-col>
        <el-col :span="6">
          <el-form-item label="状态">
            <el-select v-model="queryForm.search_approveStatus_EQ" style="width: 100%">
              <el-option
                v-for="(name, key) in Object.assign({'':'请选择'}, $dict('REVIEW_STATUS'))"
                :key="key"
                :label="name"
                :value="key"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="批次名称">
            <el-input v-model="queryForm.search_orderName_LIKE" placeholder="输入批次名称模糊查询" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-button class="filter-item" type="primary" @click="loadTable">查询</el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-table
      ref="refOrderInfoTable"
      :data="orderInfoList"
      tooltip-effect="dark"
      style="width: 100%"
    >
      <el-table-column
        type="selection"
        width="55"
      />
      <el-table-column
        prop="orderNo"
        label="批次编号"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        prop="orderName"
        label="批次名称"
        show-overflow-tooltip
        width="200"
      />
      <el-table-column
        prop="marketId"
        label="市场"
        show-overflow-tooltip
        width="160"
      >
        <template slot-scope="">
          中国市场
        </template>
      </el-table-column>
      <el-table-column
        prop="timeZone"
        label="时区"
        show-overflow-tooltip
        width="180"
      >
        <template slot-scope="{row}">
          {{ $dft('TIME_ZONE', row.timeZone) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="compTime"
        label="计算时间点"
        show-overflow-tooltip
        width="140"
      />
      <el-table-column
        prop="remindTime"
        label="发布提醒时间点"
        show-overflow-tooltip
        width="140"
      />
      <el-table-column
        prop="basePrd"
        label="基础产品"
        show-overflow-tooltip
        width="100"
      >
        <template slot-scope="{row}">
          {{ $dft('TASK_BASE_PRD', row.basePrd) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="orderFlag"
        label="批次时间说明"
        show-overflow-tooltip
        width="140"
      >
        <template slot-scope="{row}">
          {{ $dft('ORDER_FLAG', row.orderFlag) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="orderMark"
        label="批次说明"
        show-overflow-tooltip
        width="160"
      />
      <el-table-column
        prop="approveStatus"
        label="状态"
        width="100"
        show-overflow-tooltip
      >
        <template slot-scope="{row}">
          {{ $dft('REVIEW_STATUS', row.approveStatus) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="address"
        label="操作"
        width="200"
        fixed="right"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <el-button
            :disabled="!(scope.row.approveStatus!=='01')"
            type="text"
            size="small"
            @click.native.prevent="toDetail(scope.row.id)"
          >
            调整
          </el-button>
          <el-button
            :disabled="!(scope.row.approveStatus==='02' || scope.row.approveStatus==='03')"
            type="text"
            size="small"
            @click.native.prevent="toDelete(scope.row.id)"
          >
            删除
          </el-button>
          <el-button
            :disabled="!isShowChangeStatusBtn(scope.row.busiStatus, scope.row.approveStatus)"
            type="text"
            size="small"
            @click.native.prevent="changeStatus(scope.row.busiStatus, scope.row.id)"
          >
            {{ statusText(scope.row.busiStatus) }}
          </el-button>
          <el-button
            v-if="scope.row.relationId"
            type="text"
            size="small"
            @click.native.prevent="toDetail(scope.row.relationId)"
          >
            草稿
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="page.pageNumber"
      :page-sizes="[10, 20, 30, 40, 50]"
      :page-size="page.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="page.totalRecord"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <el-dialog v-if="orderInfoFormVisible" width="92%" title="编制批次设置" :visible.sync="orderInfoFormVisible">
      <OrderInfoForm
        ref="OrderInfoForm"
        :business-id="orderInfoId"
        @saveCallBack="saveCallBack"
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="orderInfoFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import OrderInfoForm from '@/views/common/order-info/order-info-form.vue'
import { queryOrderInfoList, deleteOrderInfo, switchStatus } from '@/api/common/order-info.js'
export default {
  name: 'OrderInfoList',
  components: {
    OrderInfoForm
  },
  data() {
    return {
      queryForm: {
        search_approveStatus_EQ: '',
        search_orderName_LIKE: ''
      },
      orderInfoFormVisible: false,
      orderInfoId: '',
      orderInfoList: [],
      page: {
        pageNumber: 1,
        pageSize: 10
      }
    }
  },
  computed: {
    statusText() {
      return function(status) {
        switch (status) {
          case '02':
            return '停用'
          case '03':
            return '启用'
        }
      }
    }
  },
  beforeMount() {
    this.loadTable()
  },
  methods: {
    loadTable() {
      const d1 = this.queryForm.search_approveStatus_EQ ? { search_approveStatus_EQ: this.queryForm.search_approveStatus_EQ } : {}
      let d2 = this.queryForm.search_orderName_LIKE ? { search_orderName_LIKE: this.queryForm.search_orderName_LIKE } : {}
      d2 = Object.assign(d2, d1)
      queryOrderInfoList(Object.assign(d2, { page: this.page })).then(response => {
        const { dataList, page } = response
        this.page = page
        this.orderInfoList = dataList
      })
    },
    save() {
      this.$refs.OrderInfoForm.save()
    },
    cancel() {
      this.$store.commit('bondsNonp/setBondsNonpInfo', {})
      this.orderInfoFormVisible = false
    },
    toDetail(id) {
      this.orderInfoId = id
      this.orderInfoFormVisible = true
    },
    toDelete(id) {
      this.$confirm('确认删除此数据?', '提示', {
        type: 'warning'
      }).then(() => {
        deleteOrderInfo(id).then(response => {
          this.$message({
            message: '提交复核成功！',
            type: 'success',
            showClose: true
          })
          this.loadTable()
        })
      }).catch(() => {
      })
    },
    toAdd() {
      this.$store.commit('bondsNonp/setBondsNonpInfo', {})
      this.orderInfoId = ''
      this.orderInfoFormVisible = true
    },
    saveCallBack() {
      this.orderInfoFormVisible = false
      this.loadTable()
    },
    changeStatus(status, id) {
      if (status === '02') {
        this.$confirm('批次信息正在启用中，确定停用吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        })
          .then(() => {
            switchStatus({ id: id, busiStatus: '03' }).then(response => {
              this.$message.success('提交复核成功')
              this.loadTable()
            })
          })
      } else if (status === '03') {
        this.$confirm('批次信息已经停用，确定启用吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        })
          .then(() => {
            switchStatus({ id: id, busiStatus: '02' }).then(response => {
              this.$message.success('提交复核成功')
              this.loadTable()
            })
          })
      }
    },
    isShowChangeStatusBtn(busiStatus, approveStatus) {
      return approveStatus !== '01' && (busiStatus === '02' || busiStatus === '03')
    },
    handleSizeChange(pageSize) {
      this.page.pageSize = pageSize
      this.loadTable()
    },
    handleCurrentChange(currentPage) {
      this.page.pageNumber = currentPage
      this.loadTable()
    }
  }

}
</script>

<style scoped>

</style>
