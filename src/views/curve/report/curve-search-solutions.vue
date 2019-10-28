<template>
  <div class="app-container">
    <div style="margin-bottom: 20px">
      <el-form ref="plan" :model="plan" :label-position="'right'" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="开始日期及批次" prop="search_dateBegin_GTE">
              <el-date-picker
                v-model="plan.search_dateBegin_GTE"
                type="date"
                placeholder="选择日期"
                format="yyyy-MM-dd"
                value-format="timestamp"
                :picker-options="pickerOptionsStart"
                @change="changeEnd"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="结束日期及批次" prop="search_dateEnd_LTE">
              <el-date-picker
                v-model="plan.search_dateEnd_LTE"
                type="date"
                placeholder="选择日期"
                format="yyyy-MM-dd"
                value-format="timestamp"
                :picker-options="pickerOptionsEnd"
                @change="changeStart"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="批次" prop="search_buildType_EQ">
              <el-select v-model="plan.search_buildType_EQ" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="对应收益曲线" prop="search_productName_LIKE">
              <el-input
                v-model="plan.search_productName_LIKE"
                class="inline-input"
                placeholder="请输入曲线名称"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="编制方法" prop="search_buildType_EQ">
              <el-select v-model="plan.search_buildType_EQ" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="操作人" prop="search_assignName_LIKE">
              <el-input
                v-model="plan.search_assignName_LIKE"
                class="inline-input"
                placeholder="请输入操作人"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6" :push="2">
            <el-button class="filter-item" type="primary" icon="el-icon-search" @click="getList">查询</el-button>
            <el-button class="filter-item" type="primary" icon="el-icon-refresh" @click="reset">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-table
      ref="multipleTable"
      :data="dataList"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="getList"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="productName" label="曲线名称" width="100" />
      <el-table-column prop="curveStartTime" label="发布日期" width="140" />
      <el-table-column prop="orderName" label="批次" width="100" />
      <el-table-column prop="curveBuildStatus" label="编制状态" width="100">
        <template slot-scope="{row}">
          {{ $dft('CURVE_BUILD_STATUS', row.curveBuildStatus) }}
        </template>
      </el-table-column>
      <el-table-column prop="standSlip" label="关键期限" width="140" />
      <el-table-column prop="bondName" label="所选卷" width="120" />
      <el-table-column prop="slip" label="所选卷期限" width="120" />
      <el-table-column prop="yield" label="所选收益率" width="100" />
      <el-table-column prop="homology" label="同调" width="100" />
      <el-table-column prop="adjReason" label="调整理由" width="100" />
      <el-table-column prop="adjRange" label="调整幅度" width="100" />
      <el-table-column prop="lastYield" label="昨日收益率" width="100" />
      <el-table-column prop="adjResult" label="调整结果" width="100" />
      <el-table-column prop="variations" label="期限间变动" width="100" />
      <el-table-column prop="itemName" label="所选字段" width="150" />
      <el-table-column prop="assignName" label="责任人" width="150" />
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNumber" :limit.sync="listQuery.pageSize" @pagination="getList" />
  </div>
</template>

<script>
import { queryCurveSolutions } from '@/api/curve/curve-query'
import { selectCurve, selectPerson } from '@/api/curve/curve-task'
import Pagination from '@/components/Pagination'

export default {
  name: 'QueryCurveBuildSolu',
  components: { Pagination },
  data() {
    const model = this.$dict('MODEL')
    const temp = []
    temp.push({ label: '全部', value: '0' })
    Object.keys(model).map(k => {
      temp.push({ label: model[k], value: k })
    })
    return {
      plan: {
        search_dateBegin_GTE: '',
        search_dateEnd_LTE: '',
        search_productName_LIKE: '',
        search_curveId_EQ: '',
        search_buildType_EQ: '',
        search_assignName_LIKE: '',
        search_assign_EQ: ''
      },
      dataList: [],
      total: 0,
      listLoading: true,
      listQuery: {
        pageNumber: 1,
        pageSize: 20
      },
      pickerOptionsStart: {},
      pickerOptionsEnd: {},
      options: temp
    }
  },
  beforeMount() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      queryCurveSolutions(Object.assign(this.plan, { page: this.listQuery })).then(response => {
        this.dataList = response.dataList
        this.total = response.page.totalRecord
        this.listLoading = false
      })
    },
    reset() {
      this.$refs.plan.resetFields()
    },
    querySearch(queryString, cb) {
      const data = queryString ? { search_productName_LIKE: queryString } : {}
      selectCurve(Object.assign(data, { page: { pageNumber: 1, pageSize: 10 }})).then(response => {
        const results = response.dataList.map(i => {
          return { value: i.curveId, label: i.productName }
        })
        // 调用 callback 返回建议列表的数据
        cb(results)
      })
    },
    handleSelect(item) {
      this.plan.search_curveId_EQ = item.value
    },
    queryPersonSearch(queryString, cb) {
      const data = queryString ? { userName: queryString } : {}
      selectPerson(data).then(response => {
        const results = response.map(i => {
          return { value: i.userId, label: i.userName }
        })
        // 调用 callback 返回建议列表的数据
        cb(results)
      })
    },
    handlePersonSelect(item) {
      this.plan.search_assign_EQ = item.value
    },
    // 结束时间限制开始时间
    changeStart() {
      if (!this.plan.search_dateEnd_LTE) {
        this.pickerOptionsStart = {
          disabledDate: {}
        }
        return
      }
      this.pickerOptionsStart = Object.assign({}, this.pickerOptionsStart, {
        // 可通过箭头函数的方式访问到this
        disabledDate: (time) => {
          return time.getTime() > this.plan.search_dateEnd_LTE
        }
      })
    },
    // 开始时间 控制结束时间
    changeEnd() {
      if (!this.plan.search_dateBegin_GTE) {
        this.pickerOptionsEnd = {
          disabledDate: {}
        }
        return
      }
      this.pickerOptionsEnd = Object.assign({}, this.pickerOptionsEnd, {
        disabledDate: (time) => {
          return time.getTime() < this.plan.search_dateBegin_GTE
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
