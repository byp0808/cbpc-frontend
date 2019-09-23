<template>
    <!-- 编制关键期限 -->
    <div class="app-container">
        <div class="filter-container">
            <label>编制关键期限： </label>
            <el-select v-model="prdKdMod" style="width: 140px" class="filter-item" :disabled="disabled">
                <el-option v-for="item in prdKdMods" :key="item.key" :label="item.label" :value="item.key"/>
            </el-select>
            <el-button v-waves class="filter-item" type="primary" @click="handleCurvePrdKdFilter" :disabled="disabled">
                应用模板
            </el-button>
            <el-button v-waves class="filter-item" type="primary" @click="toAddCurvePrdKd" :disabled="disabled" >
                添加标准期限
            </el-button>
        </div>

        <el-table :data="curvePrdKdList" border highlight-current-row style="width: 820px;">
            <el-table-column label="标准期限" width="150px">
                <template slot-scope="scope">
                    <span>{{ scope.row.standSlip }}</span>
                </template>
            </el-table-column>
            <el-table-column label="样本区间" width="290px" align="center">
                <template slot-scope="scope">
                    <span>[{{ scope.row.sampleIntervalDown }}y,{{ scope.row.sampleIntervalUp }}y)</span>
                </template>
            </el-table-column>
            <el-table-column label="操作时间" width="150px" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.operateTs == null ? '' : $moment(scope.row.operateTs).format('YYYY-MM-DD hh:mm') }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="230px" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button type="text" size="big" @click="handleEdit(scope.$index, curvePrdKdList)" :disabled="disabled">修改</el-button>
                    <el-button type="text" size="big" @click="handleDelete(scope.$index, curvePrdKdList)" :disabled="disabled">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog title="添加关键期限" :visible.sync="curvePrdKdFormVisible">
            <el-form ref="curvePrdKdForm" :rules="rules" :model="temp" label-position="left" label-width="120px"
                     style="width: 400px; margin-left:50px;">
                <el-select v-model="curvePrdKdForm.standSlip" filterable placeholder="请选择关键期限">
                    <el-option
                            v-for="item in optioins(this, 'STAND_SLIP')"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                    />
                </el-select>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="curvePrdKdFormVisible = false">
                    取消
                </el-button>
                <el-button type="primary" @click="addCurvePrdKd('curvePrdKdForm')">
                    确认
                </el-button>
            </div>
        </el-dialog>

        <el-dialog title="修改编制关键期限" :visible.sync="dialogFormVisible">
            <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="120px">
                <el-row>
                    <el-col :span="10">
                        <el-form-item label="单位">
                            <el-select v-model="unit">
                                <el-option value="d">d</el-option>
                                <el-option value="m">m</el-option>
                                <el-option value="y">y</el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="10">
                        <el-form-item label="样本区间下限" prop="sampleIntervalDown">
                            <el-input v-model="sampleIntervalDown"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10" :offset="2">
                        <el-form-item type="number" label="样本区间上限" prop="sampleIntervalUp">
                            <el-input type="number" v-model="sampleIntervalUp"/>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">
                    取消
                </el-button>
                <el-button type="primary" @click="storageCurvePrdKd('dataForm')">
                    确认
                </el-button>
            </div>
        </el-dialog>


        <!-- 远期N/K值 -->
        <div class="filter-container" style="padding-top: 40px">
            <label>远期N/K值： </label>
            <el-select v-model="forwardFlagMod" style="width: 140px" class="filter-item" :disabled="disabled">
                <el-option v-for="item in forwardFlagMods" :key="item.key" :label="item.label" :value="item.key"/>
            </el-select>
            <el-button v-waves class="filter-item" type="primary" @click="handleCurvePrdNkFilter" :disabled="disabled">
                应用模板
            </el-button>
            <el-button v-waves class="filter-item" type="primary" @click="toAddCurvePrdNk" :disabled="disabled" >
                添加远期N/K
            </el-button>
        </div>

        <el-table :data="curvePrdNkList" border highlight-current-row style="width: 820px;">
            <el-table-column label="N值" width="150px">
                <template slot-scope="scope">
                    <span>{{ scope.row.nvalue }}</span>
                </template>
            </el-table-column>
            <el-table-column label="K值" width="150px" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.kvalue }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作时间" width="150px" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.operateTs == null ? '' : $moment(scope.row.operateTs).format('YYYY-MM-DD hh:mm') }}</span>
                </template>
            </el-table-column>
            <el-table-column label="备注" width="270px" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.remark}}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="100px" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button type="text" size="big" @click="handleEditNK(scope.$index, curvePrdNkList)" :disabled="disabled">修改</el-button>
                    <el-button type="text" size="big" @click="handleDelete(scope.$index, curvePrdNkList)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog title="远期NK" v-if="curvePrdNkFormVisible" :visible.sync="curvePrdNkFormVisible">
            <el-col :span="20" :offset="2">
                <el-form ref="curvePrdNkForm" :model="curvePrdNkFormTmp" :rules="curvePrdNkRules" label-position="left" label-width="60px">
                    <el-row>
                        <el-col :span="11">
                            <el-form-item label="N值" prop="nvalue" >
                                <el-input type="number" v-model="curvePrdNkFormTmp.nvalue" :disabled="disabled" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="11" :offset="2" prop="kvalue" >
                            <el-form-item label="K值">
                                <el-input type="number" v-model="curvePrdNkFormTmp.kvalue" :disabled="disabled" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item label="备注" prop="remark" >
                        <el-input type="textarea" v-model="curvePrdNkFormTmp.remark"></el-input>
                    </el-form-item>
                </el-form>
            </el-col>
            <div slot="footer" class="dialog-footer">
                <el-button @click="curvePrdNkFormVisible = false">
                    取消
                </el-button>
                <el-button type="primary" @click="addCurvePrdNk('curvePrdNkForm')">
                    确认
                </el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
  import waves from '@/directive/waves' // waves directive
  import { optioins } from '@/api/curve/code-type.js'
  import {parseTime} from '@/utils'
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination

  import {queryCurvePrdKd, delCurveProduct,queryCurvePrdNk, prdKdModsList, forwardFlagModsList, getPrdKdListByModId, getCurvePrdNkListByModId} from '@/api/curve/curve-product-list.js'

  export default {
    name: 'CurvePrdKd',
    components: {Pagination},
    directives: {waves},
    props: ['productId','disabled'],
    data() {
      var comparison = (rule, value, callback) => {
        value = this.sampleIntervalDown
        if (value >= this.sampleIntervalUp) {
          callback(new Error('样本区间下限必须小于于样本区间上限!'));
        } else {
          callback();
        }
      };
      return {
        unit: 'y',
        tableKey: 0,
        curvePrdKdList: [],
        curvePrdNkList: [],
        listLoading: true,
        prdKdMod:null,
        forwardFlagMod:null,
        sampleIntervalDown: null,
        sampleIntervalUp: null,
        temp: {
          id: undefined,
          sampleIntervalUp: '',
          sampleIntervalDown: '',
          operateTs:''
        },
        dialogFormVisible: false,
        rules: {
          sampleIntervalUp: [
            {required: true, message: '样本区间上限不可为空值', trigger: 'change'},
            { type: 'number', message: '样本区间上限必须为数字值'}
          ],
          sampleIntervalDown: [
            {required: true, message: '样本区间下限不可为空值', trigger: 'change'},
            { type: 'number', message: '样本区间下限必须为数字值'},
            { validator: comparison, trigger: 'blur' }
          ]
        },
        // 新增关键期限
        curvePrdKdFormVisible: false,
        curvePrdKdForm: {},
        // 新增远期NK
        curvePrdNkFormVisible: false,
        curvePrdNkForm: {},
        curvePrdNkForm_index: null, //索引，用于编辑时获取行
        curvePrdNkRules: {
          nvalue: [
            {required: true, message: 'N值不可为空', trigger: 'change'}
          ],
          kvalue: [
            {required: true, message: 'K值不可为空', trigger: 'change'}
          ],
          remark: [
            { min: 0, max: 200, message: '长度在 1 到 200 个字符', trigger: 'blur' }
          ]
        },
        curvePrdNkFormTmp: {
          nvalue: null,
          kvalue: null,
          remark: ''
        }
      }
    },
    computed:{
      prdKdMods() {
        return prdKdModsList()
      },
      forwardFlagMods() {
        return forwardFlagModsList()
      }
    },
    beforeMount() {
      console.info('beforeMount.加载数据')
      this.getCurvePrdKdList();
      this.getCurvePrdNkList();
    },
    methods: {
      optioins: optioins,
      getCurvePrdKdList(){
        console.info('methods.getCurvePrdKdList')
        var curveId = this.productId;
        queryCurvePrdKd({curveId:curveId}).then(response => {
          console.info('====queryCurvePrdKd:')
          if (response && response.dataList) {
            this.curvePrdKdList = response.dataList
          }
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
        })
      },
      getCurvePrdNkList(){
        console.info('methods.getCurvePrdNkList')
        var curveId = this.productId;
        queryCurvePrdNk({curveId:curveId}).then(response => {
          if (response && response.dataList) {
            this.curvePrdNkList = response.dataList
          }
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
        })
      },
      // 应用关键期限模板
      handleCurvePrdKdFilter() {
        var prdKdMod = this.prdKdMod
        if (!prdKdMod) {
          this.$message({
            type: 'error',
            message: '请选择一个模板'
          })
          return false
        }
        this.curvePrdKdList = getPrdKdListByModId(prdKdMod)
      },
      // 应用远期NK值模板
      handleCurvePrdNkFilter() {
        var forwardFlagMod = this.forwardFlagMod
        if (!forwardFlagMod) {
          this.$message({
            type: 'error',
            message: '请选择一个模板'
          })
          return false
        }
        this.curvePrdNkList = getCurvePrdNkListByModId(forwardFlagMod)
      },
      handleEdit(index, rows) {
        // copy obj
        this.temp = rows[index];
        // 将上下限转换成为数字
        this.temp.sampleIntervalUp = Number(this.temp.sampleIntervalUp);
        this.temp.sampleIntervalDown = Number(this.temp.sampleIntervalDown);

        this.sampleIntervalDown = Number(this.temp.sampleIntervalDown);
        this.sampleIntervalUp = Number(this.temp.sampleIntervalUp);
        // 强制单位为y
        this.unit = 'y'
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      handleDelete(index, rows) {
        rows.splice(index, 1);
      },
      // NK编辑
      handleEditNK(index, rows) {
        console.info('handleEditNK。编辑NK:' + index)
        var item = rows[index]
        this.curvePrdNkForm = item
        this.curvePrdNkForm_index = index
        this.curvePrdNkFormTmp.nvalue = Number(item.nvalue)
        this.curvePrdNkFormTmp.kvalue = Number(item.kvalue)
        this.curvePrdNkFormTmp.remark = item.remark

        this.curvePrdNkFormVisible = true
        this.$nextTick(() => {
          this.$refs['curvePrdNkForm'].clearValidate()
        })
      },
      storageCurvePrdKd(formName){
        // 按单位转换数值
        var sampleIntervalDown = this.sampleIntervalDown
        var sampleIntervalUp = this.sampleIntervalUp

        if ('m' == this.unit) {
          sampleIntervalDown = sampleIntervalDown / 12
          sampleIntervalUp = sampleIntervalUp / 12
        } else if ('d' == this.unit) {
          sampleIntervalDown = sampleIntervalDown / 365
          sampleIntervalUp = sampleIntervalUp / 365
        } else {
          sampleIntervalDown = sampleIntervalDown / 1
          sampleIntervalUp = sampleIntervalUp / 1
        }
        sampleIntervalDown = sampleIntervalDown.toFixed(2)
        sampleIntervalUp = sampleIntervalUp.toFixed(2)
        // 转换为数值
        sampleIntervalDown = sampleIntervalDown / 1
        sampleIntervalUp = sampleIntervalUp / 1

        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.temp.operateTs=new Date();
            this.temp.sampleIntervalUp = sampleIntervalUp
            this.temp.sampleIntervalDown = sampleIntervalDown
            this.dialogFormVisible = false;
          }
        });
      },
      obtainCurvePrdKdList(){
        for(var i = 0 ;i<this.curvePrdKdList.length;i++){
          this.curvePrdKdList[i].curveId=this.productId
        }
        return this.curvePrdKdList;
      },
      obtainCurvePrdNkList(){
        for(var i = 0 ;i<this.curvePrdNkList.length;i++){
          this.curvePrdNkList[i].curveId=this.productId
        }
        return this.curvePrdNkList;
      },
      // 打开新增关键期限dialog
      toAddCurvePrdKd() {
        this.curvePrdKdFormVisible = true
      },
      // 添加关键期限
      addCurvePrdKd() {
        console.info('curve-prd-kd.vue.addCurvePrdKd')
        var standSlip = this.curvePrdKdForm.standSlip
        if (!standSlip) {
          this.$message({
            type: 'error',
            message: '仅能选择一条期限'
          })
          return false
        }
        // 判断列表中是否已经存在期限
        for (let i = 0; i < this.curvePrdKdList.length; i++) {
          var item = this.curvePrdKdList[i]
          if (standSlip == item.standSlip) {
            this.$message({
              type: 'error',
              message: '该期限已经存在'
            })
            return false
          }
        }

        // 添加数据
        if (!this.curvePrdKdList || this.curvePrdKdList.length == 0) {
          this.curvePrdKdList = []
          this.curvePrdKdList.push({
            standSlip: standSlip,
            sampleIntervalDown: 0,
            sampleIntervalUp: 1,
            operateTs: new Date()
          })
        } else {
          var isdown = false
          for (let i = 0; i < this.curvePrdKdList.length; i++) {
            var item = this.curvePrdKdList[i]
            if (standSlip < item.standSlip) {
              this.curvePrdKdList.splice(i,0,{
                standSlip: standSlip,
                sampleIntervalDown: 0,
                sampleIntervalUp: 1,
                operateTs: new Date()
              })
              isdown = true
              break
            }
          }
          if (!isdown) {
            // 如果for循环没有执行插入，则最后插入
            this.curvePrdKdList.push({
              standSlip: standSlip,
              sampleIntervalDown: 0,
              sampleIntervalUp: 1,
              operateTs: new Date()
            })
          }
        }

        this.curvePrdKdFormVisible = false
      },
      // 打开添加远期NK页面
      toAddCurvePrdNk() {
        this.curvePrdNkFormVisible = true

        this.curvePrdNkForm = {}
        this.curvePrdNkForm_index = null

        this.curvePrdNkFormTmp.nvalue = null
        this.curvePrdNkFormTmp.kvalue = null
        this.curvePrdNkFormTmp.remark = ''
      },
      // 添加远期NK
      addCurvePrdNk(formName) {
        console.info('curve-prd-kd.vue.addCurvePrdNk')
        // 验证表单
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // 验证N、K值，必须有一个为0
            if (0 != this.curvePrdNkFormTmp.nvalue && 0 != this.curvePrdNkFormTmp.kvalue) {
              this.$message({
                type: 'error',
                message: 'NK值必须有一个为0'
              })
              return false
            }
            var index = this.curvePrdNkForm_index
            if (index || index === 0) {
              this.curvePrdNkForm.nvalue = this.curvePrdNkFormTmp.nvalue
              this.curvePrdNkForm.kvalue = this.curvePrdNkFormTmp.kvalue
              this.curvePrdNkForm.remark = this.curvePrdNkFormTmp.remark
              this.curvePrdNkForm.operateTs = new Date()
            } else {
              // 添加
              this.curvePrdNkList.push(
                  {
                    nvalue: this.curvePrdNkFormTmp.nvalue,
                    kvalue: this.curvePrdNkFormTmp.kvalue,
                    remark: this.curvePrdNkFormTmp.remark,
                    operateTs: new Date()
                  }
              )
            }
            this.curvePrdNkFormVisible = false
          } else {
            console.log('error add!!')
            return false
          }
        })
      }
    }
  }
</script>
