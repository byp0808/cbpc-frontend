<template>
  <div class="app-container">
    <el-row class="btn-zone">
      <el-col :span="8">
        <el-input v-model="relaFormTable.tempInfo.name" :disabled="disabled" type="text" placeholder="请输入矩阵名称" />
      </el-col>
      <el-col :span="12" :offset="2">
        <el-button type="primary" :disabled="this.index === 0 ? true : disabled" @click="moveToPri">前移</el-button>
        <el-button type="primary" @click="relaFormTableDelete">删除关系</el-button>
        <el-button type="primary" :disabled="this.last ? true : disabled" @click="moveToNext">后移</el-button>
      </el-col>
    </el-row>
    <el-table
      ref="multipleTable"
      :data="relaFormTable.dataList"
      tooltip-effect="dark"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column v-for="(item) in relaFormTable.columnProp" :key="item.key" :prop="item.prop" :label="item.label" width="140" />
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'CurveSetRelaFormTable',
  components: {
  },
  props: ['relaFormTable', 'index', 'last'],
  data() {
    return {
      disabled: false,
      multipleSelection: [],
      tableName: '',
      bak: ''
    }
  },
  watch: {
  },
  beforeMount() {

  },
  methods: {
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
    }
  }
}
</script>

<style scoped>
.btn-zone{
  margin: 10px;
}
</style>
