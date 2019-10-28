<template>
  <div>
    <div v-if="!isWordFile" class="canvas-container">
      <canvas ref="myCanvas" class="pdf-container" />
    </div>
    <a v-if="isWordFile" class="file-link" @click="toDownload"><i class="el-icon-view el-icon--right" />{{ wordFile }}</a>
  </div>
</template>

<script>
import pdfJS from 'pdfjs-dist'
import { queryReport, previewReport } from '@/api/valuation/report.js'
import { basic_api_valuation } from '@/api/base-api'
import { downloadFile } from '@/utils/file-request.js'
export default {
  name: 'ReportForm',
  components: {
  },
  props: ['businessId'],
  data() {
    return {
      id: '',
      wordFile: '',
      isWordFile: false,
      pdfData: '', // PDF的base64
      scale: 1 // 缩放值
    }
  },
  computed: {

  },
  beforeMount() {
    if (this.businessId) {
      this.fillContent()
    }
  },
  methods: {
    fillContent() {
      queryReport(this.businessId).then(response => {
        // 如果是.pdf，则预览；如果是.doc或.docx，则只显示文件名并点击可下载
        if (response.reportName.indexOf('.pdf') > 0) {
          previewReport(this.businessId).then(res => {
            this.pdfData = atob(res)
            this.previewPDF()
          })
        } else {
          this.id = response.id
          this.wordFile = response.reportName
          this.isWordFile = true
        }
      })
    },
    toDownload() {
      downloadFile(`${process.env.VUE_APP_BASE_API}${basic_api_valuation}` + '/report/download', [this.id])
    },
    previewPDF() {
      // 引入pdf.js的字体
      const CMAP_URL = 'pdfjs-dist/cmaps/'
      // 读取base64的pdf流文件
      pdfJS.GlobalWorkerOptions.workerSrc = 'pdfjs-dist/build/pdf.worker.js'
      const loadingTask = pdfJS.getDocument({
        data: this.pdfData, // PDF base64编码
        cMapUrl: CMAP_URL,
        cMapPacked: true
      })
      loadingTask.promise.then((pdf) => {
        this.loadFinished = true
        const numPages = pdf.numPages
        const pageNumber = 1
        this.getPage(pdf, pageNumber, numPages)
      })
    },
    getPage(pdf, pageNumber, numPages) {
      const _this = this
      pdf.getPage(pageNumber)
        .then((page) => {
          // 获取DOM中为预览PDF准备好的canvasDOM对象
          const canvas = this.$refs.myCanvas
          const viewport = page.getViewport(_this.scale)
          canvas.height = viewport.height
          canvas.width = viewport.width
          const ctx = canvas.getContext('2d')
          const renderContext = {
            canvasContext: ctx,
            viewport: viewport
          }
          page.render(renderContext).then(() => {
            pageNumber += 1
            if (pageNumber <= numPages) {
              _this.getPage(pdf, pageNumber, numPages)
            }
          })
        })
    }
  }
}
</script>

<style scoped>
  .pdf-container {
    width: 100%;
  }
  .canvas-container {
    border: 1px dashed black;
    position: relative;
  }
  .file-link {
    display: inline-flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    vertical-align: middle;
    position: relative;
    text-decoration: none;
    outline: none;
    cursor: pointer;
    padding: 0;
    font-size: 14px;
    font-weight: 500;
    color: #409eff;
  }
  a.file-link:hover{
    text-decoration: underline !important;
  }
</style>
