<template>
  <div class="app-container">
    <div style="margin-bottom: 20px">
      <el-input
        v-model="search_bondId_LIKE"
        style="width: 20%"
        clearable
        placeholder="输入资产编码/资产简称"
        prefix-icon="el-icon-search"
      />
      <el-button type="primary" @click="loadTable">查询</el-button>
      <el-button type="primary" @click="toAdd">添加</el-button>
      <el-upload
        style="display: inline-block;"
        :action="uploadUrl"
        :multiple="false"
        name="attach"
        :on-success="uploadSuccess"
        :show-file-list="false"
      >
        <el-button type="primary">批量添加</el-button>
      </el-upload>
      <el-button type="info" @click="batchDelete">批量移出</el-button>
    </div>
    <el-table
      ref="refBondsNonpTable"
      :data="bondsNonpList"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
        :selectable="selectToBatch"
      />
      <el-table-column
        prop="bondsConceptType"
        label="资产概念分类"
        show-overflow-tooltip
        width="120"
      />
      <el-table-column
        prop="bondId"
        label="资产编码"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        prop="bondsShortName"
        label="资产简称"
        show-overflow-tooltip
        width="160"
      />
      <el-table-column
        prop="bondsIssuer"
        label="发行人"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        prop="marketId"
        label="流通场所"
        show-overflow-tooltip
        width="100"
      >
        <template slot-scope="{row}">
          {{ convertMarket(row.marketId) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="cause"
        label="不参与原因"
        show-overflow-tooltip
        width="180"
      />
      <el-table-column
        prop="dateStart"
        label="添加日期"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        prop="indate"
        label="有效期（天）"
        show-overflow-tooltip
        width="120"
      />
      <el-table-column
        prop="dateEnd"
        label="自动释放时间点"
        show-overflow-tooltip
        width="120"
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
            v-if="scope.row.approveStatus!=='01'"
            type="text"
            size="small"
            @click.native.prevent="toDetail(scope.row.id)"
          >
            设置
          </el-button>
          <el-button
            v-if="scope.row.approveStatus==='02' || scope.row.approveStatus==='03'"
            type="text"
            size="small"
            @click.native.prevent="toDelete(scope.row.id)"
          >
            移出
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
    <el-dialog v-if="bondsNonpFormVisible" width="92%" title="不参与估值设置" :visible.sync="bondsNonpFormVisible">
      <BondsNonpForm
        ref="BondsNonpForm"
        :bonds-nonp-data="bondsNonpData"
        :business-id="bondsNonpId"
        :csin-disabled="csinDisabled"
        @saveCallBack="saveCallBack"
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="bondsNonpFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import BondsNonpForm from '@/views/valuation/bonds-nonp/bonds-nonp-form.vue'
import { queryBondsNonpList, deleteBondsNonp, switchStatus } from '@/api/valuation/bonds-nonp.js'
import { basic_api_valuation } from '../../../api/base-api'
export default {
  name: 'BondNonpList',
  components: {
    BondsNonpForm
  },
  data() {
    return {
      uploadUrl: `${process.env.VUE_APP_BASE_API}${basic_api_valuation}/bonds-nonp/batch-in`,
      bondsNonpFormVisible: false,
      csinDisabled: false,
      bondsNonpId: '',
      bondsNonpList: [],
      bondFilterList: [],
      bondsNonpData: {},
      search_bondId_LIKE: '',
      page: {
        pageNumber: 1,
        pageSize: 10
      },
      multipleSelection: []
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
      const query = this.search_bondId_LIKE ? { search_bondId_LIKE: this.search_bondId_LIKE } : {}
      queryBondsNonpList(Object.assign(query, { page: this.page })).then(response => {
        const { dataList, page } = response
        this.page = page
        this.bondsNonpList = dataList
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    convertMarket(val) {
      let res = ''
      val = val.split(',')
      for (const x in val) {
        res += this.$dft('MARKET', val[x]) + '  '
      }
      return res
    },
    selectToBatch(row, index) {
      return row.approveStatus !== '01'
    },
    save() {
      this.$refs.BondsNonpForm.save()
    },
    cancel() {
      this.$store.commit('bondsNonp/setBondsNonpInfo', {})
      this.bondsNonpFormVisible = false
    },
    toDetail(id) {
      this.bondsNonpId = id
      this.bondsNonpFormVisible = true
      this.csinDisabled = true
    },
    toDelete(id) {
      this.$confirm('确认移出此规则?', '提示', {
        type: 'warning'
      }).then(() => {
        deleteBondsNonp([id]).then(response => {
          this.$message({
            message: '移出成功！',
            type: 'success',
            showClose: true
          })
          this.loadTable()
        })
      }).catch(() => {
      })
    },
    batchDelete() {
      const res = []
      this.multipleSelection.forEach(obj => {
        res.push(obj.id)
      })
      if (res.length === 0) {
        this.$message({
          message: '请选择至少一条数据进行操作！',
          type: 'warning',
          showClose: true
        })
        return false
      }
      this.$confirm('共选择' + res.length + '条资产，确认移出?', '提示', {
        type: 'warning'
      }).then(() => {
        deleteBondsNonp(res).then(response => {
          this.$message({
            message: '移出成功！',
            type: 'success',
            showClose: true
          })
          this.loadTable()
        })
      }).catch(() => {
      })
    },
    toAdd() {
      this.bondsNonpId = ''
      this.$store.commit('bondsNonp/setBondsNonpInfo', {})
      this.bondsNonpFormVisible = true
      this.csinDisabled = false
    },
    saveCallBack() {
      this.bondsNonpFormVisible = false
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
    uploadSuccess() {
      this.$message.success('批量添加成功')
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
