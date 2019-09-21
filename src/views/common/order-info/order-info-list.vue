<template>
  <div class="app-container">
    <div style="margin-bottom: 20px">
      <el-button type="primary" @click="toAdd">新增批次</el-button>
    </div>
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
      />
      <el-table-column
        prop="orderName"
        label="批次名称"
        show-overflow-tooltip
      />
      <el-table-column
        prop="basePrd"
        label="所属基础产品"
        show-overflow-tooltip
      >
        <template slot-scope="{row}">
          {{ $dft('BASE_PRD_CODE', row.basePrd) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="marketId"
        label="所属市场"
        show-overflow-tooltip
      >
        <template slot-scope="{row}">
          {{ $dft('MARKET', row.marketId) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="timeZone"
        label="所属时区"
        show-overflow-tooltip
      >
        <template slot-scope="{row}">
          {{ $dft('TIME_ZONE', row.approveStatus) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="compTime"
        label="批次计算时间"
        show-overflow-tooltip
      />
      <el-table-column
        prop="remindTime"
        label="批次提醒时间"
        show-overflow-tooltip
      />
      <el-table-column
        prop="approveStatus"
        label="审核状态"
        width="100"
        show-overflow-tooltip
      >
        <template slot-scope="{row}">
          {{ $dft('APPROVE_STATUS', row.approveStatus) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="address"
        label="操作"
        width="200"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click.native.prevent="toDetail(scope.row.id)"
          >
            调整
          </el-button>
          <el-button
            type="text"
            size="small"
            @click.native.prevent="toDelete(scope.row.id)"
          >
            删除
          </el-button>
          <el-button
            v-if="isShowChangeStatusBtn(scope.row.busiStatus)"
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
            return '启用中'
          case '03':
            return '停用中'
        }
      }
    }
  },
  beforeMount() {
    this.loadTable()
  },
  methods: {
    loadTable() {
      queryOrderInfoList({ page: this.page }).then(response => {
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
      deleteOrderInfo(id).then(response => {
        this.$message({
          message: '删除成功！',
          type: 'success',
          showClose: true
        })
        this.loadTable()
      })
    },
    toAdd() {
      this.$store.commit('bondsNonp/setBondsNonpInfo', {})
      this.orderInfoFormVisible = true
    },
    saveCallBack() {
      this.orderInfoFormVisible = false
      this.loadTable()
    },
    changeStatus(status, id) {
      if (status === '02') {
        switchStatus({ id: id, busiStatus: '03' }).then(response => {
          this.loadTable()
        })
      } else if (status === '03') {
        switchStatus({ id: id, busiStatus: '02' }).then(response => {
          this.loadTable()
        })
      }
    },
    isShowChangeStatusBtn(status) {
      return status === '02' || status === '03'
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
