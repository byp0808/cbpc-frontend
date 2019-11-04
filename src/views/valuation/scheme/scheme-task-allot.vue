<template>
  <div class="app-container">
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane v-if="routerName === 'SchemeTaskAllotList'" label="所有人" name="01">
        <all-list />
      </el-tab-pane>

      <el-tab-pane v-if="routerName === 'SchemeMyTaskAllotList'" label="我的任务" name="01">
        <my-list />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import AllList from '@/views/valuation/scheme/scheme-all-list.vue'
import MyList from '@/views/valuation/scheme/scheme-my-list.vue'
export default {
  name: 'ValuationTaskList',
  components: {
    AllList,
    MyList
  },
  data() {
    return {
      activeName: '01',
      bondId: '',
      valuationAllTask: [],
      valuationMyTask: [],
      routerName: '',
      myList: [],
      params: {
        page: {
          pageNumber: 1,
          pageSize: 10,
          totalRecord: 0
        },
        tab: '01',
        scene: '01'
      }
    }
  },
  created() {
    console.log('11', this.$route.name)
    this.routerName = this.$route.name
  },
  methods: {
  }
}
</script>
