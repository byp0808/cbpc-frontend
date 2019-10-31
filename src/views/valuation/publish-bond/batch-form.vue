<template>
  <div>
    <el-row style="margin-bottom:30px;margin-top:15px">
      <el-col :span="1" style="margin-top:8px">批次：</el-col>
      <el-col :span="23">
        <el-button v-for="item in batches" :key="item.id" :value="item.orderName" :class="isActive === item.id ? 'haveBackground': 'noBackground'" style="margin-right:20px" @click="changeBatch(item)">{{ item.orderName }}</el-button>
      </el-col>
    </el-row>
    <el-row style="margin-bottom:30px">
      <el-col :span="24">
        <el-button type="primary" @click="toCompute">开始计算</el-button>
        <i class="el-icon-caret-right" />
        <i class="el-icon-caret-right" />
        估值编制进度
        <div class="bar" style="display: inline-block;width:100px">
          <el-progress
            :text-inside="true"
            :stroke-width="35"
            :percentage="percentage"
            status="success"
            :show-text="true"
            style="color:black"
          />
        </div>
        <i class="el-icon-caret-right" />
        <i class="el-icon-caret-right" />
        <el-button type="primary" @click="publishBond">估值发布</el-button>
        <i class="el-icon-caret-right" />
        <i class="el-icon-caret-right" />
        <el-button type="primary" @click="selectBefore">使用上一批次曲线数据立即计算</el-button>
        <i class="el-icon-caret-right" />
        <i class="el-icon-caret-right" />
        <el-button type="primary" @click="waitNow">等待本批次曲线数据</el-button>
        <i class="el-icon-caret-right" />
        <i class="el-icon-caret-right" />
        <el-button type="primary" @click="review">复核</el-button>
      </el-col>
    </el-row>
    <el-table
      v-loading="allLoading"
      :data="cmptBatchList"
      style="width: 100%"
      max-height="500"
      :header-cell-style="{background:'#f4f7fc'}"
      border
      fit
      highlight-current-row
      @selection-change="handleSelectionChange"
    >
      <el-table-column align="center" type="selection" />
      <el-table-column label="基础产品名称" align="center">
        <template slot-scope="{ row }">
          {{ $dft('VALUATION_BASE_PROD', row.prodBasic) }}
          <!-- <span>{{ scope.row.prodBasic }}</span> -->
        </template>
      </el-table-column>
      <el-table-column label="可售产品名称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.prodName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="曲线准备状态" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.curveIds }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.taskStatus }}</span>
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
    <el-dialog :visible.sync="remindDialog">
      <el-row>
        <el-col :span="18" :offset="2">
          <el-button style="margin-right:40px" type="primary" plain>使用上一批次曲线数据立即计算</el-button>
          <el-button type="primary" plain>等待本批次曲线数据</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { queryBatches } from '@/api/common/common.js'
import { cmptBatchList, cmptBatch } from '@/api/valuation/cmpt.js'
export default {
  name: 'BatchForm',
  components: {
  },
  data() {
    return {
      percentage: 0,
      allLoading: false,
      remindDialog: false,
      isCounted: true,
      isActive: '',
      allList: [
        { remark: '002' },
        { remark: '021' },
        { remark: '034' },
        { remark: '056' },
        { remark: '078' }
      ],
      cmptBatchList: [],
      batches: [],
      params: {
        page: {
          pageNumber: 1,
          pageSize: 10,
          totalRecord: 0
        }
      }
    }
  },
  watch: {
    isActive: {
      deep: true,
      // immediate: true,
      handler(val) {
        cmptBatchList({ search_batchId_EQ: val }).then(response => {
          this.cmptBatchList = response
          // console.log(response)
        })
      }
    }
  },
  beforeMount() {
    queryBatches({ basePrd: '01' }).then(response => {
      this.batches = response
      if (response && response.length > 0) {
        this.isActive = response[0].id
      }
      // console.log(response)
    })
  },
  created() {
  },
  methods: {
    getAllList() {

    },
    selectable(row, index) { // 是否可选
      // console.log('ddd', row)
      if (row.remark === '002') {
        return true
      } else {
        return false
      }
    },
    toCompute() {
      const prodIds = []
      const curveIds = [1, 2, 3]
      if (this.selectList && this.selectList.length > 0) {
        this.$lodash(this.selectList).forEach(function(value, key) {
          prodIds.push(value.prodId)
          curveIds.push(value.curveIds)
        })
        cmptBatch({ prodIds: prodIds, curveIds: this.$lodash.join(curveIds, [',']), batchId: this.isActive }).then(response => {
          console.log(response)
        })
      }
    },
    changeBatch(e) {
      this.isActive = e.id
    },
    toCheckReport() {

    },
    publishBond() {

    },
    selectBefore() {

    },
    waitNow() {

    },
    review() {

    },
    handleSelectionChange(e) {
      this.selectList = e
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
.haveBackground {
    background: #ff8901;
    color: #fff;
}
.noBackground {
    background: #fff;
}
</style>

