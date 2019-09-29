<template>
  <div class="app-container">
    <div style="margin-bottom: 20px">
      <!-- <el-button type="primary" @click="toAddCurveProduct('ADD')">新增</el-button> -->
      <!-- <el-button v-if="false" type="primary" @click="toAddCurveProduct('COPY')">复制新增</el-button> -->

      <div class="block">
        <span class="demonstration">开始日期及批次</span>
        <el-date-picker
          v-model="dateBegin"
          type="date"
          placeholder="选择日期"
        />
        <span class="demonstration">结束日期及批次</span>
        <el-date-picker
          v-model="dateEnd"
          type="date"
          placeholder="选择日期"
        />
      </div>
      <span class="demonstration">对应收益曲线</span>
      <el-select v-model="value1" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value1"
          :label="item.label"
          :value1="item.value1"
        />
      </el-select>
      <span class="demonstration">编制方法</span>
      <el-select v-model="value2" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value2"
          :label="item.label"
          :value2="item.value2"
        />
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
    </div>
    <el-table
      ref="multipleTable"
      :data="productList.dataList"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    ><!-- :data="productList.dataList" -->
      <el-table-column type="selection" width="55" />
      <el-table-column prop="productName" label="曲线名称" width="100" />
      <el-table-column prop="curveStartTime" label="发布日期" width="140" />
      <el-table-column prop="curveOrderId" label="批次" width="100">
        <template slot-scope="scope">
          {{ scope.row.curveOrderId }}
        </template>
      </el-table-column>
      <el-table-column prop="curveBuildStatus" label="编制状态" width="100">
        <template slot-scope="scope">
          {{ scope.row.curveBuildStatus }}
        </template>
      </el-table-column>
      <el-table-column prop="standSlip" label="关键期限" width="140">
        <template slot-scope="{ row }">
          {{ $dft("BASE_PRD_CODE", row.standSlip) }}
        </template>
      </el-table-column>
      <el-table-column prop="bondName" label="所选卷" width="120">
        <template slot-scope="scope">
          {{ scope.row.bondName == null ? '' : $moment(scope.row.bondName).format('YYYY-MM-DD') }}
        </template>
      </el-table-column>
      <el-table-column prop="slip" label="所选卷期限" width="120">
        <template slot-scope="scope">
          {{ scope.row.slip == null ? '' : $moment(scope.row.slip).format('YYYY-MM-DD') }}
        </template>
      </el-table-column>
      <el-table-column prop="yield" label="所选收益率" width="100">
        <template slot-scope="{ row }">
          {{ $dft("CURVE_PRODUCT_STATUS", row.yield) }}
        </template>
      </el-table-column>
      <el-table-column prop="homology" label="同调" width="100">
        <template slot-scope="{ row }">
          {{ $dft("APPROVE_STATUS", row.homology) }}
        </template>
      </el-table-column>
      <el-table-column prop="adjReason" label="调整理由" width="100" />
      <el-table-column prop="adjRange" label="调整幅度" width="100" />
      <el-table-column prop="lastYield" label="昨日收益率" width="100" />
      <el-table-column prop="adjResult" label="调整结果" width="100" />
      <el-table-column prop="variations" label="期限间变动" width="100" />
      <el-table-column prop="itemName" label="所选字段" width="150">
        <!-- <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            :disabled="scope.row.approveStatus === '01' || scope.row.relId != null || (scope.row.dataStatus === '04' && scope.row.approveStatus === '01' )"
            @click.native.prevent="toAddCurveProduct('EDIT',scope.row.prdType,scope.row.rowNo)"
          >
            编辑
          </el-button>
          <el-button
            type="text"
            size="small"
            @click.native.prevent="toAddCurveProduct('VIEW',scope.row.prdType,scope.row.rowNo)"
          >
            查看
          </el-button>
          <el-button
            type="text"
            size="small"
            :disabled="scope.row.approveStatus === '01' || scope.row.relId != null || (scope.row.dataStatus === '04' && scope.row.approveStatus === '01' )"
            @click.native.prevent="handleDelete(scope)"
          >
            删除
          </el-button>
        </template> -->
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="productList.page.pageNumber"
      :page-sizes="[10, 20, 30, 40, 50]"
      :page-size="productList.page.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="productList.page.totalRecord"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <!-- <el-dialog v-if="addCurveProductFormVisible" :lock-scroll="lockScroll" width="40%" title="新增产品" :visible.sync="addCurveProductFormVisible">
      <CurveProductForm
        ref="refCurveProductForm"
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="addCurveProductFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveProduct">确 定</el-button>
      </div>
    </el-dialog> -->
    <!-- <el-dialog
      v-if="addCurveProductDefFormVisible"
      width="90%"
      title="曲线产品"
      :visible.sync="addCurveProductDefFormVisible"
    >
      <CurveProductDefForm
        ref="refCurveProductDefForm"
        :lock-scroll="lockScroll"
        :product-id="productId"
        :base-prd-code="basePrdCode"
        :op-type="opType"
        @confirmCurveInfoCallBack="confirmCurveInfoCallBack"
      />
    </el-dialog> -->
    <!-- <el-dialog v-if="addCurveSampleFormVisible" :lock-scroll="lockScroll" width="92%" title="曲线样本券" :visible.sync="addCurveSampleFormVisible">
      <CurveSampleForm
        ref="refCurveSampleForm"
        :product-id="productId"
        :base-prd-code="basePrdCode"
        :op-type="opType"
        @saveCureSampleCallBack="saveCureSampleCallBack"
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="addCurveSampleFormVisible = false">取 消</el-button>
        <el-button v-if="saveCureSampleBtnVisible" type="primary" @click="saveCureSample">确 定</el-button>
      </div>
    </el-dialog> -->
  </div>
</template>

<script>
// import CurveProductForm from '@/views/curve/product/curve-product-form.vue'
// import CurveProductDefForm from '@/views/curve/product/curve-product-def-form.vue'
// import CurveSampleForm from '@/views/curve/sample/curve-sample-form.vue'
// import { delCurveProduct } from '@/api/curve/curve-product-list.js'// queryCurveProductList,
// import { delCurveSample } from '@/api/curve/curve-sample.js'
import { showCodeLabel } from '@/api/curve/code-type.js'

export default {
  name: 'CurveList', // 曲线样本券列表
  components: {
    // CurveProductForm,
    // CurveSampleForm,
    // CurveProductDefForm
  },
  filters: {
    showCodeLabel: showCodeLabel
  },
  data() {
    return {
      productId: '',
      opType: '',
      basePrdCode: '', // 新增时基础产品
      dateBegin: '', // 日期选择
      dateEnd: '', // 日期选择
      value1: '', // 收益率曲线
      value2: '', // 编制方法
      productList: {
        dataList: [{
          productName: '1',
          curveStartTime: '1',
          curveOrderId: '1',
          curveBuildStatus: '1',
          standSlip: '1',
          bondName: '1',
          slip: '1',
          yield: '1',
          homology: '1',
          adjReason: '1',
          adjRange: '1',
          lastYield: '1',
          adjResult: '1',
          variations: '1',
          itemName: '1'
        }, {
          productName: '1',
          curveStartTime: '1',
          curveOrderId: '1',
          curveBuildStatus: '1',
          standSlip: '1',
          bondName: '1',
          slip: '1',
          yield: '1',
          homology: '1',
          adjReason: '1',
          adjRange: '1',
          lastYield: '1',
          adjResult: '1',
          variations: '1',
          itemName: '1'
        }, {
          productName: '1',
          curveStartTime: '1',
          curveOrderId: '1',
          curveBuildStatus: '1',
          standSlip: '1',
          bondName: '1',
          slip: '1',
          yield: '1',
          homology: '1',
          adjReason: '1',
          adjRange: '1',
          lastYield: '1',
          adjResult: '1',
          variations: '1',
          itemName: '1'
        }, {
          productName: '1',
          curveStartTime: '1',
          curveOrderId: '1',
          curveBuildStatus: '1',
          standSlip: '1',
          bondName: '1',
          slip: '1',
          yield: '1',
          homology: '1',
          adjReason: '1',
          adjRange: '1',
          lastYield: '1',
          adjResult: '1',
          variations: '1',
          itemName: '1'
        }, {
          productName: '1',
          curveStartTime: '1',
          curveOrderId: '1',
          curveBuildStatus: '1',
          standSlip: '1',
          bondName: '1',
          slip: '1',
          yield: '1',
          homology: '1',
          adjReason: '1',
          adjRange: '1',
          lastYield: '1',
          adjResult: '1',
          variations: '1',
          itemName: '1'
        }, {
          productName: '1',
          curveStartTime: '1',
          curveOrderId: '1',
          curveBuildStatus: '1',
          standSlip: '1',
          bondName: '1',
          slip: '1',
          yield: '1',
          homology: '1',
          adjReason: '1',
          adjRange: '1',
          lastYield: '1',
          adjResult: '1',
          variations: '1',
          itemName: '1'
        }, {
          productName: '1',
          curveStartTime: '1',
          curveOrderId: '1',
          curveBuildStatus: '1',
          standSlip: '1',
          bondName: '1',
          slip: '1',
          yield: '1',
          homology: '1',
          adjReason: '1',
          adjRange: '1',
          lastYield: '1',
          adjResult: '1',
          variations: '1',
          itemName: '1'
        }, {
          productName: '1',
          curveStartTime: '1',
          curveOrderId: '1',
          curveBuildStatus: '1',
          standSlip: '1',
          bondName: '1',
          slip: '1',
          yield: '1',
          homology: '1',
          adjReason: '1',
          adjRange: '1',
          lastYield: '1',
          adjResult: '1',
          variations: '1',
          itemName: '1'
        }, {
          productName: '1',
          curveStartTime: '1',
          curveOrderId: '1',
          curveBuildStatus: '1',
          standSlip: '1',
          bondName: '1',
          slip: '1',
          yield: '1',
          homology: '1',
          adjReason: '1',
          adjRange: '1',
          lastYield: '1',
          adjResult: '1',
          variations: '1',
          itemName: '1'
        }, {
          productName: '1',
          curveStartTime: '1',
          curveOrderId: '1',
          curveBuildStatus: '1',
          standSlip: '1',
          bondName: '1',
          slip: '1',
          yield: '1',
          homology: '1',
          adjReason: '1',
          adjRange: '1',
          lastYield: '1',
          adjResult: '1',
          variations: '1',
          itemName: '1'
        }, {
          productName: '1',
          curveStartTime: '1',
          curveOrderId: '1',
          curveBuildStatus: '1',
          standSlip: '1',
          bondName: '1',
          slip: '1',
          yield: '1',
          homology: '1',
          adjReason: '1',
          adjRange: '1',
          lastYield: '1',
          adjResult: '1',
          variations: '1',
          itemName: '1'
        }, {
          productName: '1',
          curveStartTime: '1',
          curveOrderId: '1',
          curveBuildStatus: '1',
          standSlip: '1',
          bondName: '1',
          slip: '1',
          yield: '1',
          homology: '1',
          adjReason: '1',
          adjRange: '1',
          lastYield: '1',
          adjResult: '1',
          variations: '1',
          itemName: '1'
        }, {
          productName: '1',
          curveStartTime: '1',
          curveOrderId: '1',
          curveBuildStatus: '1',
          standSlip: '1',
          bondName: '1',
          slip: '1',
          yield: '1',
          homology: '1',
          adjReason: '1',
          adjRange: '1',
          lastYield: '1',
          adjResult: '1',
          variations: '1',
          itemName: '1'
        }, {
          productName: '1',
          curveStartTime: '1',
          curveOrderId: '1',
          curveBuildStatus: '1',
          standSlip: '1',
          bondName: '1',
          slip: '1',
          yield: '1',
          homology: '1',
          adjReason: '1',
          adjRange: '1',
          lastYield: '1',
          adjResult: '1',
          variations: '1',
          itemName: '1'
        }, {
          productName: '1',
          curveStartTime: '1',
          curveOrderId: '1',
          curveBuildStatus: '1',
          standSlip: '1',
          bondName: '1',
          slip: '1',
          yield: '1',
          homology: '1',
          adjReason: '1',
          adjRange: '1',
          lastYield: '1',
          adjResult: '1',
          variations: '1',
          itemName: '1'
        }, {
          productName: '1',
          curveStartTime: '1',
          curveOrderId: '1',
          curveBuildStatus: '1',
          standSlip: '1',
          bondName: '1',
          slip: '1',
          yield: '1',
          homology: '1',
          adjReason: '1',
          adjRange: '1',
          lastYield: '1',
          adjResult: '1',
          variations: '1',
          itemName: '1'
        }, {
          productName: '1',
          curveStartTime: '1',
          curveOrderId: '1',
          curveBuildStatus: '1',
          standSlip: '1',
          bondName: '1',
          slip: '1',
          yield: '1',
          homology: '1',
          adjReason: '1',
          adjRange: '1',
          lastYield: '1',
          adjResult: '1',
          variations: '1',
          itemName: '1'
        }, {
          productName: '1',
          curveStartTime: '1',
          curveOrderId: '1',
          curveBuildStatus: '1',
          standSlip: '1',
          bondName: '1',
          slip: '1',
          yield: '1',
          homology: '1',
          adjReason: '1',
          adjRange: '1',
          lastYield: '1',
          adjResult: '1',
          variations: '1',
          itemName: '1'
        }, {
          productName: '1',
          curveStartTime: '1',
          curveOrderId: '1',
          curveBuildStatus: '1',
          standSlip: '1',
          bondName: '1',
          slip: '1',
          yield: '1',
          homology: '1',
          adjReason: '1',
          adjRange: '1',
          lastYield: '1',
          adjResult: '1',
          variations: '1',
          itemName: '1'
        }, {
          productName: '1',
          curveStartTime: '1',
          curveOrderId: '1',
          curveBuildStatus: '1',
          standSlip: '1',
          bondName: '1',
          slip: '1',
          yield: '1',
          homology: '1',
          adjReason: '1',
          adjRange: '1',
          lastYield: '1',
          adjResult: '1',
          variations: '1',
          itemName: '1'
        }, {
          productName: '1',
          curveStartTime: '1',
          curveOrderId: '1',
          curveBuildStatus: '1',
          standSlip: '1',
          bondName: '1',
          slip: '1',
          yield: '1',
          homology: '1',
          adjReason: '1',
          adjRange: '1',
          lastYield: '1',
          adjResult: '1',
          variations: '1',
          itemName: '1'
        }, {
          productName: '1',
          curveStartTime: '1',
          curveOrderId: '1',
          curveBuildStatus: '1',
          standSlip: '1',
          bondName: '1',
          slip: '1',
          yield: '1',
          homology: '1',
          adjReason: '1',
          adjRange: '1',
          lastYield: '1',
          adjResult: '1',
          variations: '1',
          itemName: '1'
        }, {
          productName: '1',
          curveStartTime: '1',
          curveOrderId: '1',
          curveBuildStatus: '1',
          standSlip: '1',
          bondName: '1',
          slip: '1',
          yield: '1',
          homology: '1',
          adjReason: '1',
          adjRange: '1',
          lastYield: '1',
          adjResult: '1',
          variations: '1',
          itemName: '1'
        }, {
          productName: '1',
          curveStartTime: '1',
          curveOrderId: '1',
          curveBuildStatus: '1',
          standSlip: '1',
          bondName: '1',
          slip: '1',
          yield: '1',
          homology: '1',
          adjReason: '1',
          adjRange: '1',
          lastYield: '1',
          adjResult: '1',
          variations: '1',
          itemName: '1'
        }, {
          productName: '1',
          curveStartTime: '1',
          curveOrderId: '1',
          curveBuildStatus: '1',
          standSlip: '1',
          bondName: '1',
          slip: '1',
          yield: '1',
          homology: '1',
          adjReason: '1',
          adjRange: '1',
          lastYield: '1',
          adjResult: '1',
          variations: '1',
          itemName: '1'
        }, {
          productName: '1',
          curveStartTime: '1',
          curveOrderId: '1',
          curveBuildStatus: '1',
          standSlip: '1',
          bondName: '1',
          slip: '1',
          yield: '1',
          homology: '1',
          adjReason: '1',
          adjRange: '1',
          lastYield: '1',
          adjResult: '1',
          variations: '1',
          itemName: '1'
        }],
        page: {
          pageNumber: 1,
          pageSize: 10
        }
      },
      lockScroll: true,
      // 新增产品
      addCurveProductFormVisible: false,
      // 新增曲线样本券
      addCurveSampleFormVisible: false,
      // 曲线产品定义
      addCurveProductDefFormVisible: false,
      multipleSelection: '', // 选择记录
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }, {
          text: '一周前',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }]
      },
      options: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }]

    }
  },
  computed: {

  }
}
</script>

<style scoped>

</style>
