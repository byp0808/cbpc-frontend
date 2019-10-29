<template>
  <div>
    <el-table
      :data="haveSelectList"
      style="width: 100%"
      max-height="300"
      :header-cell-style="{background:'#f4f7fc'}"
      border
      fit
      highlight-current-row
    >
      <el-table-column label="资产编码" align="center" width="150px">
        <template slot-scope="scope">
          <span>{{ scope.row.bondId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="资产简称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.bondShort }}</span>
        </template>
      </el-table-column>
      <el-table-column label="流通场所" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.maketId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="含权说明" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.filterId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否推荐" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column label="估值方法" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.filterId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="市场隐含评级" align="center" width="120px">
        <template slot-scope="scope">
          <span>{{ $dft('MARKET_GRADE', scope.row.marketGrade) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="目标曲线" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.curveId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="目标信用点差" align="center" width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.filterId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="目标流动性点差" align="center" width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.flAdjValue }}</span>
        </template>
      </el-table-column>
      <el-table-column label="目标其他点差" align="center" width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.otAdjValue }}</span>
        </template>
      </el-table-column>
      <el-table-column label="总点差" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.filterId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="估值收益率" align="center" width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.filterId }}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-row>
      <el-col :span="24"><div class="line" /></el-col>
    </el-row>
    <el-row style="margin-top:20px;margin-bottom:20px">
      <el-col :span="3" :offset="21">
        <el-button v-loading="addLoading" type="primary" @click="addBatch">批量添加至我的任务</el-button>
      </el-col>
    </el-row>
    <el-table
      v-loading="tabLoading"
      :data="allList"
      style="width: 100%"
      max-height="400"
      :header-cell-style="{background:'#f4f7fc'}"
      border
      fit
      highlight-current-row
      @selection-change="handleSelectionChange"
    >
      <el-table-column align="center" label="全选" type="selection" />
      <el-table-column label="方案操作" align="center" width="200px">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="adjust(scope.row)">添加至我的任务</el-button>
          <el-button type="text" size="small" @click="goPage(scope.row)">查看行情</el-button>
        </template>
      </el-table-column>
      <el-table-column label="资产编码" align="center" width="150px">
        <template slot-scope="scope">
          <span>{{ scope.row.csin }}</span>
        </template>
      </el-table-column>
      <el-table-column label="资产简称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.valAssetShortName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="流通场所" align="center" width="200px">
        <template slot-scope="scope">
          <span>{{ scope.row.marketId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="估值方法" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.filterId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="市场隐含评级" align="center" width="120px">
        <template slot-scope="scope">
          <span>{{ $dft('MARKET_GRADE', scope.row.marketGrade) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="目标曲线" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.curveId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="曲线类型" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.filterId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="目标信用点差" align="center" width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.filterId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="目标流动性点差" align="center" width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.flAdjValue }}</span>
        </template>
      </el-table-column>
      <el-table-column label="目标其他点差" align="center" width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.otAdjValue }}</span>
        </template>
      </el-table-column>
      <el-table-column label="点差类型" align="center">
        <template slot-scope="scope">
          <span>{{ $dft('ADJ_WAY', scope.row.cdsPremAdjWay) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="预估价格" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.filterId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="调整方式" align="center">
        <template slot-scope="scope">
          <span>{{ $dft('ADJ_TYPE', scope.row.cdsPremAdjType) }}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="margin-top:20px"
      align="center"
      :current-page="params.page.pageNumber"
      :page-sizes="[10, 20, 30, 40, 50]"
      :page-size="params.page.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="params.page.totalRecord"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { getSamePeople } from '@/api/valuation/influence.js'
import { addOneTask } from '@/api/valuation/task.js'

export default {
  name: 'SamePeople',
  components: {
  },
  data() {
    return {
      haveSelectList: [],
      allList: [],
      selectList: [],
      selectId: [],
      id: '',
      tabLoading: false,
      addLoading: false,
      AdjustDialog: false,
      volumeAdd: {},
      params: {
        page: {
          pageNumber: 1,
          pageSize: 10,
          totalRecord: 0
        }
      }
    }
  },
  created() {
    if (this.$route.params) {
      this.haveSelectList.push(this.$route.params)
      this.id = this.$route.params.id
    }
    this.getAllList()
  },
  methods: {
    handleSelectionChange(e) {
      this.selectList = e
    },
    adjust(e) {
      this.volumeAdd.csin = e.csin
      addOneTask(this.volumeAdd).then(res => {
        this.$message({
          message: '添加成功',
          type: 'success'
        })
        this.getAllList()
      })
    },
    goPage() {
      this.$router.push('/market/secondary-market-list')
    },
    getAllList() {
      this.params.search_fiId_EQ = this.id
      // this.params.search_fiId_EQ = '128d3beed63a408090fb28745c9a1110'
      this.tabLoading = true
      getSamePeople(this.id).then(res => {
        this.tabLoading = false
        console.log('22', res)
        this.allList = res
      }).catch(() => {
        this.tabLoading = false
      })
    },
    addBatch() {
      if (this.selectList.length === 0) {
        return this.$message.warning('至少选择一条估值资产')
      }
      // this.selectList.map(v => {
      //   this.selectId.push(v.csin)
      // })
      // this.selectId = Array.from(new Set(this.selctId))
      // console.log('ss', this.selectId)
      // addOneTask(this.selectId).then(res => {
      //   this.$message.success('批量添加成功')
      // })
    },
    handleSizeChange(pageSize) {
      this.params.page.pageSize = pageSize
      this.getAllList()
    },
    handleCurrentChange(currentPage) {
      this.params.page.pageNumber = currentPage
      this.getAllList()
    }
  }
}
</script>
<style lang="scss" scoped>
.line {
    height: 1px;
    background: #ccc;
    margin-top: 30px;
}
</style>
