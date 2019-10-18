<template>
  <div class="app-container">
    <el-tabs v-model="activeName" type="card" @tab-click="tabClick">
      <el-tab-pane label="我的审核" name="01" />
      <el-tab-pane label="我的复核" name="02" />
    </el-tabs>
    <transition name="el-fade-in-linear">
      <div v-if="activeName === '01' || activeName === '02'">
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
