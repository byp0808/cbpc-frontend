<template>
  <div class="flex-container">
    <div class="flex-item">
      <el-card class="flex-children curve-build">
        <el-form :inline="true" :model="queryForm">
          <el-form-item>
            <el-select v-model="queryForm.curveId" @change="handleOptionChange">
              <el-option v-for="item in curveList.dataList" :key="item.id" :label="item.orderName" :value="item.orderName" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="indexQuery">查询</el-button>
          </el-form-item>
          <span id="time" style="float:right;font-size:22px;line-height:36px">{{ queryForm.nowdate }}</span>
        </el-form>
        <el-row>
          <el-col :span="8">
            <el-table
              ref="multipleTable1"
              :data="liborDataList.dataList[0]"
              tooltip-effect="dark"
              style="width: 100%"
            >
              <el-table-column label="利率期限">
                <template slot-scope="scope">
                  <el-button type="text" @click="initstandSlipSet(scope.$index)">{{ scope.row.timeLimit }}</el-button>
                </template>
              </el-table-column>
              <el-table-column label="利率 %">
                <template slot-scope="scope">
                  {{ scope.row.rate }}
                </template>
              </el-table-column>
            </el-table>
          </el-col>
          <el-col :span="8">
            <el-table
              ref="multipleTable1"
              :data="liborDataList.dataList[1]"
              tooltip-effect="dark"
              style="width: 100%"
            >
              <el-table-column label="利率期限">
                <template slot-scope="scope">
                  <el-button type="text" @click="initstandSlipSet(scope.$index)">{{ scope.row.timeLimit }}</el-button>
                </template>
              </el-table-column>
              <el-table-column label="利率 %">
                <template slot-scope="scope">
                  {{ scope.row.rate }}
                </template>
              </el-table-column>
            </el-table>
          </el-col>
          <el-col :span="8">
            <el-table
              ref="multipleTable1"
              :data="liborDataList.dataList[2]"
              tooltip-effect="dark"
              style="width: 100%"
            >
              <el-table-column label="利率期限">
                <template slot-scope="scope">
                  <el-button type="text" @click="initstandSlipSet(scope.$index)">{{ scope.row.timeLimit }}</el-button>
                </template>
              </el-table-column>
              <el-table-column label="利率 %">
                <template slot-scope="scope">
                  {{ scope.row.rate }}
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </el-card>
      <el-dialog v-if="dialogFormVisible" title="Libor曲线" :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="90%">
        <CurveInfluenceFactorLiborCur
          ref="refCurveInfluenceFactorLiborCur"
        />
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">
            取消
          </el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
// import { formatTimeToStr } from '@/utils/date.js'
import { querylidor } from '@/api/curve/curve-query.js'
import CurveInfluenceFactorLiborCur from '@/views/curve/influencefactor/curve-influence-factor-libor-cur.vue'
export default {
  name: 'CurveInfluenceFactorLibor',
  components: { CurveInfluenceFactorLiborCur },
  //   props: ['taskDay', 'orderId'],
  data() {
    return {
      liborDataList: {
        dataList: []
      },
      queryForm: {
        curveId: '',
        nowdate: ''
      },
      dialogFormVisible: false,
      curveList: {
        dataList: [
          { id: '选项一', orderName: '欧元' },
          { id: '选项二', orderName: '英镑' },
          { id: '选项三', orderName: '日元' },
          { id: '选项四', orderName: '瑞朗' },
          { id: '选项五', orderName: '加元' },
          { id: '选项六', orderName: '澳元' }
        ]
      }
    }
  },
  mounted() {
    this.liborDataList.dataList = this.getQuerylibor()
    this.funtime()
  },
  methods: {
    // 主页面查询方法
    // 根据 activeName 调用各个页面查询方法
    indexQuery() {
      console.info(this)
      if (!this.queryForm.curveId) {
        this.$message({
          type: 'error',
          message: '请选择'
        })
        return false
      }
      this.getQuerylibor()
    },
    handleOptionChange(pageSize) {

    },
    // 获取时间
    funtime() {
      var date = new Date()
      console.info(date + '时间')
      this.queryForm.nowdate = (date.getFullYear()) + '年' + (date.getMonth() + 1) + '月' + (date.getDate()) + '日'
    },
    // 点击利率期限
    initstandSlipSet() {
      console.info('点击利率期限')
      this.dialogFormVisible = true
    },
    // 获取libor数据
    getQuerylibor() {
      const options = []
      const options1 = []
      const options2 = []
      const options3 = []
      querylidor(this.queryForm).then(response => {
        var datalist = response
        if (datalist && datalist.length > 0) {
          for (var i = 0; i < datalist.length; i++) {
            var data = datalist[i]
            if (i % 3 === 0) {
              options1.push(data)
            }
            if (i % 3 === 1) {
              options2.push(data)
            }
            if (i % 3 === 2) {
              options3.push(data)
            }
          }
          options.push(options1, options2, options3)
        }
      })
      return options
    }
  }
}
</script>
<style scoped>
  .flex-container {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: flex-start;
    width: auto;
    min-width: 100%;
  }
  .flex-item {
    display: flex;
    flex-direction: row;
    width: 100%;
  }
  .flex-children {
    /* flex: 1; */
    /* display: inline-block; */
    margin: 20px auto;
  }
  .curve-build {
    width: 100%;
    margin-right: 20px;
  }
</style>
