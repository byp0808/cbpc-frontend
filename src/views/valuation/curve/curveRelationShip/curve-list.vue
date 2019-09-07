<template>
  <div id="app-container">
    <div style="margin: 10px">
      <el-button type="warning" class="float-left" @click="addRulesVisible=true">新增规则</el-button>
      <el-button type="info" class="float-left">复制新增</el-button>
      <el-button type="info" class="float-right">批量复核</el-button>
    </div>
    <div>
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          min-width="5%"
        />
        <el-table-column
          prop="curve"
          label="估值曲线"
          min-width="35%"
        />
        <el-table-column
          prop="relative"
          label="相对曲线"
          min-width="35%"
        />
        <el-table-column
          prop="status"
          label="复核状态"
          min-width="10%"
          show-overflow-tooltip
        />
        <el-table-column
          label="操作"
          min-width="15%"
        >
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="showAlert('设置')">设置</el-button>
            <el-button type="text" size="small" @click="showAlert('删除')">删除</el-button>
            <el-button type="text" size="small" @click="showAlert('停用')">停用</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog lock-scroll="false" width="50%" title="新增目标曲线和相对曲线关系" :visible.sync="addRulesVisible">
        <AddRulesForm />
        <div slot="footer" class="dialog-footer">
          <el-button @click="addRulesVisible = false">取 消</el-button>
          <el-button type="primary" @click="addRulesVisible = false">保 存</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import AddRulesForm from './add-rules-form'
export default {
  name: 'CurveList',
  comments: {
    AddRulesForm
  },
  components: { AddRulesForm },
  data() {
    return {
      tableData: [{
        curve: '中债地方政府债收益率曲线（AAA)',
        relative: '中债地方政府债收益率曲线（AAA-)',
        status: '复核通过'
      }, {
        curve: '中债地方政府债收益率曲线（AAA-)',
        relative: '中债地方政府债收益率曲线（AA+)',
        status: '复核通过'
      }, {
        curve: '中债地方政府债收益率曲线（AA+)',
        relative: '中债地方政府债收益率曲线（AA)',
        status: '复核通过'
      }, {
        curve: '中债地方政府债收益率曲线（AA)',
        relative: '中债地方政府债收益率曲线（AA-)',
        status: '待复核'
      }],
      addRulesVisible: false
    }
  },
  methods: {
    showAlert(content) {
      alert('你点击了' + content + '按钮！')
    }
  }
}
</script>

<style scoped>
  .float-left{
    float: left;
  }
  .float-right{
    float: right;
  }
</style>
