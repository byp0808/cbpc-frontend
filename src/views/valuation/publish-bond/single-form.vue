<template>
  <div>
    <!-- <el-row style="margin-bottom:30px;margin-top:15px">
      <el-col :span="1" style="margin-top:8px">批次：</el-col>
      <el-col :span="23">
        <el-button v-for="item in batchTime" :key="item.value" :value="item.value" :class="isActive === item.value ? 'haveBackground': 'noBackground'" style="margin-right:20px" @click="changeBatch(item)">{{ item.name }}</el-button>
      </el-col>
    </el-row> -->
    <el-row style="margin-bottom:20px" :gutter="20">
      <el-col :span="6">
        <el-form>
          <el-form-item label="资产编码" label-width="70px">
            <el-input v-model="assetId" clearable />
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" @click="add">添加</el-button>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" @click="cmpt">计算</el-button>
      </el-col>
    </el-row>
    <!-- <el-row style="margin-bottom:30px">
      <el-col>
        <el-button v-for="item in batchTime" :key="item.value" :value="item.value" style="margin-right:20px" @click="changeBatch(item)">{{ item.name }}</el-button>
      </el-col>
    </el-row> -->
    <el-table
      v-loading="allLoading"
      :data="taskList"
      style="width: 100%"
      max-height="500"
      :header-cell-style="{background:'#f4f7fc'}"
      border
      fit
      highlight-current-row
      @selection-change="handleSelectionChange"
    >
      <el-table-column align="center" label="全选" type="selection" />
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.cause }}</span>
        </template>
      </el-table-column>
      <el-table-column label="方案操作" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column label="资产编码" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.assetCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="资产简称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.bondShort }}</span>
        </template>
      </el-table-column>
      <el-table-column label="流通场所" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.marketId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="估值方法" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.valuScene }}</span>
        </template>
      </el-table-column>
      <el-table-column label="市场隐含评级" align="center" width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.marketGrade }}</span>
        </template>
      </el-table-column>
      <el-table-column label="目标曲线" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.curveId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="目标信用点差" align="center" width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.spreadValue }}</span>
        </template>
      </el-table-column>
      <el-table-column label="目标流动性点差" align="center" width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.flAdjValue }}</span>
        </template>
      </el-table-column>
      <el-table-column label="目标其他点差" align="center" width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.otAdjValue }}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="addBondDialog" title="添加单资产估值">
      <el-row>
        <el-col :span="18" :offset="3">
          <el-form>
            <div class="bond-box">
              <span>资产编码:</span>
              <span style="padding-left:8px">{{ assetId }}</span>
            </div>
            <el-form-item label="流通场所">
              <el-checkbox-group v-model="checkedSite" class="checkGroup" @change="changeSite">
                <el-checkbox v-for="item in bondList" :key="item" :label="item.id">{{ item.marketId }}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8" :offset="15">
          <div class="dialog-footer">
            <el-button @click="addBondDialog= false">取 消</el-button>
            <el-button type="primary" @click="saveSite">确 定</el-button>
          </div>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import { assetAdd, taskAdd, taskCmpt } from '@/api/valuation/cmpt.js'
export default {
  name: 'SingleForm',
  components: {
  },
  data() {
    return {
      allLoading: false,
      addBondDialog: false,
      isActive: '',
      bondId: '',
      assetId: '',
      bondList: [],
      taskList: [],
      checkedSite: [],
      batchTime: [
        { value: '', name: '10:00' },
        { value: '02', name: '11:00' },
        { value: '03', name: '12:00' },
        { value: '04', name: '13:00' },
        { value: '05', name: '14:00' }
      ],
      allList: [
        // { marketId: '上海', value: '01' },
        // { marketId: '银行', value: '02' },
        // { marketId: '广州', value: '03' }
      ],
      selectList: [],
      sizeList: [],
      params: {
        page: {
          pageNumber: 1,
          pageSize: 10,
          totalRecord: 0
        }
      }
    }
  },
  created() {
    // this.isActive = this.batchTime[0].value
  },
  methods: {
    getAllList() {

    },
    changeBatch(e) {
      this.isActive = e.value
    },
    handleSelectionChange(e) {
      this.selectList = e
      // this.selectList.map(v => {
      //   this.sizeList.push(v.marketId)
      //   this.sizeList = Array.from(new Set(this.sizeList))
      // })
    },
    add() {
      if (!this.assetId) {
        return this.$message.warning('请输入资产编码')
      }
      assetAdd(this.assetId).then(response => {
        this.bondList = response
      })

      this.addBondDialog = true
      this.checkedSite = this.sizeList
    },
    changeSite(e) {
      console.log('e', e)
      this.checkedSite = e
    },
    saveSite() {
      taskAdd(this.checkedSite).then(response => {
        this.taskList = response
        this.addBondDialog = false
      })
    },
    cmpt() {
      taskCmpt(this.selectList).then(response => {
        console.log(response)
      })
    },
    handleSizeChange(pageSize) {
      this.params.page.pageSize = pageSize
      this.getAllList()
    },
    handleCurrentChange(currentPage) {
      this.params.page.pageNumber = currentPage
      this.getAllList()
    }
  }
}
</script>
<style lang="scss" scoped>
.bond-box {
    margin-bottom:20px;
    color: #bbb;
}
.haveBackground {
    background: #cfc;
}
.noBackground {
    background: #fff;
}
.checkGroup {
    padding-left: 80px;
}
</style>

