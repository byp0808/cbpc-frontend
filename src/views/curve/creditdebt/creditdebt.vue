<template>

  <el-form>
    <el-row>
      <el-col :span="8">
        <el-form ref="dataForm" :model="temp" label-position="left" label-width="90px" style="border:1px solid black;width:100%;padding:10px 5px;height:600px">
          <el-row>
            <el-col>
              <el-form-item label="选择曲线" label-width="100px">
                <el-select v-model="temp.curveId" placeholder="请选择曲线" style="width: 80%" :disabled="jinZhiXuanZe" @visible-change="loadCurvePrdKd">
                  <el-option v-for="item in selectCurve" :key="item.data.curveId" :label="item.data.productName" :value="item.data.curveId" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="最后操作人" label-width="100px">
                <el-input v-model="temp.lastUpdBy" style="width: 80%" disabled />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="最后操作时间" label-width="100px">
                <el-input v-model="temp.lastUpdTs" style="width: 80%" disabled />
              </el-form-item>
            </el-col>
          </el-row>
          <el-table :data="standSlipList" border highlight-current-row style="width: 727px;" max-height="300">
            <el-table-column label="关键期限" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.productName }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="big"
                  @click="curveHomologySheZhi(scope.$index, standSlipList)"
                >设置
                </el-button>
                <el-button
                  type="text"
                  size="big"
                  @click="curveHomologySheZhi(scope.$index, standSlipList)"
                >复制上一期限并设置
                </el-button>
                <el-button
                  type="text"
                  size="big"
                  @click="curveHomologyDelete(scope.$index, standSlipList)"
                >删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
      </el-col>
      <el-col v-show="curveHomologyShow" :span="8" style="border:1px solid black;border-left:0;padding:10px 5px;height:600px;position: relative;">
        <el-alert
          title="消息提示的文案"
          type="info"
          center
          :closable="false"
        />
        <el-table
          ref="singleTable"
          :data="tableData"
          height="400"
          style="width:100%;"
        >
          <el-table-column
            type="index"
            width="50"
          />
          <el-table-column
            property="date"
            label="场景"
            width="120"
          />
          <el-table-column
            property="name"
            label="行为"
            width="120"
          />
          <el-table-column
            property="address"
            label="操作"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                size="big"
                @click="curveHomologyXiuGai(scope.$index, curveHomologyList)"
              >修改
              </el-button>
            </template>
          </el-table-column>

        </el-table>
        <el-button
          class="filter-item"
          type="primary"
          size="big"
          style="position: absolute;right: 10px;margin-top:30px;width:100px"
          @click="curveHomologyXiuGai"
        >
          新增
        </el-button>
      </el-col>
      <el-col v-show="curveHomologyXing" :span="8">
        <el-form ref="dataForm" :model="temp" label-position="left" label-width="90px" style="border:1px solid black;border-left:0;width:100%;padding:10px 5px;height:600px;position: relative;">
          <el-row style="height:45%">
            <el-col :span="4">
              <h3 style="font-size:40px;">场<br><br>景</h3>
            </el-col>
            <el-scrollbar style="height:100%">
              <el-col v-for="(item, index) in bankMessage" :key="index" :span="19" class="box">
                <el-form style="width:100%;min-height:200px">
                  <el-form style="padding:4px 8px;border:1px solid black;">
                    <el-row>
                      <el-col>
                        <el-form-item label="权重" label-width="100px" style="height:20px;">
                          <el-input v-model="temp.lastUpdBy" style="width: 80%" />%
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col>
                        <el-form-item label="选择同调曲线" label-width="100px" style="height:20px;">
                          <el-select v-model="temp.curveId" placeholder="请选择曲线" style="width: 80%">
                            <el-option v-for="item in selectCurve" :key="item.value" :label="item.label" :value="item.value" />
                          </el-select>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col>
                        <el-form-item label="关键期限" label-width="100px" style="height:20px;">
                          <el-select v-model="temp.curveId" placeholder="请选择曲线" style="width: 80%">
                            <el-option v-for="item in selectCurve" :key="item.value" :label="item.label" :value="item.value" />
                          </el-select>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col>
                        <el-form-item label="指标" label-width="100px" style="height:20px;">
                          <el-select v-model="temp.curveId" placeholder="请选择曲线" style="width: 80%">
                            <el-option v-for="item in selectCurve" :key="item.value" :label="item.label" :value="item.value" />
                          </el-select>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-form>
                  <el-row :gutter="5" style="margin-top:5px">
                    <el-col :span="9">
                      <el-form-item>
                        <el-select v-model="temp.curveId" placeholder="请选择" style="height:20px;width: 100%">
                          <el-option v-for="item in selectCurve" :key="item.value" :label="item.label" :value="item.value" />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="9">
                      <el-form-item>
                        <el-input v-model="temp.lastUpdBy" style="height:20px;width: 100%" />
                      </el-form-item>
                    </el-col>
                    <el-col span="2" style="height:34px;line-height: 34px">BP</el-col>
                  </el-row>
                </el-form>
              </el-col>
              <el-col :span="4">
                <el-button icon="el-icon-circle-plus" style="margin-top:80px;padding:0;font-size:60px;color:black;background:#fff;border:0;" circle @click="addMessage" />
              </el-col>
            </el-scrollbar>
          </el-row>
          <hr>
          <el-row style="height:45%">
            <el-col :span="4">
              <h3 style="font-size:40px;">行<br><br>为</h3>
            </el-col>
            <el-scrollbar style="overflow-x: hidden;height:100%">
              <el-col v-for="(item, index) in bankMessage2" :key="index" :span="16" class="box">
                <el-form style="width:100%;min-height:200px">
                  <el-form style="padding:4px 8px;border:1px solid black;">
                    <el-row>
                      <el-col>
                        <el-form-item label="权重" label-width="100px" style="height:20px;">
                          <el-input v-model="temp.lastUpdBy" style="width: 80%" />%
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col>
                        <el-form-item label="选择同调曲线" label-width="100px" style="height:20px;">
                          <el-select v-model="temp.curveId" placeholder="请选择曲线" style="width: 80%">
                            <el-option v-for="item in selectCurve" :key="item.value" :label="item.label" :value="item.value" />
                          </el-select>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col>
                        <el-form-item label="关键期限" label-width="100px" style="height:20px;">
                          <el-select v-model="temp.curveId" placeholder="请选择曲线" style="width: 80%">
                            <el-option v-for="item in selectCurve" :key="item.value" :label="item.label" :value="item.value" />
                          </el-select>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col>
                        <el-form-item label="指标" label-width="100px" style="height:20px;">
                          <el-select v-model="temp.curveId" placeholder="请选择曲线" style="width: 80%">
                            <el-option v-for="item in selectCurve" :key="item.value" :label="item.label" :value="item.value" />
                          </el-select>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-form>
                  <el-row :gutter="5" style="margin-top:5px">
                    <el-col :span="9">
                      <el-form-item>
                        <el-select v-model="temp.curveId" placeholder="请选择" style="height:20px;width: 100%">
                          <el-option v-for="item in selectCurve" :key="item.value" :label="item.label" :value="item.value" />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="9">
                      <el-form-item>
                        <el-input v-model="temp.lastUpdBy" style="height:20px;width: 100%" />
                      </el-form-item>
                    </el-col>
                    <el-col span="2" style="height:34px;line-height: 34px">BP</el-col>
                  </el-row>
                </el-form>
              </el-col>
              <el-col :span="4">
                <el-button icon="el-icon-circle-plus" style="margin-top:80px;padding:0;font-size:60px;color:black;background:#fff;border:0;" circle @click="addMessage2" />
              </el-col>
            </el-scrollbar>
          </el-row>
          <el-form-item>
            <el-button type="primary" style="position: absolute;right: 0;" @click="onSubmit">保存场景行为</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import {
  getCurveInitOptions,
  queryCurvePrdKd
} from '@/api/curve/curve-product-list.js'

export default {
  name: 'Creditdebt',
  props: ['temp'],
  data() {
    return {
      bankMessage: [],
      bankMessage2: [],
      selectCurve: [],
      standSlipList: [],
      tableData: [],
      currentRow: null,
      jinZhiXuanZe: false,
      curveHomologyShow: true,
      curveHomologyXing: true

    }
  },
  beforeMount() {
    console.info('===beforeMount===')
    this.getinitCaseList
    // 先加载列表
    this.selectCurve = getCurveInitOptions()
    console.info('初始化')
    console.info(this.selectCurve)
  },
  methods: {
    loadCurvePrdKd(value) {
      if (value) {
        console.info('来了')
        console.info(this.selectCurve)
        this.getstandSlipList({
          curveId: this.temp.curveId,
          approveStatus: this.selectCurve.data,
          standSlip: this.selectCurve.filter(item => item.curveId).standSlip
        })
      }
    },
    // 查询列表
    getstandSlipList(data) {
      queryCurvePrdKd(data).then(response => {
        this.standSlipList = response.dataList
        setTimeout(1.5 * 1000)
        console.log(data)
      })
    },

    // 列表删除
    curveHomologyDelete(index, rows) {
      rows[index]
      rows.splice(index, 1)
    },

    // 显示设置
    curveHomologySheZhi() {
      this.curveHomologyShow = true
    },

    // 显示场景和行为
    curveHomologyXiuGai() {
      this.curveHomologyXing = true
    },

    // 添加一个场景
    addMessage() {
      this.bankMessage.unshift(
        {
          lastUpdBy: '',
          curveId: ''
        }
      )
    },

    // 添加一个行为
    addMessage2() {
      this.bankMessage2.unshift(
        {
          lastUpdBy: '',
          curveId: ''
        }
      )
    },

    obtainCurveHomology() {
      var data = {
        curveId: this.temp.curveId,
        approveStatus: this.temp.approveStatus,
        standSlipList: this.standSlipList
      }
      return data
    }
  }
}
</script>

<style scoped>
</style>
