<template>
  <div>
    <el-row
      style="margin: 20px 0;"
    >
      <el-form :inline="true" :model="queryForm" class="demo-form-inline">
        <el-form-item label="曲线名称">
          <el-input v-model="queryForm.curveName" placeholder="曲线名称" />
        </el-form-item>
        <el-form-item label="样本券编制状态">
          <el-select v-model="queryForm.sampleCompStatus" placeholder="样本券编制状态">
            <el-option
              v-for="(name, key) in $dict('SAMPLE_COMP_STATUS')"
              :key="key"
              :label="name"
              :value="key"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="queryCheckCurveCouponList()">查询</el-button>
        </el-form-item>
        <!-- 将选择的曲线样本券状态改成已复核 -->
        <el-form-item>
          <el-button type="primary" @click="checkOrDeployComp()">复核</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <!-- 檢查曲綫樣本券列表 -->
    <el-table
      ref="checkCurveCouponList"
      :data="checkCurveCouponList"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="curvePrdCode" label="曲线编码" width="140" />
      <el-table-column prop="curveName" label="曲线名称" width="200" show-overflow-tooltip />
      <el-table-column prop="sampleCompStatus" label="样本券编制状态" width="150" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ $dft('SAMPLE_COMP_STATUS', scope.row.sampleCompStatus) }}
        </template>
      </el-table-column>
      <el-table-column prop="sum" label="样本券总数" width="140" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.sum }}</span>
          <span class="link-type" @click="allDetails(scope.$index,checkCurveCouponList)">详情</span>
        </template>
      </el-table-column>
      <el-table-column prop="addNum" label="较上一批增加数量" width="140" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.addNum }}</span>
          <span class="link-type" @click="addNumDetails(scope.$index,checkCurveCouponList)">详情</span>
        </template>
      </el-table-column>
      <el-table-column prop="subNum" label="较上一批减少数量" width="140" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.subNum }}</span>
          <span class="link-type" @click="subNumDetails(scope.$index,checkCurveCouponList)">详情</span>
        </template>
      </el-table-column>
      <el-table-column prop="ignoreNum" label="忽略的样本券总数" width="140" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.ignoreNum }}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="page.pageNumber"
      :page-sizes="[10, 20, 30, 40, 50]"
      :page-size="page.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="page.totalRecord"
      @size-change="sizeChange"
      @current-change="currentChange"
    />
    <!-- 查询全部样本券 -->
    <el-dialog v-if="allVisible" title="全部样本券" :visible.sync="allVisible">
      <el-table
        :data="allCouponList"
        tooltip-effect="dark"
        style="width: 100%"
      >
        <el-table-column prop="bondName" label="债券名称" width="140" />
        <el-table-column prop="bondShortName" label="债券简称" width="140" />
      </el-table>
    </el-dialog>

    <!-- 较上一批增加样本券 -->
    <el-dialog v-if="addNumVisible" title="较上一批增加" :visible.sync="addNumVisible">
      <el-table
        :data="addNumList"
        tooltip-effect="dark"
        style="width: 100%"
      >
        <el-table-column prop="bondName" label="债券名称" width="240" />
        <el-table-column prop="change" label="状态" width="100" show-overflow-tooltip>
          <template slot-scope="{ row }">
            {{ $dft('CHANGE', row.change) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="100" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button v-if="scope.row.isCancle" :visible.sync="scope.row.isCancle" type="text" size="big" @click="overpass(scope.$index, addNumList)">
              忽略
            </el-button>
            <el-button v-else type="text" size="big" @click="cancleOverpass(scope.$index, addNumList)">
              取消忽略
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="certainIgnore()">
          确定忽略
        </el-button>
      </div>
    </el-dialog>

    <!-- 较上一批减少的样本券 -->
    <el-dialog v-if="subNumVisible" title="较上一批减少" :visible.sync="subNumVisible">
      <el-table
        :data="subNumList"
        tooltip-effect="dark"
        style="width: 100%"
      >
        <el-table-column prop="bondName" label="债券名称" width="140" />
        <el-table-column prop="change" label="状态" width="100" show-overflow-tooltip>
          <template slot-scope="{ row }">
            {{ $dft('CHANGE', row.change) }}
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
import { checkCurveCouponList, findAll, findAddOrSub, certainIgnore, checkOrDeployComp } from '@/api/curve/curve-order-compute.js'
export default {
  name: 'CurveCheckCouponCompute',
  props: ['orderId'],
  data() {
    return {
      multipleSelection: [],
      percentage: 0,
      queryForm: {
        curveName: '',
        sampleCompStatus: ''
      },
      checkCurveCouponList: [],
      allCouponList: [],
      addNumList: [],
      subNumList: [],
      page: {
        pageNumber: 1,
        pageSize: 10
      },
      allVisible: false,
      addNumVisible: false,
      subNumVisible: false
    }
  },
  created() {
    this.queryCheckCurveCouponList()
  },
  methods: {
    // 查询样本券列表
    queryCheckCurveCouponList() {
      var data = {
        curveName: this.queryForm.curveName,
        orderId: this.orderId,
        sampleCompStatus: this.queryForm.sampleCompStatus,
        page: this.page
      }
      checkCurveCouponList(data).then(response => {
        this.checkCurveCouponList = response.dataList
        this.page = response.page
        setTimeout(1.5 * 1000)
      })
    },
    // 复核样本券
    checkOrDeployComp() {
      var selection = this.$refs.checkCurveCouponList.selection
      var data = {
        action: '2',
        checkCoupons: selection
      }
      for (var i = 0; i < selection.length; i++) {
        if (selection[i].sampleCompStatus !== '1') {
          this.$message({
            type: 'error',
            message: '请选择待复核的数据进行复核！'
          })
          return false
        }
      }
      checkOrDeployComp(data).then(response => {
        this.$message({
          message: '复核成功！',
          type: 'success',
          showClose: true
        })
        this.queryCheckCurveCouponList()
        setTimeout(1.5 * 1000)
      })
    },
    // 获取相同批次下曲线所有的样本券
    allDetails(index, rows) {
      this.allVisible = true
      var data = {
        curveId: rows[index].curveId,
        orderId: this.orderId
      }
      findAll(data).then(response => {
        this.allCouponList = response.dataList
        setTimeout(1.5 * 1000)
      })
    },
    // 较上一批增加的样本券
    addNumDetails(index, rows) {
      this.addNumVisible = true
      var data = {
        curveId: rows[index].curveId,
        orderId: this.orderId,
        change: '13',
        taskDay: rows[index].taskDay
      }
      findAddOrSub(data).then(response => {
        this.addNumList = response.dataList
        // eslint-disable-next-line no-return-assign
        for (var i = 0; i<this.addNumList.length;i++) {
          if(this.addNumList[i].change === '3'){
            this.addNumList[i].isCancle = false
          }else{
            this.addNumList[i].isCancle = true
          }
        }
        setTimeout(1.5 * 1000)
      })
    },
    // 较上一批次减少的的样本券
    subNumDetails(index, rows) {
      this.subNumVisible = true
      var data = {
        curveId: rows[index].curveId,
        orderId: this.orderId,
        change: '2',
        taskDay: rows[index].taskDay
      }
      findAddOrSub(data).then(response => {
        this.subNumList = response.dataList
        setTimeout(1.5 * 1000)
      })
    },
    // 忽略
    overpass(index, rows) {
      rows[index].change = '3'
      rows[index].isCancle = false
    },
    // 取消忽略
    cancleOverpass(index, rows) {
      rows[index].change = '1'
      rows[index].isCancle = true
    },
    // 确定忽略
    certainIgnore() {
      var data = {
        changeList: this.addNumList
      }
      if (!this.addNumList) {
        this.$message({
          message: '没有需要忽略的数据！',
          type: 'error'
        })
      }
      certainIgnore(data).then(response => {
        this.$message({
          message: '操作成功！',
          type: 'success',
          showClose: true
        })
        this.addNumVisible = false
        this.queryCheckCurveCouponList()
      })
    },
    sizeChange(pageSize) {
      this.page.pageSize = pageSize
      this.queryCheckCurveCouponList()
    },
    currentChange(currentPage) {
      this.page.pageNumber = currentPage
      this.queryCheckCurveCouponList()
    },
    obtainCheckCurveCouponList() {
      return this.$refs.checkCurveCouponList.selection
    },
    handleSelectionChange(items) {
      this.multipleSelection = items
    }
  }
}
</script>

<style scoped>

</style>
