<template>
  <div class="box">
    <el-table
      :data="allList"
      style="width: 100%"
      max-height="400"
      :header-cell-style="{background:'#f4f7fc'}"
      tooltip-effect="dark"
      border
      fit
      highlight-current-row
      @selection-change="handleSelectionChange"
    >
      <el-table-column align="center" label="全选" type="selection" />
      <el-table-column label="优先" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.priority | priorityFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.taskStatus | taskStatus }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="isMy" label="方案操作" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="adjust(scope.row)">调整</el-button>
        </template>
      </el-table-column>
      <el-table-column v-if="!isMy" label="调整人" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.userId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="资产编码" align="center" width="150">
        <template slot-scope="scope">
          <!-- <span>{{ scope.row.bondId }}</span> -->
          <span type="text" class="blue" @click="goBasic(scope.row)">{{ scope.row.assetCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="资产简称" align="center">
        <template slot-scope="scope">
          <!-- <span>{{ scope.row.bondShort }}</span> -->
          <span type="text" class="blue" @click="goBasic(scope.row)">{{ scope.row.bondShort }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发行人" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.bondPublisher }}</span>
        </template>
      </el-table-column>
      <el-table-column label="流通场所" align="center">
        <template slot-scope="scope">
          <span>{{ $dft('MARKET', scope.row.marketId) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="债券性质" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.assetDtlCategCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="含权说明" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.marketGrade }}</span>
        </template>
      </el-table-column>
      <el-table-column label="推荐方向" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.recoDire }}</span>
        </template>
      </el-table-column>
      <el-table-column label="隐含评级" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.marketGrade }}</span>
        </template>
      </el-table-column>
      <el-table-column label="目标曲线" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.curveId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="信用点差" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.spreadValue }}</span>
        </template>
      </el-table-column>
      <el-table-column label="相对点差" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.relaSpread }}</span>
        </template>
      </el-table-column>
      <el-table-column label="流动性点差" align="center" width="110px">
        <template slot-scope="scope">
          <span>{{ scope.row.flAdjValue }}</span>
        </template>
      </el-table-column>
      <el-table-column label="其他点差" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.otAdjValue }}</span>
        </template>
      </el-table-column>
      <el-table-column label="总点差（变动）" align="center" width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.chgSpread }}</span>
        </template>
      </el-table-column>
      <el-table-column label="估值收益率" align="center" width="110px">
        <template slot-scope="scope">
          <span>{{ scope.row.yield }}</span>
        </template>
      </el-table-column>
      <el-table-column label="调整原因" align="center">
        <template slot-scope="scope">
          <span>{{ causeFilter(scope.row.cause) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="进入时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createdTs }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发布批次" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.batchId }}</span>
        </template>
      </el-table-column>
    </el-table>
    <transition name="dialog-fade-in">
      <el-dialog v-if="AdjustDialog" :visible.sync="AdjustDialog" width="100%" style="bottom:0;top:20%">
        <scheme-form :adjust-data="adjustParams" />
      </el-dialog>
    </transition>

  </div>
</template>
<script>
import SchemeForm from '@/views/valuation/scheme/scheme-method.vue'
export default {
  name: 'AssetList',
  components: {
    SchemeForm
  },
  props: {
    allList: {
      type: Array,
      default: function() {
        return []
      }
    },
    isMy: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      ruleSetFormVisible: false,
      AdjustDialog: false,
      taskRangeId: '',
      adjustParams: {},
      selectionList: [],
      taskList: [],
      list: [],
      tabHeight: '',
      page: {
        pageNumber: 1,
        pageSize: 10,
        totalRecord: 0
      }
    }
  },
  methods: {
    causeFilter(params) {
      switch (params) {
        case '01': return '新券'
        case '02': return '评级下降'
        case '03': return '盯市'
        case '04': return '信用事件'
        case '05': return '客户投诉'
        case '06': return '评级上升'
        case '07': return '巡检'
        case '08': return '其他'
      }
    },
    goBasic(e) {
      this.$router.push({ name: 'SchemeConstruct', params: e })
    },
    adjust(e) {
      this.AdjustDialog = true
      this.adjustParams.taskId = e.id
    },
    getDataList() {
      return this.taskList
    },
    handleSelectionChange(val) {
      if (val.length > 0) {
        this.taskList = val
      } else {
        this.taskList = []
      }
      this.$emit('taskList', this.taskList)
      // if (val.length > 0) {
      //   val.map((v, i) => {
      //     this.selectionList.push(v.id)
      //   })
      //   this.selectionList = Array.from(new Set(this.selectionList))
      //   this.$emit('selectionList', this.selectionList)
      // } else {
      //   this.selectionList = []
      //   this.taskList = []
      // }
    }
    // handleSizeChange(pageSize) {
    //   this.page.pageSize = pageSize
    //   this.load()
    // },
    // handleCurrentChange(currentPage) {
    //   this.page.pageNumber = currentPage
    //   this.load()
    // }
  }
}
</script>

<style lang="scss" scoped>
 .box {
     margin-top: 10px;
 }
 .blue {
   color:#ff8901;
   cursor: pointer;
 }
 @keyframes dialog-fade-in {
   0% {
     transform:translate(0,50%);
   }
   50% {
     transform:translate(0,100%);
   }
    100% {
     transform:translate(0,0);
   }
 }

</style>
