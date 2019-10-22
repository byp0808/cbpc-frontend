<template>
    <el-form ref="dataForm" :model="temp" label-position="left" label-width="120px">
        <el-row>
            <el-col :span="12">
                <el-form-item label="选择曲线">
                    <el-select v-model="temp.curveId" placeholder="请选择曲线" style="width: 200px" :disabled="disabled">
                        <el-option v-for="item in selectCurve" :key="item.value" :label="item.label" :value="item.value"/>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="approveStatus" v-show="false">
                    <el-input v-model="temp.approveStatus" disabled/>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <el-form-item label="最后操作人">
                    <el-input v-model="temp.lastUpdBy" style="width: 200px" disabled/>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="最后操作时间">
                    <el-input v-model="$moment(temp.lastUpdTs).format('YYYY-MM-DD')" style="width: 200px" disabled/>
                </el-form-item>
            </el-col>
        </el-row>

        <el-form-item label="选择同调曲线" :disabled="disabled">
            <el-select ref="homologyCurve" v-model="homologyCurveId" placeholder="请选择同调曲线">
                <el-option v-for="item in selectCurveHomology" :key="item.value" :label="item.label" :value="item.value"/>
            </el-select>
            <el-button class="filter-item" style="margin-left: 10px;" type="primary"
                       @click="curveHomologyAdd"
                       :disabled="disabled">
                添加
            </el-button>
        </el-form-item>
        <el-table :data="curveHomologyList" border highlight-current-row style="width: 727px;">
            <el-table-column label="同调曲线" width="500px" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.productName }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="226px" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button type="text" size="big"
                               @click="curveHomologyDelete(scope.$index, curveHomologyList)"
                               :disabled="disabled">
                      删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-form>
</template>

<script>
  import {
    querycurveHomology,
    getCurveProductIdOptions
  } from '@/api/curve/curve-product-list.js'

  export default {
    name: "Homology",
    props: ['temp', 'disabled'],
    data() {
      return {
        selectCurve: [],
        selectCurveHomology: [],
        homologyCurveId: '',
        curveHomologyList: []
      }
    },
    beforeMount() {
      console.info('===beforeMount===')
      this.getCurveHomologyDtoList
      // 先加载列表
      this.selectCurve = getCurveProductIdOptions()
      this.selectCurveHomology = getCurveProductIdOptions()
    },
    created() {
      this.getCurveHomologyList({
        curveId : this.temp.curveId,
        approveStatus : this.temp.approveStatus
      });
    },
    methods: {
      // 查询列表
      getCurveHomologyList(data) {
        querycurveHomology(data).then(response => {
          debugger
          this.curveHomologyList = response.dataList
          setTimeout(1.5 * 1000)
        })
      },

      // 列表删除
      curveHomologyDelete(index, rows) {
        rows[index]
        rows.splice(index, 1);
      },

      // 选择同调曲线并添加到列表
      curveHomologyAdd() {
        var homologyCurveId = this.homologyCurveId
        var label = this.$refs.homologyCurve.selectedLabel
        if (!homologyCurveId) {
          this.$message({
            type: 'error',
            message: '请选择曲线'
          })
          return false
        }
        debugger
        for (var i = 0; i < this.curveHomologyList.length; i++) {
          var item = this.curveHomologyList[i]
          if (item.homologyCurveId === homologyCurveId) {
            this.$message({
              type: 'error',
              message: '不可重复选择'
            })
            return false
          }
        }
        this.curveHomologyList.push({
          curveId: this.temp.curveId, // 依赖曲线ID
          homologyCurveId: homologyCurveId, // 依赖曲线ID
          productName: label // 同调曲线名称
        })
      },

      obtainCurveHomology() {
        var data = {
          curveId: this.temp.curveId,
          approveStatus: this.temp.approveStatus,
          curveHomologyList: this.curveHomologyList
        }
        return data
      }
    }
  }
</script>

<style scoped>

</style>
