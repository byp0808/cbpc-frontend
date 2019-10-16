<template>
  <div class="box">
    <div>
      <el-table
        :data="allList"
        max-height="300"
        style="width: 100%"
        :header-cell-style="{background:'#f6f6f6'}"
        tooltip-effect="dark"
        border
        fit
        highlight-current-row
        @selection-change="handleSelectionChange"
      >
        <el-table-column align="center" label="全选" type="selection" />
        <el-table-column label="估值日期" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.cause }}</span>
          </template>
        </el-table-column>
        <el-table-column label="估值批次" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.cause }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作人" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.remark }}</span>
          </template>
        </el-table-column>
        <el-table-column label="债券简称" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.bondsId }}</span>
          </template>
        </el-table-column>
        <el-table-column label="债券代码" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.bondsId }}</span>
          </template>
        </el-table-column>
        <el-table-column label="日间估价全价（元）" align="center" width="160px">
          <template slot-scope="scope">
            <span>{{ scope.row.filterId }}</span>
          </template>
        </el-table-column>
        <el-table-column label="日间应计利息（元）" align="center" width="160px">
          <template slot-scope="scope">
            <span>{{ scope.row.filterId }}</span>
          </template>
        </el-table-column>
        <el-table-column label="估价净价（元）" align="center" width="160px">
          <template slot-scope="scope">
            <span>{{ scope.row.filterId }}</span>
          </template>
        </el-table-column>
        <el-table-column label="估价收益率（%）" align="center" width="160px">
          <template slot-scope="scope">
            <span>{{ scope.row.yield }}</span>
          </template>
        </el-table-column>
        <el-table-column label="日终估价全价（元）" align="center" width="160px">
          <template slot-scope="scope">
            <span>{{ scope.row.filterId }}</span>
          </template>
        </el-table-column>
        <el-table-column label="日终应计利息（元）" align="center" width="160px">
          <template slot-scope="scope">
            <span>{{ scope.row.filterId }}</span>
          </template>
        </el-table-column>
        <el-table-column label="可信度" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.filterId }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>

export default {
  name: 'AssetList',
  components: {

  },
  props: {
    allList: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  //   props: ['allList'],
  data() {
    return {
      ruleSetFormVisible: false,
      taskRangeId: '',
      selectionList: [],
      list: []
    }
  },
  methods: {
    handleSelectionChange(val) {
      if (val.length > 0) {
        val.map(v => {
          this.selectionList.push(v.id)
        })
        this.selectionList = Array.from(new Set(this.selectionList))
        this.$emit('selectionList', this.selectionList)
      } else {
        this.selectionList = []
      }
    }
  }
}
</script>

<style scoped>
 .box {
     margin-top: 10px;
 }
</style>
