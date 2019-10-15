<template>
  <div class="line-table">
    <h3 class="orange">{{ name }}
      <span v-if="showButton" class="right">
        <el-button size="mini" icon="el-icon-plus">加权选点</el-button>
        <el-button size="mini" type="primary">确认曲线</el-button>
        <el-button size="mini" type="danger">回退</el-button>
        <el-button size="mini" type="danger">重置</el-button>
      </span>
    </h3>
    <el-table :data="list" size="mini" :fit="false" class="no-hover-row" @cell-click="selectHomology">
      <el-table-column label="期限" width="56" align="right" header-align="center">
        <template slot-scope="{ row }">
          <span>{{ row.standSlip }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所选券" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.bondName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所选券期限" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.slip }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所选收益率" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.yield }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所选偏差值" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.deviation }}</span>
        </template>
      </el-table-column>
      <el-table-column label="同调">
        <template slot-scope="{ row }">
          <span>{{ row.homology }}</span>
        </template>
      </el-table-column>
      <el-table-column label="调整理由">
        <template slot-scope="{ row }">
          <span>{{ row.adjReason }}</span>
        </template>
      </el-table-column>
      <el-table-column label="调整幅度" align="center">
        <template slot-scope="{ row }">
          <span v-if="row.adjRangeFlag" class="cell-edit-input">
            <el-input v-model="row.adjRange" placeholder="请输入内容" />
          </span>
          <span v-else>{{ row.adjRange }}</span>
        </template>
      </el-table-column>
      <el-table-column label="昨天收益率" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.lastYield }}</span>
        </template>
      </el-table-column>
      <el-table-column label="调整结果" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.adjResult }}</span>
        </template>
      </el-table-column>
      <el-table-column label="期限间变动" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.adjRange }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所选字段">
        <template slot-scope="{ row }">
          <span>{{ row.itemName }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showDivision" align="center" width="120">
        <template slot="header">
          <el-button size="mini" @click="historyDivision">历史分位点</el-button>
        </template>
        <template slot-scope="{ row }">
          <span>{{ row.historyDivision }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { queryHistoryDivision } from '@/api/curve/curve-build'
export default {
  props: {
    list: {
      type: Array,
      default: () => []
    },
    curveId: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    },
    edit: {
      type: Boolean,
      default: false
    },
    showDivision: {
      type: Boolean,
      default: false
    },
    showButton: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      data: this.list,
      homologyFlag: false,
      adjResultFlag: false,
      adjRangeFlag: false
    }
  },
  methods: {
    selectHomology(row, column, cell, event) {
      if (column.label === '同调') {
        console.log(row, column)
        this.homologyFlag = true
      }
      if (column.label === '调整结果') {
        this.adjResultFlag = true
      }
      if (column.label === '调整幅度') {
        this.adjRangeFlag = true
      }
    },
    historyDivision() {
      const _list = this.data.map(e => {
        e.curveId = this.curveId
        return e
      })
      queryHistoryDivision(_list).then(response => {
        this.data = response.dataList
      })
    }
  }
}
</script>

<style scoped>
.line-table {
  padding: 5px;
}
.orange {
  color: #ff8901;
}
.right {
  float: right;
}
</style>
