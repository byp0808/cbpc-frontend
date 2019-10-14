<template>
  <div class="app-container">
    <el-tabs v-model="activeName" type="card" @tab-click="tabClick">
      <el-tab-pane label="我的审核" name="01">
        <audit-form :active-name="activeName" />
      </el-tab-pane>
      <el-tab-pane label="我的复核" name="02">
        <audit-form :active-name="activeName" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import AuditForm from '@/views/common/myAudit/audit-form.vue'
export default {
  name: 'AuditTab',
  components: { AuditForm },
  data() {
    return {
      activeName: '01'
    }
  },
  methods: {
    tabClick(e) {
      this.activeName = e.name
    }
  }
}
</script>

<style scoped>

</style>
