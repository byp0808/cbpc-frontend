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
      :data="checkCurveCouponList"
      tooltip-effect="dark"
      style="width: 100%"
    >
      <el-table-column prop="curvePrdCode" label="曲线编码" width="140" />
      <el-table-column prop="curveName" label="曲线名称" width="200" show-overflow-tooltip />
      <el-table-column prop="sampleCompStatus" label="样本券编制状态" width="150" show-overflow-tooltip>
        <template slot-scope="{ row }">
          {{ $dft('SAMPLE_COMP_STATUS', row.sampleCompStatus) }}
        </template>
      </el-table-column>
      <el-table-column prop="sum" label="样本券总数" width="140" show-overflow-tooltip>
        <template slot-scope="{ row }">
          <span>{{ row.sum }}</span>
          <span class="link-type" @click="allCouponList">详情</span>
        </template>
      </el-table-column>
      <el-table-column prop="addNum" label="较上一批增加数量" width="140" show-overflow-tooltip>
        <template slot-scope="{ row }">
          <span>{{ row.addNum }}</span>
          <span class="link-type" @click="addNumDetails">详情</span>
        </template>
      </el-table-column>
      <el-table-column prop="subNum" label="较上一批减少数量" width="140" show-overflow-tooltip>
        <template slot-scope="{ row }">
          <span>{{ row.subNum }}</span>
          <span class="link-type" @click="subNumDetails">详情</span>
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
        <el-table-column prop="bondName" label="债券名称" width="140" />
        <el-table-column prop="change" label="状态" width="100" show-overflow-tooltip>
          <template slot-scope="{ row }">
            {{ $dft('CHANGE', row.change) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="100" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button v-if="addIgnoreVisible" :visible.sync="addIgnoreVisible" type="text" size="big" @click="overpass(scope.$index, addNumList, 'ADD')">
              忽略
            </el-button>
            <el-button v-else type="text" size="big" @click="cancleOverpass(scope.$index, addNumList, 'ADD')">
              取消忽略
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="certainIgnore('ADD')">
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
        <el-table-column label="操作" align="center" width="100" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button v-if="subIgnoreVisible" :visible.sync="subIgnoreVisible" type="text" size="big" @click="overpass(scope.$index, addNumList,'SUB')">
              忽略
            </el-button>
            <el-button v-else type="text" size="big" @click="cancleOverpass(scope.$index, addNumList ,'SUB')">
              取消忽略
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="certainIgnore('SUB')">
          确定忽略
        </el-button>
      </div>
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
      addNumList: [],
      subNumList: [],
      page: {
        pageNumber: 1,
        pageSize: 10
      },
      addNumVisible: false,
      subNumVisible: false,
      addIgnoreVisible: true,
      subIgnoreVisible: true
    }
  },
  created() {

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
        setTimeout(1.5 * 1000)
      })
    },
    // 复核样本券
    checkOrDeployComp() {
      var data = {
        action: '2',
        checkCoupons: this.checkCurveCouponList
      }
      checkOrDeployComp(data).then(response => {
        setTimeout(1.5 * 1000)
      })
    },
    // 获取相同批次下曲线所有的样本券
    allCouponList() {
      var data = {
        curveName: this.curveName,
        orderId: this.orderId,
        taskDay: ''
      }
      findAll(data).then(response => {
        this.checkCurveCouponList = response.dataList
        setTimeout(1.5 * 1000)
      })
    },
    // 较上一批增加的样本券
    addNumDetails() {
      var data = {
        curveName: this.curveName,
        orderId: this.orderId,
        change: '新增'
      }
      findAddOrSub(data).then(response => {
        this.addNumList = response.dataList
        setTimeout(1.5 * 1000)
      })
    },
    // 较上一批次减少的的样本券
    subNumDetails() {
      var data = {
        curveName: this.curveName,
        orderId: this.orderId,
        change: '减少'
      }
      findAddOrSub(data).then(response => {
        this.subNumList = response.dataList
        setTimeout(1.5 * 1000)
      })
    },
    // 忽略
    overpass(index, rows, type) {
      rows[index].change = '3'
      // eslint-disable-next-line no-empty,eqeqeq
      if (type == 'ADD') {
        this.addIgnoreVisible = false
      } else {
        this.subIgnoreVisible = false
      }
    },
    // 取消忽略
    cancleOverpass(index, rows, type) {
      // eslint-disable-next-line no-empty,eqeqeq
      if (type == 'ADD') {
        rows[index].change = '1'
        this.addIgnoreVisible = true
      } else {
        rows[index].change = '2'
        this.subIgnoreVisible = true
      }
    },
    // 确定忽略
    certainIgnore(type) {
      var data
      // eslint-disable-next-line eqeqeq
      if (type == 'ADD') {
        data = this.addNumList
      } else {
        data = this.subNumList
      }
      certainIgnore(data).then(response => {
        this.$message({
          message: '操作成功！',
          type: 'success',
          showClose: true
        })
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
      return this.checkCurveCouponList
    }
  }
}
</script>

<style scoped>

</style>
