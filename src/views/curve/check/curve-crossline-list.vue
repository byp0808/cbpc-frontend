<template>
  <div class="app-container">
    <el-table
      ref="multipleTable"
      :data="curveCrossLineList.dataList"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column prop="postCode" label="邮政编码" width="140" show-overflow-tooltip />
      <el-table-column prop="postCode" label="曲线名称" width="140" show-overflow-tooltip />
      <el-table-column v-for="(item,index) in titleProperties" :key="item" :prop="item" :label="titleDes[index]" width="140">
        <template slot-scope="scope">
          <span :class="getTextClass(scope.row[item])">{{ scope.row[item] }}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="curveCrossLineList.page.pageNumber"
      :page-sizes="[10, 20, 30, 40, 50]"
      :page-size="curveCrossLineList.page.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="curveCrossLineList.page.totalRecord"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>

// import { optioins } from '@/api/curve/code-type.js'
import { queryCurveCrossLineList, queryCurveCrossLineTitle } from '@/api/curve/curve-crossline-list.js'

export default {
  name: 'CurveList', // 曲线样本券列表
  components: {

  },
  filters: {
    // showCodeLabel: showCodeLabel
  },
  data() {
    return {
      postCode: '',
      curveCrossLineTitle: [],
      titleProperties: [],
      titleDes: [],
      curveCrossLineList: {
        dataList: [],
        page: {
          pageNumber: 1,
          pageSize: 10
        }
      },
      lockScroll: true,
      multipleSelection: '' // 选择记录
    }
  },
  computed: {
    buildMethodList() { // 编制方法初始化
      // var buildMethod = [{ value: 'abc', label: 'hahaha' }]
      // options();
      return ''
    },
    operManList() { // 操作人初始化
      // var operMan = [{ value: 'abc', label: 'abc' }]
      return ''
    }
  },
  beforeMount() {
    this.queryCurveCrossLineList()
    this.queryCurveCrossLineTitle()
  },
  methods: {
    handleSizeChange(pageSize) {
      this.curveCrossLineList.page.pageSize = pageSize
      this.queryCurveCrossLineList()
    },
    handleCurrentChange(currentPage) {
      this.curveCrossLineList.page.pageNumber = currentPage
      this.queryCurveCrossLineList()
    },
    handleSelectionChange(items) {
      console.info('handleSelectionChange' + JSON.stringify(items))
      this.multipleSelection = items
    },
    getTextClass(value) {
      if (value > 0) {
        return 'red'
      }
    },
    queryCurveCrossLineList() {
      queryCurveCrossLineList({ page: this.curveCrossLineList.page }).then(response => {
        console.info('queryCurveCrossLineList.queryCurveCrossLineList...')

        // const { dataList, page } = response
        this.curveCrossLineList.dataList = [{ 'a': 1, 'b': 0, 'd': 3 }, { 'a': 0, 'b': 0, 'd': 1 }]
        /* console.log(this.curveCrossLineList.dataList[0])
        if (this.curveCrossLineList.dataList && this.curveCrossLineList.dataList.length > 0) {
          this.titleProperties = Object.keys(this.curveCrossLineList.dataList[0])
        }
        console.log('this.title:' + this.titleProperties)*/
        // this.curveCrossLineList.dataList = dataList
        // this.curveCrossLineList.page = page
      })
    },
    queryCurveCrossLineTitle() { // 查询title
      queryCurveCrossLineTitle().then(response => {
        console.info('queryCurveCrossLineTitle.queryCurveCrossLineTitle...')
      })
      this.curveCrossLineTitle = [{ 'a': 'title1', 'b': 'title2', 'd': 'title4' }]
      const titles = this.curveCrossLineTitle[0]

      if (titles) {
        for (const key in titles) {
          this.titleProperties.push(key)
          this.titleDes.push(titles[key])
        }
        // this.titleProperties = Object.keys(titles)
      }
    }
  }
}
</script>

<style scoped>

</style>
