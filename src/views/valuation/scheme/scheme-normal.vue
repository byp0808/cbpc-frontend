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
    <el-row>
      <el-col :span="8">
        <h3>目标信用点差调整</h3>
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
      <el-col :span="8">
        <el-form-item label="相对点差">
          <el-input-number v-model="num1" :min="1" :max="10" @change="handleChange" />%
        </el-form-item>
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
      <el-col :span="8">
        <h3>其他点差</h3>
        <el-form-item label="目标流动性点差">
          <el-input-number v-model="num1" :min="1" :max="10" @change="handleChange" />
        </el-form-item>
        <el-form-item label="目标其他点差">
          <el-input-number v-model="num1" :min="1" :max="10" @change="handleChange" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
      </el-col>
      <el-col :span="12">
      </el-col>
    </el-row>
    <el-upload
      class="upload-demo"
      action="https://jsonplaceholder.typicode.com/posts/"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :before-remove="beforeRemove"
      multiple
      :limit="3"
      :on-exceed="handleExceed"
      :file-list="fileList">
      <el-button size="small" type="primary">上传估值判断依据</el-button>
      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
    </el-upload>
    <el-form-item label="含权推荐方向">
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
</template>

<script>
export default {
  name: 'ValuationSchemeNormal'
}
</script>

<style scoped>

</style>
