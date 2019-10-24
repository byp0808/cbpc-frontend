<template>
  <div class="app-container">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="批量计算" name="01">
        <batch-form />
      </el-tab-pane>
      <el-tab-pane label="单资产估值" name="02">
        <single-form />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import BatchForm from '@/views/valuation/publish-bond/batch-form.vue'
import SingleForm from '@/views/valuation/publish-bond/single-form.vue'
export default {
  name: 'PublishList',
  components: {
    BatchForm,
    SingleForm
  },
  data() {
    return {
      activeName: '01'
    }
  },
  created() {
  },
  methods: {
    handleClick(e) {

    }
  }
}
</script>
