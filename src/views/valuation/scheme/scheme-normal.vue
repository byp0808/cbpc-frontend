<template>
  <div>
    <el-row>
      <el-col :span="12">
        <div class="grid-content">
          <el-form-item label="目标估值曲线">
            <el-select v-model="value" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="grid-content bg-purple-dark">
          <el-form-item label="市场隐含评级">
            <el-select v-model="value" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </div>
      </el-col>
    </el-row>
    <h3>目标信用点差调整</h3>
    <el-row>
      <el-col :span="12">
        <el-form-item label="调整方式">
          <el-select v-model="value" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="调整值">
          <el-input-number v-model="num1" :min="1" :max="10" @change="handleChange" />
        </el-form-item>
        <el-form-item label="初始点差">
          <el-input-number v-model="num1" :min="1" :max="10" @change="handleChange" />
        </el-form-item>
        <el-form-item label="最终点差">
          <el-input-number v-model="num1" :min="1" :max="10" @change="handleChange" />
        </el-form-item>
        <el-form-item label="调整幅度">
          <el-input-number v-model="num1" :min="1" :max="10" @change="handleChange" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item label="相对点差">
          <el-input-number v-model="num1" :min="1" :max="10" @change="handleChange" />%
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-button type="primary">选择市场价格</el-button>
        <el-form-item label="全价">
          <el-input v-model="input" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="净价">
          <el-input v-model="input" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="收益率">
          <el-input v-model="input" placeholder="请输入内容" />
        </el-form-item>
      </el-col>
    </el-row>
    <h3>目标流动性点差</h3>
  </div>
</template>

<script>
export default {
  name: 'ValuationSchemeNormal'
}
</script>

<style scoped>

</style>
