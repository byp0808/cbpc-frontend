<template>
    <!-- 编制关键期限 -->
    <div class="app-container">
        <div class="filter-container">
            <label>编制关键期限： </label>
            <el-select v-model="prdKdMod" style="width: 140px" class="filter-item">
                <el-option v-for="item in prdKdMods" :key="item.key" :label="item.label" :value="item.key"/>
            </el-select>
            <el-button v-waves class="filter-item" type="primary" @click="handleCurvePrdKdFilter">
                应用模板
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
                    <span>[{{ scope.row.sampleIntervalUp }},{{ scope.row.sampleIntervalDown }})</span>
                </template>
            </el-table-column>
            <el-table-column label="操作时间" width="150px" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.operateTs | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="230px" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button type="text" size="big" @click="handleEdit(scope.$index, curvePrdKdList)">修改</el-button>
                    <el-button type="text" size="big" @click="handleDelete(scope.$index, curvePrdKdList)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog title="修改编制关键期限" :visible.sync="dialogFormVisible">
            <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="120px"
                     style="width: 400px; margin-left:50px;">
                <el-form-item label="样本区间上限" prop="sampleIntervalUp">
                    <el-input v-model.number="temp.sampleIntervalUp"/>
                </el-form-item>
              <el-form-item label="样本区间下限" prop="sampleIntervalDown">
                <el-input v-model.number="temp.sampleIntervalDown"/>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">
                    Cancel
                </el-button>
                <el-button type="primary" @click="storageCurvePrdKd('dataForm')">
                    Confirm
                </el-button>
            </div>
        </el-dialog>


        <!-- 远期N/K值 -->
        <div class="filter-container" style="padding-top: 40px">
            <label>远期N/K值： </label>
            <el-select v-model="forwardFlagMod" style="width: 140px" class="filter-item">
                <el-option v-for="item in forwardFlagMods" :key="item.key" :label="item.label" :value="item.key"/>
            </el-select>
            <el-button v-waves class="filter-item" type="primary" @click="handleCurvePrdNkFilter">
                应用模板
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
                    <span>{{ scope.row.operateTs | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
                </template>
            </el-table-column>
            <el-table-column label="备注" width="270px" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.remark}}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="100px" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button type="text" size="big" @click="handleDelete(scope.$index, curvePrdNkList)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
  import waves from '@/directive/waves' // waves directive
  import {parseTime} from '@/utils'
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination

  import {queryCurvePrdKd, delCurveProduct,queryCurvePrdNk} from '@/api/curve/curve-product-list.js'

  export default {
    name: 'CurvePrdKdTable',
    components: {Pagination},
    directives: {waves},
    props: ['productId'],
    data() {
      var comparison = (rule, value, callback) => {
        if (value <= this.temp.sampleIntervalUp) {
          callback(new Error('样本区间下限大于样本区间上限!'));
        } else {
          callback();
        }
      };
      return {
        tableKey: 0,
        curvePrdKdList: null,
        curvePrdNkList: null,
        listLoading: true,
        prdKdMod:null,
        forwardFlagMod:null,
        prdKdMods: [
          {label:'模板一',key:'0001'},
          {label:'模板二',key:'0002'},
          {label:'模板三',key:'0003'},
          {label:'模板四',key:'0004'},
        ],
        forwardFlagMods: [
          {label:'模板一',key:'0001'},
          {label:'模板二',key:'0002'},
          {label:'模板三',key:'0003'},
          {label:'模板四',key:'0004'},
        ],
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
        }
      }

    },
    created() {
      this.getCurvePrdKdList();
      this.getCurvePrdNkList();
    },
    methods: {
      getCurvePrdKdList(){
        var curveId = this.productId;
        queryCurvePrdKd({curveId:curveId}).then(response => {
          this.curvePrdKdList = response.dataList
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
        })
      },
      getCurvePrdNkList(){
        var curveId = this.productId;
        queryCurvePrdNk({curveId:curveId}).then(response => {
          this.curvePrdNkList = response.dataList
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
        })
      },
      handleCurvePrdKdFilter() {
          this.curvePrdKdList = [
            {standSlip:'1d', sampleIntervalUp:'', sampleIntervalDown:'', operateTs:''},
            {standSlip:'2d', sampleIntervalUp:'', sampleIntervalDown:'', operateTs:''},
            {standSlip:'1M', sampleIntervalUp:'', sampleIntervalDown:'', operateTs:''},
            {standSlip:'1Y', sampleIntervalUp:'', sampleIntervalDown:'', operateTs:''}
          ]
      },
      handleCurvePrdNkFilter() {

      },
      handleEdit(index, rows) {
        // copy obj
        this.temp = rows[index];
        // 将上下限转换成为数字
        this.temp.sampleIntervalUp = Number(this.temp.sampleIntervalUp);
        this.temp.sampleIntervalDown = Number(this.temp.sampleIntervalDown);
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      handleDelete(index, rows) {
        rows.splice(index, 1);
      },
      storageCurvePrdKd(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.temp.operateTs=new Date();
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
      }
    }
  }
</script>
