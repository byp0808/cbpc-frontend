<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-steps :active="stepActive" align-center finish-status="success" process-status="finish">
        <el-step title="基本信息" />
        <el-step title="选择范围" />
        <el-step title="选择指标" />
        <el-step title="估值方法" />
        <el-step title="批次发布指标" />
        <el-step title="确认产品" />
      </el-steps>
    </el-card>
    <el-card v-if="stepActive === 0" class="box-card margin-top">
      <div slot="header" class="clearfix card-head">
        <h3>基本信息</h3>
      </div>
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <el-form ref="ruleForm2" :model="ruleForm2" status-icon :rules="rules2" label-width="100px" class="demo-ruleForm">
              <el-form-item label="产品名称">
                <el-input v-model="ruleForm2" type="text" auto-complete="off" />
              </el-form-item>
              <el-form-item label="产品状态">
                <el-input v-model="ruleForm2" type="password" auto-complete="off" />
              </el-form-item>
              <el-form-item label="退市日">
                <el-date-picker
                  v-model="value2"
                  align="right"
                  type="date"
                  placeholder="选择日期"
                  :picker-options="pickerOptions1"
                  style="width: 100%"
                />
              </el-form-item>
            </el-form>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <el-form ref="ruleForm2" :model="ruleForm2" status-icon :rules="rules2" label-width="100px" class="demo-ruleForm">
              <el-form-item label="基础产品">
                <el-input v-model="ruleForm2" type="text" auto-complete="off" />
              </el-form-item>
              <el-form-item label="上市日">
                <el-date-picker
                  v-model="value2"
                  align="right"
                  type="date"
                  placeholder="选择日期"
                  :picker-options="pickerOptions1"
                  style="width: 100%"
                />
              </el-form-item>
              <el-form-item label="币种">
                <el-select v-model="sizeForm" placeholder="请选择活动区域" style="width: 100%">
                  <el-option label="区域一" value="shanghai" />
                  <el-option label="区域二" value="beijing" />
                </el-select>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <el-form ref="ruleForm2" :model="ruleForm2" status-icon :rules="rules2" label-width="100px" class="demo-ruleForm">
              <el-form-item label="市场">
                <el-select v-model="sizeForm" placeholder="请选择活动区域" style="width: 100%">
                  <el-option label="区域一" value="shanghai" />
                  <el-option label="区域二" value="beijing" />
                </el-select>
              </el-form-item>
              <el-form-item label="编制日历">
                <el-select v-model="sizeForm" placeholder="请选择活动区域" style="width: 100%">
                  <el-option label="区域一" value="shanghai" />
                  <el-option label="区域二" value="beijing" />
                </el-select>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
      </el-row>
      <div class="text-center">
        <el-button type="primary" @click="next">保存</el-button>
      </div>
    </el-card>
    <el-card v-if="stepActive === 1" class="box-card margin-top">
      <div slot="header" class="clearfix card-head">
        <h3>选择范围</h3>
      </div>
      <BondFilter
        ref="refBondFilter"
      />
      <div class="text-center">
        <el-button type="primary" @click="next">保存</el-button>
      </div>
    </el-card>
    <el-card v-if="stepActive === 2" class="box-card margin-top">
      <div slot="header" class="clearfix card-head">
        <h3>选择指标</h3>
      </div>
      <el-transfer
        v-model="value4"
        class="text-center"
        :props="{
          key: 'value',
          label: 'desc'
        }"
        :titles="['估值基本信息', '估值基本信息']"
        :data="data3"
      />
      <el-transfer
        v-model="value4"
        class="text-center"
        :props="{
          key: 'value',
          label: 'desc'
        }"
        :titles="['估值指标', '估值指标']"
        :data="data3"
      />
      <div class="text-center">
        <el-button type="primary" @click="next">保存</el-button>
      </div>
    </el-card>
    <el-card v-if="stepActive === 3" class="box-card margin-top">
      <div slot="header" class="clearfix card-head">
        <h3>估值方法</h3>
      </div>
      <div class="text-center">
        <el-button type="primary" @click="next">确认</el-button>
      </div>
    </el-card>
    <el-card v-if="stepActive === 4" class="box-card margin-top">
      <div slot="header" class="clearfix card-head">
        <h3>批次发布指标</h3>
      </div>
      <div class="text-center">
        <el-button type="primary" @click="next">保存</el-button>
      </div>
    </el-card>
    <el-card v-if="stepActive === 5" class="box-card margin-top">
      <div slot="header" class="clearfix card-head">
        <h3>确认产品</h3>
      </div>
      <div class="text-center">
        <el-button type="primary">确认</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import BondFilter from '@/views/common/bond-filter/filter.vue'
export default {
  name: 'ValuationProdForm',
  components: {
    BondFilter
  },
  data() {
    return {
      stepActive: 0
    }
  },
  methods: {
    next() {
      if (this.stepActive++ > 5) this.stepActive = 0
    }
  }
}
</script>

<style scoped>

</style>
