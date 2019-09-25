<template>
    <div class="app-container">
        <div class="filter-container">
            <el-button class="filter-item" style="margin-left: 10px;" type="primary" @click="curveHomologyCreate">
                新增规则
            </el-button>
        </div>


        <el-table :data="curveHomologyDtoList" tooltip-effect="dark" style="width: 100%">
            <el-table-column label="曲线名称" width="400px">
                <template slot-scope="scope">
                    <span>{{ scope.row.productName }}</span>
                </template>
            </el-table-column>
            <el-table-column label="同调曲线" width="290px" align="center">
                <template slot-scope="scope">
                    <span class="link-type" @click="curveHomologyDtoEdit(scope.$index, curveHomologyDtoList)">详情</span>
                </template>
            </el-table-column>
            <el-table-column label="复核状态" width="150px" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.approveStatus }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="230px" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button type="text" size="big" @click="curveHomologyDtoEdit(scope.$index, curveHomologyDtoList)">
                        修改
                    </el-button>
                    <el-button type="text" size="big" @click="curveHomologyDtoDel(scope.$index, curveHomologyDtoList)">
                        删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
          :current-page="page.pageNumber"
          :page-sizes="[10, 20, 30, 40, 50]"
          :page-size="page.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="page.totalRecord"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
        <el-dialog :visible.sync="dialogFormVisible" width="50%">
            <Homology
                    ref="homology"
                    :temp="temp"
            />
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">
                    取消
                </el-button>
                <el-button type="primary" @click="storageCurveHomology()">
                    确定
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
  import {
    querycurveHomologyDto,
    storageHomology,
    delcurveHomologyDto
  } from '@/api/curve/curve-product-list.js'
  import Homology from '@/views/curve/set/homology.vue'

  export default {
    name: "CurvecurveHomology",
    components: {
      Homology
    },
    data() {
      return {
        curveHomologyDtoList: [],
        temp: {
          curveId: '',
          approveStatus: '',
          lastUpdBy: '',
          lastUpdTs: ''
        },
        dialogFormVisible: false,
        page: {
          pageNumber: 1,
          pageSize: 10
        }
      }
    },
    created() {
      this.getCurveHomologyDtoList();
    },
    methods: {
      // 查询dto列表
      getCurveHomologyDtoList() {
        querycurveHomologyDto({ page: this.page }).then(response => {
          this.curveHomologyDtoList = response.dataList
          setTimeout(1.5 * 1000)
        })
      },

      // 新建规则
      curveHomologyCreate() {
        this.temp = []
        this.dialogFormVisible = true
      },
      // dto列表修改操作
      curveHomologyDtoEdit(index, rows) {
        this.temp = rows[index];
        this.dialogFormVisible = true;
      },
      // dto列表删除
      curveHomologyDtoDel(index, rows) {
        delcurveHomologyDto(rows[index]).then(response => {
          rows.splice(index, 1);
          this.$message({
            message: '操作成功！',
            type: 'success',
            showClose: true
          })
        })
      },
      storageCurveHomology() {
        debugger
        var data = this.$refs.homology.obtainCurveHomology()
        if (!data.curveHomologyList) {
          alert("请选择同调曲线！")
          return
        }
        storageHomology(data).then(response => {
          this.curveHomologyDtoList.unshift(this.temp)
          this.dialogFormVisible = false
          this.$message({
            message: '操作成功！',
            type: 'success',
            showClose: true
          })
        })
      },
      handleSizeChange(pageSize) {
        this.page.pageSize = pageSize
        this.getCurveHomologyDtoList()
      },
      handleCurrentChange(currentPage) {
        this.page.pageNumber = currentPage
        this.getCurveHomologyDtoList()
      }
    }
  }
</script>

<style scoped>

</style>
