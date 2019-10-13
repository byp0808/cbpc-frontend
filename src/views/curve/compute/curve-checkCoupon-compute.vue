<template>
  <div>
    <!-- 檢查曲綫樣本券列表 -->
    <el-table
      :data="checkCurveCouponList"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="curvePrdCode" label="曲线编码" width="140" />
      <el-table-column prop="curveName" label="曲线名称" width="200" show-overflow-tooltip />
      <el-table-column prop="buildStatus" label="样本券编制状态" width="150" show-overflow-tooltip>
        <template slot-scope="{ row }">
          {{ $dft('CURVE_BUILD_STATUS', row.buildStatus) }}
        </template>
      </el-table-column>
      <el-table-column prop="sum" label="样本券总数" width="140" show-overflow-tooltip>
        <template slot-scope="{ row }">
          <span class="link-type">{{ row.sum }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="addNum" label="较上一批增加数量" width="140" show-overflow-tooltip>
        <template slot-scope="{ row }">
          <span class="link-type">{{ row.addNum }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="subNum" label="较上一批减少数量" width="140" show-overflow-tooltip>
        <template slot-scope="{ row }">
          <span class="link-type">{{ row.subNum }}</span>
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
    <!-- 较上一批增加样本券 -->
    <el-dialog v-if="addNumVisible" title="较上一批增加" :visible.sync="addNumVisible">
      <el-table
        :data="addNumList"
        tooltip-effect="dark"
        style="width: 100%"
      >
        <el-table-column prop="curvePrdCode" label="债券名称" width="140" />
        <el-table-column prop="curveName" label="状态" width="100" show-overflow-tooltip />
        <el-table-column label="操作" align="center" width="100" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="text" size="big" @click="curveReferDtoEdit(scope.$index, curveReferDtoList)">
              忽略
            </el-button>
            <el-button type="text" size="big" @click="curveReferDtoDel(scope.$index, curveReferDtoList)">
              取消忽略
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="storageCurveHomology()">
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
        <el-table-column prop="curvePrdCode" label="债券名称" width="140" />
        <el-table-column prop="curveName" label="状态" width="100" show-overflow-tooltip />
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
import { checkCurveCouponList, findAddOrSub } from '@/api/curve/curve-order-compute.js'
export default {
  name: 'CurveCheckCouponCompute',
  data() {
    return {
      multipleSelection: [],
      percentage: 0,
      queryForm: {
        curveName: '',
        buildType: '1',
        buildStatus: ''
      },
      checkCurveCouponList: [],
      addNumList: [],
      subNumList: [],
      page: {
        pageNumber: 1,
        pageSize: 10
      },
      addNumVisible: false,
      subNumVisible: false
    }
  },
  created() {

  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    queryCheckCurveCouponList() {
      var data = {
        curveName: this.curveName,
        buildStatus: this.buildStatus,
        buildType: this.buildType,
        orderId: this.orderId,
        page: this.page
      }
      checkCurveCouponList(data).then(response => {
        this.checkCurveCouponList = response.dataList
        setTimeout(1.5 * 1000)
      })
    },
    // 获取相同批次下曲线较上一批增加或者减少的的样本券
    findAddOrSubList() {
      var data = {
        curveName: this.curveName,
        orderId: this.orderId
      }
      findAddOrSub(data).then(response => {
        this.checkCurveCouponList = response.dataList
        setTimeout(1.5 * 1000)
      })
    },
    sizeChange(pageSize) {
      this.page.pageSize = pageSize
      this.queryCheckCurveCouponList()
    },
    currentChange(currentPage) {
      this.page.pageNumber = currentPage
      this.queryCheckCurveCouponList()
    }
  }
}
</script>

<style scoped>

</style>
