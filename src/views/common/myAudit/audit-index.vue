<template>
  <div class="app-container">
    <el-tabs v-model="activeName" type="card" @tab-click="tabClick">
      <el-tab-pane v-if="routerName === 'auditApprove' || routerName === 'auditAll'" label="我的审核" name="01" />
      <el-tab-pane v-if="routerName === 'auditReview'" label="我的复核" name="01" />
      <el-tab-pane v-if="routerName === 'auditAll'" label="我的复核" name="02" />
    </el-tabs>
    <transition name="el-fade-in-linear">
      <div>
        <audit-form :active-name="activeName" />
      </div>
    </transition>
  </div>
</template>

<script>
import AuditForm from '@/views/common/myAudit/audit-form.vue'
export default {
  name: 'AuditTab',
  components: { AuditForm },
  data() {
    return {
      activeName: '01',
      routerName: ''
    }
  },
  created() {
    this.routerName = this.$route.name
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
