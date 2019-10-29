<template>
  <div class="app-container">
    <el-tabs v-model="activeName" type="card" @tab-click="tabClick">
      <el-tab-pane label="估值方案" name="01" />
      <el-tab-pane label="历史估值方案" name="02" />
    </el-tabs>
    <transition name="el-fade-in-linear">
      <div v-if="activeName === '01'" :adjust-data="adjustData">
        <scheme-normal />
      </div>
    </transition>
    <transition name="el-fade-in-linear">
      <div v-if="activeName === '02'">
        <scheme-history />
      </div>
    </transition>
  </div>
</template>

<script>
import SchemeNormal from '@/views/valuation/scheme/scheme-form.vue'
import SchemeHistory from '@/views/valuation/scheme/scheme-history.vue'
export default {
  name: 'SchemeMethod',
  components: { SchemeNormal, SchemeHistory },
  props: {
    adjustData: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      activeName: '01'
    }
  },
  created() {
    // console.log('112', this.adjustData)
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
