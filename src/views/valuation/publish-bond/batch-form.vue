<template>
  <div>
    <el-row style="margin-bottom:30px;margin-top:15px">
      <el-col :span="1" style="margin-top:8px">批次：</el-col>
      <el-col :span="23">
        <el-button v-for="item in batchTime" :key="item.value" :value="item.value" :class="isActive === item.value ? 'haveBackground': 'noBackground'" style="margin-right:20px" @click="changeBatch(item)">{{ item.name }}</el-button>
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
      :data="allList"
      style="width: 100%"
      max-height="500"
      :header-cell-style="{background:'#eee'}"
      border
      fit
      highlight-current-row
      @selection-change="handleSelectionChange"
    >
      <el-table-column align="center" type="selection" :selectable="selectable" />
      <el-table-column label="基础产品名称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.cause }}</span>
        </template>
      </el-table-column>
      <el-table-column label="可售产品名称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column label="曲线准备状态" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.filterId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.cause }}</span>
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
      batchTime: [
        { value: '', name: '10:00' },
        { value: '02', name: '11:00' },
        { value: '03', name: '12:00' },
        { value: '04', name: '13:00' },
        { value: '05', name: '14:00' }
      ],
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
    getAllList() {

    },
    selectable(row, index) { // 是否可选
      console.log('ddd', row)
      if (row.remark === '002') {
        return true
      } else {
        return false
      }
    },
    toCompute() {
      //   const hour = date.getHours()
      //   const minutes = date.getMinutes()
      //   const second = date.getSeconds()
    //   const time = this.$moment(new Date()).format('hh:mm:ss')
    },
    changeBatch(e) {
      this.isActive = e.value
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
    background: #cfc;
}
.noBackground {
    background: #fff;
}
</style>

