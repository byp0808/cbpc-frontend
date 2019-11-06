<template>
  <div class="pull-right">
    <el-upload
      ref="upload"
      class="upload-demo"
      action="doUpload"
      :limit="1"
      :file-list="fileList"
      :before-upload="beforeUpload"
    >
      <el-button slot="trigger" type="primary" style="margin-right: 20px">上传excel</el-button>
      <!-- <div slot="tip" class="el-upload__tip">只能上传excel文件，且不超过5MB</div>-->
      <!-- <div slot="tip" class="el-upload-list__item-name">{{fileName}}</div>-->
    </el-upload>
    <!--<span slot="footer" class="dialog-footer">-->
    <!-- <el-button @click="visible = false">取消</el-button>-->
    <!-- <el-button type="primary" @click="submitUpload()">确定</el-button>-->
    <!--</span>-->
  </div>
</template>

<script>
import { uplValQcRpt } from '@/api/valuation/val-quality.js'

export default {
  name: 'ValQcUploadForm', // 质检总览
  // props: {
  //   beforeUpload: Function, // eslint-disable-line
  //   onSuccess: Function// eslint-disable-line
  // },
  props: { 'taskDay': {}, 'orderId': {}},
  data() {
    return {
      loading: false,
      excelData: {
        header: null,
        results: null
      },
      fileList: []
    }
  },
  methods: {
    beforeUpload(file) {
      // console.log(file,'文件');
      this.files = file
      const extension = file.name.split('.')[1] === 'xls'
      const extension2 = file.name.split('.')[1] === 'xlsx'
      const isLt5M = file.size / 1024 / 1024 < 5
      if (!extension && !extension2) {
        this.$message.warning('上传模板只能是 xls、xlsx格式!')
        return
      }
      if (!isLt5M) {
        this.$message.warning('上传模板大小不能超过 5MB!')
        return
      }
      this.fileName = file.name
      setTimeout(() => {
        this.submitUpload()
      }, 500)
      return false // 返回false不会自动上传
    },

    // 上传excel
    submitUpload() {
      console.log('上传' + this.files.name)
      if (this.fileName === '') {
        this.$message.warning('请选择要上传的文件!')
        return false
      }
      const fileFormData = new FormData()
      fileFormData.append('batchId', this.orderId)
      fileFormData.append('compDate', this.taskDay)
      fileFormData.append('attach', this.files)
      // const resp = uplValQcRpt(fileFormData)

      uplValQcRpt(fileFormData).then(resp => {
        console.log(resp)
        if (resp.hasOwnProperty('data')) {
          this.$message({
            type: 'success',
            message: 'excel上传成功'
          })
        } else {
          this.$message.error('excel上传失败，请重新上传')
        }
      }).catch((e) => {
        console.log(e)
        this.$message.error('excel上传失败，请重新上传')
      }).finally(() => {

      })
    }
  }
}
</script>

<style scoped>
  .excel-upload-input{
    display: none;
    z-index: -9999;
  }
  .drop{
    border: 2px dashed #bbb;
    width: 600px;
    height: 160px;
    line-height: 160px;
    margin: 0 auto;
    font-size: 24px;
    border-radius: 5px;
    text-align: center;
    color: #bbb;
    position: relative;
  }
</style>
