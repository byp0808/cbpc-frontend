<template>
  <div class="app-container">
    <el-row class="btn-zone">
      <el-col :span="8">
        <el-input v-model="relaFormTable.tempInfo.name" :disabled="disabled" type="text" placeholder="请输入矩阵名称" />
      </el-col>
      <el-col :span="12" :offset="2">
        <el-button type="primary" :disabled="this.index === 0 ? true : disabled" @click="moveToPri">前移</el-button>
        <el-button type="primary" :disabled="disabled" @click="relaFormTableDelete">删除关系</el-button>
        <el-button type="primary" :disabled="this.last ? true : disabled" @click="moveToNext">后移</el-button>
      </el-col>
    </el-row>
    <el-table
      ref="multipleTable"
      :data="relaFormTable.dataList"
      tooltip-effect="dark"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" :selectable="selectable" />
      <el-table-column v-for="(item) in relaFormTable.columnProp" :key="item.key" :prop="item.prop" :label="item.label" />
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'CurveSetRelaFormTable',
  components: {
  },
  props: ['relaFormTable', 'index', 'last', 'disabled'],
  data() {
    return {
      multipleSelection: [],
      tableName: '',
      bak: ''
    }
  },
  watch: {
  },
  beforeMount() {
  },
  updated() {
    var checkKdList = this.relaFormTable.checkKdList
    if (checkKdList && checkKdList.length) {
      for (const item of this.relaFormTable.dataList) {
        if (checkKdList.indexOf(item.standSlip) >= 0) {
          this.$refs.multipleTable.toggleRowSelection(item, true) // 默认选中
        }
      }
    }
  },
  methods: {
    selectable(row, index) {
      if (this.disabled) {
        return false
      }
      return true
    },
    handleSelectionChange(items) {
      this.multipleSelection = items
    },
    // 删除关系
    relaFormTableDelete() {
      this.$emit('relaFormTableDelete', this.index)
    },
    // 前移
    moveToPri() {
      this.$emit('moveToPri', this.index)
    },
    // 后移
    moveToNext() {
      this.$emit('moveToNext', this.index)
    },
    getSeletedKd() {
      var selectedKd = []
      for (const index in this.multipleSelection) {
        const item = this.multipleSelection[index]
        selectedKd.push({ standSlip: item.standSlip, tempId: this.relaFormTable.tempInfo.id })
      }
      return selectedKd
    },
    getRelaFormTable() {
      return this.relaFormTable
    }
  }
}
</script>

<style scoped>
.btn-zone{
  margin: 10px;
}
</style>
