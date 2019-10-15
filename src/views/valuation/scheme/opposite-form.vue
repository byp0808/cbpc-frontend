<template>
  <div class="box">
    <el-form>
      <el-row>
        <el-col :span="10">
          <el-form-item label="债券代码查询">
            <el-select v-model="searchInfo.userId" filterable clearable placeholder="请选择债券代码" change="bondCodeChange">
              <el-option v-for="(item, index) in bondCodeList" :key="index" :label="item.userName" :value="item.userId" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="2" :offset="12">
          <!-- <el-button type="primary" @click="bondSearch">查询</el-button> -->
          <el-button :type="isOpposite? 'info' : 'primary'" :disabled="isOpposite" @click="transform">转换</el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-table
      v-loading="tabLoading"
      :data="adjustList"
      style="width: 100%"
      max-height="500"
      :header-cell-style="{background:'#f6f6f6'}"
      tooltip-effect="dark"
      border
      fit
      highlight-current-row
      @selection-change="handleSelectionChange"
    >
      <el-table-column align="center" label="全选" type="selection" />
      <el-table-column label="是否对敲" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.priority }}</span>
        </template>
      </el-table-column>
      <el-table-column label="估值日" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.date }}</span>
        </template>
      </el-table-column>
      <el-table-column label="曲线名称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.bondShort }}</span>
        </template>
      </el-table-column>
      <el-table-column label="待偿期" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.residualMaturity }}</span>
        </template>
      </el-table-column>
      <el-table-column label="加权待偿期" align="center" width="110px">
        <template slot-scope="scope">
          <span>{{ scope.row.cause }}</span>
        </template>
      </el-table-column>
      <el-table-column label="债券简称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.bondShort }}</span>
        </template>
      </el-table-column>
      <el-table-column label="债券代码" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.bondId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="曲线收益率(%)" align="center" width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.bondShort }}</span>
        </template>
      </el-table-column>
      <el-table-column label="参考单券估值收益率(%)" align="center" width="170px">
        <template slot-scope="scope">
          <span>{{ scope.row.bondShort }}</span>
        </template>
      </el-table-column>
      <el-table-column label="市场收益率(%)" align="center" width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.bondShort }}</span>
        </template>
      </el-table-column>
      <el-table-column label="收益率偏差值(市场收益率-参考日单券估值收益率)(BP)" align="center" width="260px">
        <template slot-scope="scope">
          <span>{{ scope.row.bondShort }}</span>
        </template>
      </el-table-column>
      <el-table-column label="加减点差值(BP)" align="center" width="130px">
        <template slot-scope="scope">
          <span>{{ scope.row.bondShort }}</span>
        </template>
      </el-table-column>
      <el-table-column label="付券简称" align="center" width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.bondShort }}</span>
        </template>
      </el-table-column>
      <el-table-column label="收券简称" align="center" width="110px">
        <template slot-scope="scope">
          <span>{{ scope.row.bondShort }}</span>
        </template>
      </el-table-column>
      <el-table-column label="交易量(万元)" align="center" width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.bondShort }}</span>
        </template>
      </el-table-column>
      <el-table-column label="成交日" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.bondShort }}</span>
        </template>
      </el-table-column>
      <el-table-column label="T日结算净价" align="center" width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column label="T日结算净价-估值净价(元)" align="center" width="200px">
        <template slot-scope="scope">
          <span>{{ scope.row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column label="T日结算价偏差" align="center" width="130px">
        <template slot-scope="scope">
          <span>{{ scope.row.remark }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div>
      <el-pagination
        style="margin-top:20px"
        align="center"
        :current-page="page.pageNumber"
        :page-sizes="[10, 20, 30, 40, 50]"
        :page-size="page.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.totalRecord"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>
<script>

export default {
  name: 'AdjustForm',
  components: {

  },
  //   props: ['isOpposite'],
  props: {
    isOpposite: {
      type: Boolean,
      default: function() {
        return false
      }
    }
  },
  data() {
    return {
      tabLoading: false,
      searchInfo: {},
      selectionList: [],
      bondCodeList: [],
      adjustList: [],
      tabHeight: '',
      page: {
        pageNumber: 1,
        pageSize: 10,
        totalRecord: 0
      }
    }
  },
  created() {
    this.getAllList()
  },
  methods: {
    getAllList() {

    },
    transform() {

    },
    bondCodeChange() {

    },
    bondSearch() {

    },
    handleSelectionChange(val) {

    },
    handleSizeChange(pageSize) {
      this.page.pageSize = pageSize
      this.getAllList()
    },
    handleCurrentChange(currentPage) {
      this.page.pageNumber = currentPage
      this.getAllList()
    }
  }
}
</script>

<style scoped>
 .box {
     margin-top: 10px;
 }
</style>
