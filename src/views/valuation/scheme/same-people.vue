<template>
  <div>
    <el-table
      :data="haveSelectList"
      style="width: 100%"
      max-height="300"
      :header-cell-style="{background:'#efefef'}"
      border
      fit
      highlight-current-row
    >
      <el-table-column label="资产编码" align="center">
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
          <span>{{ scope.row.marketId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="含权说明" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.cause }}</span>
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
          <span>{{ scope.row.marketGrade }}</span>
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
        <el-button type="primary">批量添加至我的任务</el-button>
      </el-col>
    </el-row>
    <el-table
      v-loading="tabLoading"
      :data="allList"
      style="width: 100%"
      max-height="400"
      :header-cell-style="{background:'#efefef'}"
      border
      fit
      highlight-current-row
      @selection-change="handleSelectionChange"
    >
      <el-table-column align="center" label="全选" type="selection" />
      <el-table-column label="方案操作" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.cause }}</span>
        </template>
      </el-table-column>
      <el-table-column label="资产编码" align="center">
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
          <span>{{ scope.row.marketGrade }}</span>
        </template>
      </el-table-column>
      <el-table-column label="目标曲线" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.marketGrade }}</span>
        </template>
      </el-table-column>
      <el-table-column label="曲线类型" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.marketGrade }}</span>
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
          <span>{{ scope.row.filterId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="预估价格" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.filterId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="调整方式" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.filterId }}</span>
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
export default {
  name: 'SamePeople',
  components: {
  },
  data() {
    return {
      haveSelectList: [],
      allList: [],
      tabLoading: false,
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
  },
  methods: {
    selectionChange(e) {

    },
    handleSelectionChange(e) {

    },
    getAllList() {

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
