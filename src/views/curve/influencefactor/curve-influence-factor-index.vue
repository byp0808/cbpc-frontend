<template>
  <div class="app-container">
    <el-tabs tab-position="left" @tab-click="handleClick">
      <el-tab-pane label="Shibor">
        <el-card class="box-card">
          <div slot="header" class="clearfix card-head">
            <h3>银行间拆借利率</h3>
          </div>
          <CurveInfluenceFactorShibor />
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="Libor">
        <el-card class="box-card ">
          <div slot="header" class="clearfix card-head">
            <h3>Libor</h3>
          </div>
          <CurveInfluenceFactorLibor />
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="美国国债收益率曲线">
        <el-card class="box-card ">
          <div slot="header" class="clearfix card-head">
            <h3>美国国债收益率曲线</h3>
          </div>
          <CurveInfluenceFactorUsa />
        </el-card>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import CurveInfluenceFactorShibor from '@/views/curve/influencefactor/curve-influence-factor-shibor.vue'
import CurveInfluenceFactorLibor from '@/views/curve/influencefactor/curve-influence-factor-libor.vue'
import CurveInfluenceFactorUsa from '@/views/curve/influencefactor/curve-influence-factor-usa.vue'
export default {
  name: 'CurveOrderCheckIndex',
  components: {
    CurveInfluenceFactorShibor,
    CurveInfluenceFactorLibor,
    CurveInfluenceFactorUsa
  },
  props: {
    orderId: {
      type: String,
      default: ''
    },
    taskDay: {
      type: Date,
      default: () => (new Date())
    }
  },
  data() {
    return {

    }
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    }
  }
}
</script>

<style>
</style>
