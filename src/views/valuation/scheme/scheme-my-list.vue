<template>
  <div>
    <div style="margin-bottom: 20px">
      <el-row>
        <el-col :xl="8" :lg="10">
          <!-- <el-button type="primary">方案调整</el-button> -->
          <template>
            <el-dropdown split-button type="primary" @command="batchesAdjust">
              批量调整
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="a">批量调整曲线</el-dropdown-item>
                <el-dropdown-item command="b">批量调整隐含评级</el-dropdown-item>
                <el-dropdown-item command="c">批量调整信用点差</el-dropdown-item>
                <el-dropdown-item command="d">批量调整流动性点差</el-dropdown-item>
                <el-dropdown-item command="e">批量调整其他点差</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
          <el-button v-loading="backLoading" type="primary" @click="backTask">任务退回</el-button>
          <el-button type="primary" @click="confirmMethod">方案确认</el-button>
          <el-button icon="el-icon-refresh" @click="refrech" />
        </el-col>
        <el-col :xl="16" :lg="14">
          <el-autocomplete v-model="bondId" placeholder="输入资产编码后添加任务" clearable :fetch-suggestions="querySearch" @select="handleSelectInput" />
          <el-button v-elepermission="['AddTask']" type="primary" @click="addTask">添加任务</el-button>
          <el-button v-elepermission="['BatchAddTask']" type="primary" @click="batchAddTask">批量添加</el-button>
          <el-button type="primary" @click="uploadScheme">批量上传人工估值</el-button>
          <el-button type="primary" @click="marketAdjust">盯市券点差调整</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="assset">资产列表</div>
    <!-- <el-menu :default-active="activeElement" class="el-menu-demo" mode="horizontal" @select="handleSelect" active-text-color="#5E8BD8" text-color="#333">
        <el-menu-item index="normal">正常</el-menu-item>
        <el-menu-item index="obey">违约</el-menu-item>
        <el-menu-item index="especical">特殊</el-menu-item>
        <el-menu-item index="upload">人工上传</el-menu-item>
      </el-menu> -->
    <el-tabs v-model="activeElement" @tab-click="handleSelect">
      <el-tab-pane v-for="item in tabList" :key="item.scene" :label="tabName(item.scene)" :name="item.scene" />
    </el-tabs>
    <transition name="el-fade-in-linear">
      <div v-if="activeElement === '01'" v-loading="tableLoading">
        <asset-list :all-list="myList" :is-my="isMy" @taskList="taskList" />
        <el-pagination
          style="margin-top:20px"
          align="center"
          :current-page="params.page.pageNumber"
          :page-sizes="[10, 20, 30, 40, 50]"
          :page-size="params.page.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="params.page.totalRecord"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
      <div v-if="activeElement === '02'" v-loading="tableLoading">
        <obey-list :all-list="myList" :is-my="isMy" :active-name="activeElement" @taskList="taskList" />
        <el-pagination
          style="margin-top:20px"
          align="center"
          :current-page="params.page.pageNumber"
          :page-sizes="[10, 20, 30, 40, 50]"
          :page-size="params.page.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="params.page.totalRecord"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
      <div v-if="activeElement === '03'" v-loading="tableLoading">
        <obey-list :all-list="myList" :is-my="isMy" :active-name="activeElement" @taskList="taskList" />
        <el-pagination
          style="margin-top:20px"
          align="center"
          :current-page="params.page.pageNumber"
          :page-sizes="[10, 20, 30, 40, 50]"
          :page-size="params.page.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="params.page.totalRecord"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
      <div v-if="activeElement === '04'" v-loading="tableLoading">
        <people-upload :all-list="uploadList" :is-my="isMy" @taskList="taskList" />
        <el-pagination
          style="margin-top:20px"
          align="center"
          :current-page="params.page.pageNumber"
          :page-sizes="[10, 20, 30, 40, 50]"
          :page-size="params.page.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="params.page.totalRecord"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </transition>
    <el-dialog :visible.sync="volumeAddDialog" :title="taskTitle">
      <div>
        <el-form ref="ruleForm" style="margin-left:50px" :model="volumeAdd" :rules="rules">
          <el-form-item label="选择批次" :label-width="isBatch ? '': '105px'" prop="batchId">
            <el-select v-model="volumeAdd.batchId" filterable placeholder="请选择批次">
              <el-option v-for="(item, index) in batchList" :key="index" :label="item.name" :value="item.batchId" />
            </el-select>
          </el-form-item>
          <el-form-item v-if="isBatch" label="选择文件" prop="attach">
            <el-upload
              ref="upload"
              class="upload-demo"
              action=""
              accept="application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              :limit="1"
              drag
              :on-exceed="handleExceed"
              :http-request="memSuccess"
            >
              <i class="el-icon-upload" />
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            </el-upload>
            <div class="downLoad" @click="downLoadMode">
              <a ref="moduleDownload" style="display: none" href="/model/bondTemplate.xlsx" download="估值添加债券模板" />
              模板文件下载
            </div>
          </el-form-item>
          <el-form-item label="选择调整原因" prop="cause">
            <el-select v-model="volumeAdd.cause" filterable placeholder="请选择批次">
              <el-option v-for="(name, key) in $dict('ADJUST_CAUSE')" :key="key" :label="name" :value="key" />
            </el-select>
          </el-form-item>
        </el-form>
        <el-row>
          <el-col :span="8" :offset="17">
            <div class="dialog-footer">
              <el-button @click="volumeAddDialog = false">取 消</el-button>
              <el-button type="primary" @click="saveBatch">确 定</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="uploadMethodDialog" title="人工估值上传">
      <div>
        <el-form ref="bondDom" style="margin-left:50px" :model="upLoadValution" :rules="bondRule">
          <el-form-item label="选择批次" prop="batchId">
            <el-select v-model="upLoadValution.batchId" filterable placeholder="请选择批次">
              <el-option v-for="(item, index) in batchList" :key="index" :label="item.name" :value="item.batchId" />
            </el-select>
          </el-form-item>
          <el-form-item label="选择文件">
            <el-upload
              ref="upload1"
              class="upload-demo"
              action=""
              :limit="1"
              drag
              :on-exceed="handleExceed1"
              :http-request="memSuccess1"
              accept="application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            >
              <i class="el-icon-upload" />
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            </el-upload>
            <div class="downLoad" @click="downLoadPeople">
              <a ref="peopleDownload" style="display: none" href="/model/valuationResult.xlsx" download="人工估值模板" />
              模板文件下载</div>
          </el-form-item>
        </el-form>
        <el-row>
          <el-col :span="8" :offset="17">
            <div class="dialog-footer">
              <el-button @click="uploadMethodDialog = false">取 消</el-button>
              <el-button type="primary" @click="saveValuation">确 定</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
    <el-dialog title="提示" :visible.sync="remaindDialog">
      <div v-if="isBatch" class="content">{{ message }}{{ failMessage }}</div>
      <div v-else class="content">{{ message }}</div>
      <el-row style="margin-top:10px">
        <el-col :span="8" :offset="17">
          <div v-if="code === 'YBL100001001' || code === 'YBL100001002' " class="dialog-footer">
            <el-button @click="cancle">否</el-button>
            <el-button type="primary" @click="saveFirst('01')">是</el-button>
          </div>
        </el-col>
        <el-col :span="14" :offset="10">
          <div v-if="code === 'YBL100001003' " class="dialog-footer">
            <el-button @click="cancle">不迁移</el-button>
            <el-button type="primary" @click="saveFirst('01')">迁移并保留</el-button>
            <el-button type="primary" @click="saveFirst('02')">迁移不保留</el-button>
          </div>
        </el-col>
        <el-col :span="10" :offset="15">
          <div v-if="code === 'YBL100001004' " class="dialog-footer">
            <el-button @click="cancle">取消</el-button>
            <el-button v-if="isBatch" type="primary" @click="saveBatchFirst('01')">忽略并导入</el-button>
            <el-button v-else type="primary" @click="saveFirst('01')">忽略并导入</el-button>
          </div>
        </el-col>
      </el-row>
    </el-dialog>
    <el-dialog :visible.sync="marketDialog" width="450px">
      <el-row style="margin-top:50px">
        <el-col :span="8" :offset="8">
          <el-button @click="interestAdjust">利率债点差调整</el-button>
        </el-col>
      </el-row>
      <el-row style="margin-top:80px;margin-bottom:80px">
        <el-col :span="8" :offset="8">
          <el-button @click="creditAdjust">信用债点差调整</el-button>
        </el-col>
      </el-row>
    </el-dialog>
    <el-dialog :visible.sync="interestDialog" title="利率债点差调整">
      <el-table
        :data="creditList"
        style="width: 100%"
        max-height="280"
        :header-cell-style="{background:'#f6f6f6'}"
        tooltip-effect="dark"
        border
        fit
        highlight-current-row
        @selection-change="handleInterestChange"
      >
        <el-table-column label="作业线名称" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.productName }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="全选" type="selection" />
      </el-table>
      <el-form ref="interestDom" style="margin-top:20px" :rules="paramRule" :model="param">
        <el-form-item label="交易量" required>
          <!-- <el-row> -->
          <el-col :span="9">
            <el-form-item prop="minVolume">
              <el-input v-model="param.minVolume" type="number" min="0" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="2" style="padding-left:20px">至</el-col>
          <el-col :span="9">
            <el-form-item prop="maxVolume">
              <el-input v-model="param.maxVolume" type="number" min="0" clearable />
            </el-form-item>
          </el-col>
          <!-- </el-row> -->
        </el-form-item>
        <el-form-item label="参考基准线时间" prop="baseTime">
          <el-time-select
            v-model="param.baseTime"
            :picker-options="{
              start: '00:00',
              step: '00:15',
              end: '23:59'
            }"
            placeholder="请选择基准时间"
          />
        </el-form-item>
        <el-form-item label="点差补0的券">
          <!-- <el-input v-model="interestObj.addZero" style="width:50%" />
          <div class="icon-box" @click="addZero">
            <i class="el-icon-circle-plus-outline" />
          </div> -->
          <el-upload
            style="display: inline-block;"
            action=""
            name="attach"
            :http-request="uploadAddZero"
            :on-exceed="handleExceed1"
            limit="1"
            accept="application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          >
            <div class="icon-box">
              <el-button class="el-icon-circle-plus-outline" />
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <el-row>
        <el-col :span="12" :offset="11">
          <el-button type="primary" @click="countDiff">计算点差</el-button>
          <el-button type="primary" @click="lookDiff">查看点差</el-button>
          <el-button @click="interestDialog = false">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
    <el-dialog :visible.sync="creditDialog" title="信用债点差调整">
      <el-table
        :data="creditList"
        style="width: 100%"
        max-height="280"
        :header-cell-style="{background:'#f6f6f6'}"
        tooltip-effect="dark"
        border
        fit
        highlight-current-row
        @selection-change="handleSelectionChange"
      >
        <el-table-column label="作业线名称" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.productName }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="全选" type="selection" />
      </el-table>
      <el-form ref="creditDom" style="margin-top:20px" :rules="creditRule" :model="param" :label-position="labelPosition">
        <el-form-item label="交易量" required>
          <el-col :span="9">
            <el-form-item prop="minVolume">
              <el-input v-model="param.minVolume" min="0" type="number" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="2" style="padding-left:20px">至</el-col>
          <el-col :span="9">
            <el-form-item prop="maxVolume">
              <el-input v-model="param.maxVolume" type="number" min="0" clearable />
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="本日经纪成交与市场收益率偏差(BP)" label-width="260px" required>
          <el-col :span="11">
            <el-form-item prop="todayBrokerMarketOp">
              <el-select v-model="param.todayBrokerMarketOp" placeholder="请选择">
                <el-option
                  v-for="i in compare"
                  :key="i.value"
                  :label="i.label"
                  :value="i.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="1">
            <el-form-item prop="todayBrokerMarketDiff">
              <el-input v-model="param.todayBrokerMarketDiff" type="number" min="0" clearable @change="numberChange" />
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="昨日经纪成交与市场收益率偏差(BP)" label-width="260px" required>
          <el-col :span="11">
            <el-form-item prop="yesterdayBrokerMarketOp">
              <el-select v-model="param.yesterdayBrokerMarketOp" placeholder="请选择">
                <el-option
                  v-for="i in compare"
                  :key="i.value"
                  :label="i.label"
                  :value="i.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="1">
            <el-form-item prop="yesterdayBrokerMarketDiff">
              <el-input v-model="param.yesterdayBrokerMarketDiff" type="number" min="0" clearable @change="numberChange" />
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="线的调整幅度与日间单券偏差只差(BP)" label-width="260px" required>
          <el-col :span="11">
            <el-form-item prop="curveRangeBondDayOp">
              <el-select v-model="param.curveRangeBondDayOp" placeholder="请选择">
                <el-option
                  v-for="i in compare"
                  :key="i.value"
                  :label="i.label"
                  :value="i.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="1">
            <el-form-item prop="curveRangeBondDayDiff">
              <el-input v-model="param.curveRangeBondDayDiff" type="number" min="0" clearable @change="numberChange" />
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="同业存单可靠成交（报价）待偿期" label-width="260px" required>
          <el-col :span="11">
            <el-form-item prop="reliableYearOp">
              <el-select v-model="param.reliableYearOp" placeholder="请选择">
                <el-option
                  v-for="i in compare"
                  :key="i.value"
                  :label="i.label"
                  :value="i.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="1">
            <el-form-item prop="reliableYearValue">
              <el-input v-model="param.reliableYearValue" min="0" clearable @change="numberChange" />
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="同业存单成交（报价）估值偏离" label-width="260px" required>
          <el-col :span="11">
            <el-form-item prop="valuationDeviationOp">
              <el-select v-model="param.valuationDeviationOp" placeholder="请选择">
                <el-option
                  v-for="i in compare"
                  :key="i.value"
                  :label="i.label"
                  :value="i.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="1">
            <el-form-item prop="valuationDeviationValue">
              <el-input v-model="param.valuationDeviationValue" type="number" min="0" clearable @change="numberChange" />
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="同业存单成交（报价）连续阈值" label-width="260px" required>
          <el-col :span="11">
            <el-form-item prop="transactionContinuityOp">
              <el-select v-model="param.transactionContinuityOp" placeholder="请选择">
                <el-option
                  v-for="i in compare"
                  :key="i.value"
                  :label="i.label"
                  :value="i.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="1">
            <el-form-item prop="transactionContinuityValue">
              <el-input v-model="param.transactionContinuityValue" type="number" min="0" clearable @change="numberChange" />
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="同业存单发行人成交（报价）历史总分" label-width="260px" required>
          <el-col :span="11">
            <el-form-item prop="historyScoreOp">
              <el-select v-model="param.historyScoreOp" placeholder="请选择">
                <el-option
                  v-for="i in compare"
                  :key="i.value"
                  :label="i.label"
                  :value="i.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="1">
            <el-form-item prop="historyScoreSum">
              <el-input v-model="param.historyScoreSum" type="number" min="0" clearable @change="numberChange" />
            </el-form-item>
          </el-col>
        </el-form-item>
      </el-form>
      <el-row style="margin-top:20px">
        <el-col :span="23" :offset="1">
          <el-button type="primary" @click="countOpposite">计算对敲</el-button>
          <el-button type="primary" @click="lookOpposite">查看对敲</el-button>
          <el-button type="primary" @click="countcreditDiff">计算点差</el-button>
          <el-button type="primary" @click="lookcreditDiff">查看点差</el-button>
          <el-button @click="creditDialog = false">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
    <el-dialog :visible.sync="adjustDialog" :title="countTitle" width="1200px">
      <el-tabs v-model="activeName" type="card" @tab-click="tabClick">
        <el-tab-pane v-for="item in tabPaneList" :key="item.name" :label="item.label" :name="item.name" />
      </el-tabs>
      <transition name="el-fade-in-linear">
        <div>
          <adjust-form :is-look="isLook" :active-name="activeName" :is-credit="isCredit" :adjust-list="adjustList" />
        </div>
      </transition>
    </el-dialog>
    <el-dialog :visible.sync="oppositeDialog" title="对敲券人工识别" width="1000px">
      <opposite-form :is-opposite="islookOpposite" :page="param.page" />
    </el-dialog>
    <el-dialog v-loading="Dialog.a" :visible.sync="batchAdjustDialog.a" title="批量调整目标估值曲线">
      <el-form>
        <el-form-item label="目标估值曲线">
          <el-select v-model="valuationScheme.curveId" placeholder="请选择">
            <el-option
              v-for="curve in curveList"
              :key="curve.id"
              :label="curve.name"
              :value="curve.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <el-row>
        <el-col :span="8" :offset="15">
          <div class="dialog-footer">
            <el-button @click="batchAdjustDialog.a = false">取 消</el-button>
            <el-button type="primary" @click="saveTarget">确 定</el-button>
          </div>
        </el-col>
      </el-row>
    </el-dialog>
    <el-dialog v-loading="Dialog.b" :visible.sync="batchAdjustDialog.b" title="批量调整隐含评级">
      <el-form>
        <el-form-item label="市场隐含评级">
          <el-select v-model="valuationScheme.marketGrade" placeholder="请选择">
            <el-option
              v-for="(name, key) in $dict('MARKET_GRADE')"
              :key="key"
              :label="name"
              :value="key"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <el-row>
        <el-col :span="8" :offset="15">
          <div class="dialog-footer">
            <el-button @click="batchAdjustDialog.b = false">取 消</el-button>
            <el-button type="primary" @click="saveGrade">确 定</el-button>
          </div>
        </el-col>
      </el-row>
    </el-dialog>
    <el-dialog v-loading="Dialog.c" :visible.sync="batchAdjustDialog.c" title="批量调整目标信用点差" width="1000px">
      <el-form>
        <el-form-item label="目标流动性点差">
          <el-radio-group v-model="radio" style="margin-top:-40px" @change="radioChange">
            <div class="moveLeft">
              <el-radio label="1">常规调整</el-radio>
              <el-input-number v-model="valuationScheme.spreadValue" :disabled="radio!== '1'" :min="-99999" :max="99999" style="width:20%" clearable />
            </div>
            <div style="margin-top:10px">
              <el-row :gutter="0">
                <el-col :span="5" style="margin-top:10px">
                  <el-radio class="moveLeft" label="2">多次调整</el-radio>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="初始点差:">
                    <el-input-number v-model="valuationScheme.spreadStart" :disabled="radio!== '2'" :min="-99999" :max="99999" style="width:60%" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="最终点差:">
                    <el-input-number v-model="valuationScheme.spreadEnd" :disabled="radio!== '2'" :min="-99999" :max="99999" style="width:60%" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="7">
                  <el-form-item label="调整幅度:">
                    <el-input-number v-model="valuationScheme.cdsAdjValue" :disabled="radio!== '2'" style="width:50%" clearable /> BP/天
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
            <div style="margin-top:10px">
              <el-radio class="moveLeft" label="3">相对点差</el-radio>
              <el-input-number v-model="valuationScheme.relaSpread" :disabled="radio!== '3'" style="width:20%" clearable />
            </div>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <el-row>
        <el-col :span="7" :offset="18">
          <div class="dialog-footer">
            <el-button @click="batchAdjustDialog.c = false">取 消</el-button>
            <el-button type="primary" @click="saveCredit">确 定</el-button>
          </div>
        </el-col>
      </el-row>
    </el-dialog>
    <el-dialog v-loading="Dialog.d" :visible.sync="batchAdjustDialog.d" title="批量调整目标流动性点差">
      <el-form>
        <el-form-item label="目标流动性点差">
          <el-input-number v-model="valuationScheme.flAdjValue" :min="-99999" :max="99999" style="width:50%" clearable />
        </el-form-item>
      </el-form>
      <el-row>
        <el-col :span="8" :offset="15">
          <div class="dialog-footer">
            <el-button @click="batchAdjustDialog.d = false">取 消</el-button>
            <el-button type="primary" @click="saveFlow">确 定</el-button>
          </div>
        </el-col>
      </el-row>
    </el-dialog>
    <el-dialog v-loading="Dialog.e" :visible.sync="batchAdjustDialog.e" title="批量调整目标其他点差">
      <el-form>
        <el-form-item label="目标其他点差" prop="otAdjValue">
          <el-input-number v-model="valuationScheme.otAdjValue" style="width:50%" clearable />
        </el-form-item>
      </el-form>
      <el-row>
        <el-col :span="8" :offset="15">
          <div class="dialog-footer">
            <el-button @click="batchAdjustDialog.e = false">取 消</el-button>
            <el-button type="primary" @click="saveOther">确 定</el-button>
          </div>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import AssetList from '@/views/valuation/scheme/asset-list.vue'
import ObeyList from '@/views/valuation/scheme/obey-list.vue'
import PeopleUpload from '@/views/valuation/scheme/people-upload.vue'
import AdjustForm from '@/views/valuation/scheme/adjustCount-form.vue'
import OppositeForm from '@/views/valuation/scheme/opposite-form.vue'
import { getAllTableList, returnTask, addOneTask, addBatchTask, batchAdjust, searchBondNum, confirm } from '@/api/valuation/task.js'
import { getCurveList, calculateExchange, viewExchange, adjustCredit, viewAdjustCredit } from '@/api/valuation/adjust.js'
import { basic_api_valuation } from '../../../api/base-api'
import { upload } from '@/utils/file-request'
import elepermission from '@/directive/elepermission'
export default {
  name: 'SchemeMyList',
  directives: { elepermission },
  components: {
    // BatchTaskForm,
    AssetList,
    PeopleUpload,
    AdjustForm,
    OppositeForm,
    ObeyList
  },
  data() {
    return {
      activeElement: '01',
      activeName: '01',
      labelPosition: 'left',
      radio: '1',
      // creditObj: {
      //   targetCredit: '1'
      // },
      isLook: false,
      isOpposite: false,
      volumeAddDialog: false,
      uploadMethodDialog: false,
      uploadUrl: `${basic_api_valuation}/task/batch-valu-result`,
      oppositeDialog: false,
      tableLoading: false,
      isBatch: false,
      remaindDialog: false,
      backLoading: false,
      marketDialog: false,
      creditDialog: false,
      interestDialog: false,
      adjustDialog: false,
      islookOpposite: false,
      isCredit: false, // 区分利率和信用计算点差的表格内容
      countTitle: '',
      Dialog: {
        a: false,
        b: false,
        c: false,
        d: false,
        e: false
      },
      targetFlow: '',
      targetOther: '',
      message: '',
      code: '',
      failMessage: '',
      myList: [],
      curveList: [],
      interestList: [],
      adjustList: [],
      creditList: [],
      interestObj: {},
      creditObject: {
        // compareList: [{
        //   symbol: '',
        //   number: ''
        // }]
      },
      compareObj: {},
      taskTitle: '',
      uploadList: [],
      selection: [],
      param: { // 往后台传递的参数
        curves: [], // 曲线集合
        type: '', // 利率点差-INTEREST 信用点差-CREDIT
        minVolume: '', // 最小成交量
        maxVolume: '', // 最大成交量
        baseTime: '', // 基准时间
        todayBrokerMarketOp: '',
        todayBrokerMarketDiff: '',
        yesterdayBrokerMarketOp: '',
        yesterdayBrokerMarketDiff: '',
        curveRangeBondDayOp: '',
        curveRangeBondDayDiff: '',
        reliableYearOp: '',
        reliableYearValue: '',
        valuationDeviationOp: '',
        valuationDeviationValue: '',
        transactionContinuityOp: '',
        transactionContinuityValue: '',
        historyScoreOp: '',
        historyScoreSum: '',
        page: {
          pageNumber: 1,
          pageSize: 10,
          totalRecord: 0
        }
      },
      selectCreditList: [],
      selectInterestList: [],
      compare: [
        {
          label: '大于',
          value: '01'
        }, {
          label: '大于等于',
          value: '02'
        }, {
          label: '等于',
          value: '03'
        }, {
          label: '小于',
          value: '04'
        }, {
          label: '小于等于',
          value: '05'
        }, {
          label: '不等于',
          value: '06'
        }
      ],
      exchangeObj: {},
      extends: '',
      volumeAdd: {
        cause: '08',
        batchId: '2222',
        attach: ''
      },
      paramRule: {
        minVolume: [
          { required: true, message: '请输入最小数量', trigger: 'blur' },
          { validator: this.checkNumber, trigger: 'blur' }
        ],
        maxVolume: [
          { required: true, message: '请输入最大数量', trigger: 'blur' },
          { validator: this.checkNumber, trigger: 'blur' }
        ],
        baseTime: [{ type: 'string', required: true, message: '请选择时间', trigger: 'change' }],
        addZero: [{ required: true, message: '请上传点差补0的券', trigger: 'blur' }]
      },
      creditRule: {
        minVolume: [
          { required: true, message: '请输入最小数量', trigger: 'blur' },
          { validator: this.checkNumber, trigger: 'blur' }
        ],
        maxVolume: [
          { required: true, message: '请输入最大数量', trigger: 'blur' },
          { validator: this.checkNumber, trigger: 'blur' }
        ],
        todayBrokerMarketOp: [{ required: true, message: '请输入比较规则', trigger: 'change' }],
        yesterdayBrokerMarketOp: [{ required: true, message: '请输入比较规则', trigger: 'change' }],
        curveRangeBondDayOp: [{ required: true, message: '请输入比较规则', trigger: 'change' }],
        reliableYearOp: [{ required: true, message: '请输入比较规则', trigger: 'change' }],
        valuationDeviationOp: [{ required: true, message: '请输入比较规则', trigger: 'change' }],
        historyScoreOp: [{ required: true, message: '请输入比较规则', trigger: 'change' }],
        transactionContinuityOp: [{ required: true, message: '请输入比较规则', trigger: 'change' }],
        todayBrokerMarketDiff: [
          { required: true, message: '请输入比较数值', trigger: 'blur' },
          { validator: this.checkCompare, trigger: 'blur' }
        ],
        yesterdayBrokerMarketDiff: [
          { required: true, message: '请输入比较数值', trigger: 'blur' },
          { validator: this.checkCompare, trigger: 'blur' }
        ],
        curveRangeBondDayDiff: [
          { required: true, message: '请输入比较数值', trigger: 'blur' },
          { validator: this.checkCompare, trigger: 'blur' }
        ],
        reliableYearValue: [
          { required: true, message: '请输入比较数值', trigger: 'blur' },
          { validator: this.checkCompare, trigger: 'blur' }
        ],
        valuationDeviationValue: [
          { required: true, message: '请输入比较数值', trigger: 'blur' },
          { validator: this.checkCompare, trigger: 'blur' }
        ],
        transactionContinuityValue: [
          { required: true, message: '请输入比较数值', trigger: 'blur' },
          { validator: this.checkCompare, trigger: 'blur' }
        ],
        historyScoreSum: [
          { required: true, message: '请输入比较数值', trigger: 'blur' },
          { validator: this.checkCompare, trigger: 'blur' }
        ]

      },
      rules: {
        batchId: [{ required: true, message: '请选择批次', trigger: 'change' }],
        cause: [{ required: true, message: '请选择调整原因', trigger: 'change' }]
        // dataFile: [{ required: true, message: '请选择上传文件', trigger: 'blur' }]
      },
      bondRule: {
        batchId: [{ required: true, message: '请选择批次', trigger: 'change' }]
      },
      batchList: [
        {
          batchId: '11',
          name: '批次1'
        }, {
          batchId: '22',
          name: '批次2'
        }
      ],
      excelFile: '',
      tasks: [],
      tabList: [
        // {
        //   label: '正常',
        //   scene: '01'
        // }, {
        //   label: '违约',
        //   scene: '02'
        // }, {
        //   label: '特殊',
        //   scene: '03'
        // }, {
        //   label: '人工上传',
        //   scene: '04'
        // }
      ],
      tabPaneList: [
        {
          label: 'All',
          name: '01'
        }, {
          label: '自动计算',
          name: '02'
        }, {
          label: '人工',
          name: '03'
        }, {
          label: '待确认',
          name: '04'
        }
      ],
      upLoadValution: {
        batchId: '11',
        excelFile: ''
      },
      nameList: [
        {
          name: '美术课件',
          value: '1'
        }
      ],
      bondId: '',
      isMy: true,
      valuationAllTask: [],
      valuationMyTask: [],
      taskLists: [],
      params: {
        page: {
          pageNumber: 1,
          pageSize: 10,
          totalRecord: 0
        },
        tab: '02',
        scene: '01'
      },
      // otherRule: {
      //   otAdjValue: [
      //     { required: true, message: '请输入点差', trigger: 'blur' },
      //     { required: true, min: -99999, max: 99999, message: '点差在-99999~+99999', trigger: 'blur' }
      //   ]
      // },
      valuationScheme: {
        tasks: [],
        curveId: '',
        marketGrade: '',
        cdsPremAdjType: '',
        cdsPremAdjWay: '',
        recoDire: '',
        relaSpread: '',
        flAdjValue: '',
        otAdjValue: '',
        spreadValue: '',
        spreadStart: '',
        spreadEnd: '',
        cdsAdjValue: ''
      },
      batchAdjustDialog: {
        a: false,
        b: false,
        c: false,
        d: false,
        e: false
      },
      marketLists: [],
      flag: false
    }
  },
  created() {
    this.loadTable()
    getCurveList().then(response => {
      this.creditList = response
    })
  },
  methods: {
    loadTable() {
      this.tableLoading = true
      getAllTableList(this.params).then(res => {
        this.tableLoading = false
        this.myList = res[0].datalist
        this.uploadList = res[0].manualList
        this.params.page = res[0].page
        console.log('res', res[0].datalist)
      }).catch(error => {
        console.log(error)
        this.tableLoading = false
      })
      getAllTableList({ tab: '02' }).then(res => {
        this.tabList = res
      })
    },
    confirmMethod() {
      this.selectionCheck()
      if (this.selection.length === 0) {
        return this.$message.warning('请选择任务')
      }
      confirm(this.selection).then(res => {
        this.$message.success('方案确认成功')
        this.loadTable()
      })
    },
    querySearch(query, call) {
      if (query) {
        searchBondNum(query).then(res => {
          console.log('sss', res)
          this.marketLists = res.map(v => {
            return { value: v.assetCode, label: v.bondShort }
          })
          call(this.marketLists)
        })
      }
    },
    handleSelectInput(e) {
      this.selectBondId = e.value
    },
    // selectionList(data) {
    //   this.selection = data
    // },
    taskList(data) { // 批量调整任务id
      this.taskLists = data
    },
    numberChange(e) {
      console.log('fff', e)
      // if (e < 0) {
      //   this.$message.warning('输入的值不能小于0')
      // }
    },
    checkCompare(rule, value, callback) {
      if (this.param.todayBrokerMarketDiff < 0 || this.param.yesterdayBrokerMarketDiff < 0 || this.param.curveRangeBondDayDiff < 0 ||
      this.param.reliableYearValue < 0 || this.param.valuationDeviationValue < 0 || this.param.transactionContinuityValue < 0 ||
      this.param.historyScoreSum < 0) {
        callback(new Error('输入的值不能小于0'))
      } else {
        callback()
      }
    },
    checkNumber(rule, value, callback) {
      if (this.interestObj.starNumber < 0 || this.interestObj.endNumber < 0) {
        callback(new Error('交易量应大于等于0'))
      }
      if (this.interestObj.starNumber && this.interestObj.endNumber) {
        if (this.interestObj.endNumber <= this.interestObj.starNumber) {
          callback(new Error('最大交易量应大于最小交易量'))
        }
      }
      if (this.param.minVolume < 0 || this.param.maxVolume < 0) {
        callback(new Error('交易量应大于等于0'))
      }
      if (this.param.minVolume && this.param.maxVolume) {
        if (this.param.maxVolume <= this.param.minVolume) {
          callback(new Error('最大交易量应大于最小交易量'))
        }
      }
      callback()
    },
    radioChange(e) {
      this.radio = e
      this.valuationScheme = {}
    },
    tabName(param) {
      switch (param) {
        case '01': return '正常'
        case '02': return '违约'
        case '03': return '本金'
        case '04': return '人工上传'
      }
    },
    refrech() {
      this.loadTable()
    },
    selectionCheck() { // 防止点击取消后还会被添加上
      this.selection = []
      this.taskLists.map(v => {
        this.selection.push(v.id)
      })
      this.selection = Array.from(new Set(this.selection))
    },
    selectBondId() { // 解决选择任务重复问题，taskLists变化导致重复添加到tasks中
      // if (this.taskLists && this.taskLists.length > 0) {
      this.tasks = []
      this.taskLists.map(v => {
        this.tasks.push({ bondId: v.bondId })
      })
      // }
      this.valuationScheme.tasks = this.tasks
      console.log('cc', this.tasks)
    },
    clearTask() {
      this.tasks = []
      this.taskLists = []
    },
    saveTarget() {
      if (this.taskLists.length === 0) {
        return this.$message.warning('请至少选择一条任务进行调整')
      }
      if (!this.valuationScheme.curveId) {
        return this.$message.warning('请至少选择一条曲线')
      }
      this.selectBondId()
      this.Dialog.a = true
      batchAdjust(this.valuationScheme).then(res => {
        this.Dialog.a = false
        this.batchAdjustDialog.a = false
        this.$message.success('添加成功')
        this.loadTable()
        this.clearTask()
      })
    },
    saveGrade() {
      if (this.taskLists.length === 0) {
        return this.$message.warning('请至少选择一条任务进行调整')
      }
      if (!this.valuationScheme.marketGrade) {
        return this.$message.warning('请至少选择一个隐含评级')
      }
      this.selectBondId()
      this.Dialog.b = true
      batchAdjust(this.valuationScheme).then(res => {
        this.Dialog.b = false
        this.batchAdjustDialog.b = false
        this.$message.success('添加成功')
        this.loadTable()
        this.clearTask()
      })
    },
    saveCredit() {
      if (this.taskLists.length === 0) {
        return this.$message.warning('请至少选择一条任务进行调整')
      }
      if (this.radio === '1') {
        if (!this.valuationScheme.spreadValue && this.valuationScheme.spreadValue !== 0) {
          return this.$message.warning('请输入常规调整点差')
        }
        if (this.valuationScheme.spreadValue >= 99999 || this.valuationScheme.spreadValue <= -99999) {
          return this.$message.warning('常规调整点差范围是-99999~+99999,请重新输入')
        }
      }
      if (this.radio === '2') {
        if (!this.valuationScheme.cdsAdjValue && this.valuationScheme.cdsAdjValue !== 0) {
          return this.$message.warning('请输入调整幅度')
        }
        if (!this.valuationScheme.spreadStart && this.valuationScheme.spreadStart !== 0) {
          return this.$message.warning('请输入初始点差')
        }
        if (!this.valuationScheme.spreadEnd && this.valuationScheme.spreadEnd !== 0) {
          return this.$message.warning('请输入最终点差')
        }
        if (this.valuationScheme.spreadStart >= this.valuationScheme.spreadEnd) {
          return this.$message.warning('最终点差应大于初始点差')
        }
        if (this.valuationScheme.spreadStart >= 99999 || this.valuationScheme.spreadStart <= -99999) {
          return this.$message.warning('初始点差范围是-99999~+99999,请重新输入')
        }
        if (this.valuationScheme.spreadEnd >= 99999 || this.valuationScheme.spreadEnd <= -99999) {
          return this.$message.warning('最终点差范围是-99999~+99999,请重新输入')
        }
      }
      if (this.radio === '3') {
        if (!this.valuationScheme.relaSpread && this.valuationScheme.relaSpread !== 0) {
          return this.$message.warning('请输入相对点差')
        }
        if (this.valuationScheme.relaSpread > 100 || this.valuationScheme.relaSpread < 0) {
          return this.$message.warning('相对点差范围是0~100,请重新输入')
        }
      }
      if (!this.valuationScheme.cdsAdjValue && !this.valuationScheme.spreadStart && !this.valuationScheme.spreadEnd &&
      !this.valuationScheme.relaSpread && !this.valuationScheme.spreadValue && this.valuationScheme.relaSpread !== 0) {
        return this.$message.warning('请输入一种目标点差')
      }
      this.selectBondId()
      this.Dialog.c = true
      batchAdjust(this.valuationScheme).then(res => {
        this.Dialog.c = false
        this.batchAdjustDialog.c = false
        this.$message.success('添加成功')
        this.loadTable()
        this.clearTask()
      })
    },
    saveFlow() {
      if (this.taskLists.length === 0) {
        return this.$message.warning('请至少选择一条任务进行调整')
      }
      if (!this.valuationScheme.flAdjValue && this.valuationScheme.flAdjValue !== 0) {
        return this.$message.warning('请输入目标流动性点差')
      }
      if (this.valuationScheme.flAdjValue >= 99999 || this.valuationScheme.flAdjValue <= -99999) {
        return this.$message.warning('目标流动性点差范围是-99999~+99999,请重新输入')
      }
      // this.valuationScheme.tasks = this.tasks
      this.selectBondId()
      this.Dialog.d = true
      batchAdjust(this.valuationScheme).then(res => {
        this.Dialog.d = false
        this.batchAdjustDialog.d = false
        this.$message.success('添加成功')
        this.loadTable()
        this.clearTask()
      })
    },
    saveOther() {
      if (this.taskLists.length === 0) {
        return this.$message.warning('请至少选择一条任务进行调整')
      }
      if (!this.valuationScheme.otAdjValue && this.valuationScheme.otAdjValue !== 0) {
        return this.$message.warning('请输入目标其他点差')
      }
      if (this.valuationScheme.otAdjValue >= 99999 || this.valuationScheme.otAdjValue <= -99999) {
        return this.$message.warning('目标其他点差范围是-99999~+99999,请重新输入')
      }
      this.selectBondId()
      this.Dialog.e = true
      // this.$refs.otherDom.validate(val => {
      //   if (val) {
      batchAdjust(this.valuationScheme).then(res => {
        this.Dialog.e = false
        this.batchAdjustDialog.e = false
        this.$message.success('添加成功')
        this.loadTable()
        this.clearTask()
      }).catch(err => {
        this.$message.err(`${err}`)
      })
      //   } else {
      //     return false
      //   }
      // })
    },
    marketAdjust() {
      this.marketDialog = true
    },
    interestAdjust() {
      this.interestDialog = true
      this.interestObj = {}
    },
    creditAdjust() {
      this.creditDialog = true
      this.creditObject = {}
      if (this.creditList.length > 4) {
        this.creditList = this.creditList.slice(0, 4)
        this.creditList.push({ remark: '......' })
      }
    },
    handleSelectionChange(val) {
      this.selectCreditList = val
    },
    handleInterestChange(val) {
      this.selectInterestList = val
    },
    addZero() {

    },
    tabClick(e) {
      this.activeName = e.name
    },
    countDiff() {
      this.$refs['interestDom'].validate(val => {
        if (val) {
          this.param.curves = this.selectCreditList.map((item) => {
            return item.curveId
          })
          this.param.type = 'INTEREST' // 利率点差计算
          adjustCredit(this.param).then(response => {
            const { dataList, page } = response
            this.adjustList = dataList
            this.param.page = page
            this.countTitle = '利率债点差调整'
            this.isCredit = false
            this.isLook = false
            this.adjustDialog = true
          })
        }
      })
    },
    lookDiff() {
      this.$refs['interestDom'].validate(val => {
        if (val) {
          this.param.curves = this.selectCreditList.map((item) => {
            return item.curveId
          })
          this.param.type = 'CREDIT' // 查看利率点差
          viewAdjustCredit(this.param).then(response => {
            const { dataList, page } = response
            this.adjustList = dataList
            this.param.page = page
            this.countTitle = '利率债点差调整'
            this.isCredit = false
            this.isLook = true
            this.adjustDialog = true
          })
        }
      })
    },
    countcreditDiff() {
      this.$refs['creditDom'].validate(val => {
        if (val) {
          this.param.curves = this.selectCreditList.map((item) => {
            return item.curveId
          })
          this.param.type = 'CREDIT' // 信用点差计算
          adjustCredit(this.param).then(response => {
            const { dataList, page } = response
            this.adjustList = dataList
            this.param.page = page
            this.countTitle = '信用债点差调整'
            this.isCredit = true
            this.isLook = false
            this.adjustDialog = true
          })
        }
      })
    },
    lookcreditDiff() {
      this.$refs['creditDom'].validate(val => {
        if (val) {
          this.param.curves = this.selectCreditList.map((item) => {
            return item.curveId
          })
          this.param.type = 'CREDIT' // 查看信用点差
          viewAdjustCredit(this.param).then(response => {
            const { dataList, page } = response
            this.adjustList = dataList
            this.param.page = page
            this.countTitle = '信用债点差调整'
            this.isCredit = true
            this.isLook = true
            this.adjustDialog = true
          })
        }
      })
    },
    countOpposite() {
      this.$refs['creditDom'].validate(val => {
        if (val) {
          this.param.curves = this.selectCreditList.map((item) => {
            return item.curveId
          })
          // 保存本次选中的曲线
          // 计算对敲
          calculateExchange(this.param).then(response => {
            const { dataList, page } = response
            this.islookOpposite = false
            this.$store.commit('scheme/setAdjustList', dataList)
            this.param.page = page
            this.oppositeDialog = true
          })
        }
      })
    },
    lookOpposite() {
      this.$refs['creditDom'].validate(val => {
        if (val) {
          this.param.curves = this.selectCreditList.map((item) => {
            return item.curveId
          })
          viewExchange(this.param).then(response => {
            const { dataList, page } = response
            this.islookOpposite = true
            this.$store.commit('scheme/setAdjustList', dataList)
            this.param.page = page
            this.oppositeDialog = true
          })
        }
      })
    },
    uploadAddZero() {

    },
    handleSelect(e) {
      this.params.scene = e.name
      this.activeElement = e.name
      this.loadTable()
    },
    handleSizeChange(pageSize) {
      this.params.page.pageSize = pageSize
      this.loadTable()
    },
    handleCurrentChange(currentPage) {
      this.params.page.pageNumber = currentPage
      this.loadTable()
    },
    backTask() {
      if (this.taskLists.length === 0) {
        return this.$message({
          message: '请选择任务',
          type: 'warning'
        })
      }
      this.selectionCheck()
      this.backLoading = true
      returnTask(this.selection).then(res => {
        this.$message({
          message: '任务退回成功',
          type: 'success'
        })
        this.backLoading = false
        this.taskLists = []
        this.loadTable()
      }).catch(() => {
        this.backLoading = false
      })
    },
    addTask() {
      if (!this.bondId) {
        return this.$message.warning('请输入资产编号')
      }
      console.log('bond', this.bondId)
      this.marketLists.map(v => {
        if (v.value === this.bondId) {
          console.log('---', v.value)
          this.flag = true
        }
      })
      if (!this.flag) {
        return this.$message.warning('请输入正确的资产编号')
      }
      this.isBatch = false
      this.volumeAddDialog = true
      this.taskTitle = '添加任务'
      this.resetTaskDialog()
    },
    nameChange() {

    },
    downLoadMode() {
      this.$refs.moduleDownload.click()
    },
    downLoadPeople() {
      this.$refs.peopleDownload.click()
    },
    saveValuation() {
      this.$refs['bondDom'].validate(val => {
        const fd = new FormData()
        fd.append('data.attach', this.upLoadValution.excelFile)
        fd.append('data.batchId', this.upLoadValution.batchId)
        fd.append('data.tab', '02')
        upload({
          url: this.uploadUrl,
          data: fd
        }).then(res => {
          this.$message({
            message: '添加成功',
            type: 'success'
          })
          this.uploadMethodDialog = false
          this.loadTable()
        })
      })
    },
    resetTaskDialog() {
      this.volumeAdd.batchId = this.batchList[0].batchId
      this.volumeAdd.attach = null
      this.volumeAdd.cause = '08'
      if (this.$refs.upload) this.$refs.upload.clearFiles()
    },
    resetBondDialog() { // 清空人工估值上传
      this.upLoadValution.batchId = this.batchList[0].batchId
      this.upLoadValution.excelFile = null
      if (this.$refs.upload1) this.$refs.upload1.clearFiles()
    },
    saveBatchFirst(type) {
      this.volumeAdd.busiCode = type
      const fd = new FormData()
      fd.append('data.attach', this.volumeAdd.attach)
      fd.append('data.batchId', this.volumeAdd.batchId)
      fd.append('data.cause', this.volumeAdd.cause)
      fd.append('data.tab', '02')
      fd.append('data.busiCode', type)
      addBatchTask(fd).then(res => {
        this.remaindDialog = false
        this.volumeAddDialog = false
        this.$message({
          message: '添加成功',
          type: 'success'
        })
        this.loadTable()
      })
    },
    saveFirst(type) {
      console.log('ty', type)
      this.volumeAdd.busiCode = type
      this.volumeAdd.tab = '02'
      addOneTask(this.volumeAdd).then(res => {
        this.remaindDialog = false
        this.volumeAddDialog = false
        this.$message({
          message: '添加成功',
          type: 'success'
        })
        this.bondId = ''
        this.loadTable()
      })
    },
    cancle() {
      this.remaindDialog = false
      this.volumeAddDialog = false
    },
    saveBatch() {
      this.$refs.ruleForm.validate(val => {
        if (val) {
          if (this.isBatch) {
            if (!this.volumeAdd.attach) {
              return this.$message('别着急, 您的文件还没有上传哦')
            }
            var fd = new FormData()
            fd.append('data.attach', this.volumeAdd.attach)
            fd.append('data.batchId', this.volumeAdd.batchId)
            fd.append('data.cause', this.volumeAdd.cause)
            fd.append('data.tab', '02')
            addBatchTask(fd).then(res => {
              if (res) {
                if (res.respCode === 'YBL100001004') {
                  this.remaindDialog = true
                  this.code = res.respCode
                  this.message = res.respMsg
                  this.failMessage = res.failData
                } else {
                  this.volumeAddDialog = false
                  this.$message({
                    message: '添加成功',
                    type: 'success'
                  })
                  this.loadTable()
                }
              }
            }).catch(err => {
              this.$message.error(`${err}`)
            })
          } else {
            if (!this.bondId) {
              this.$message.error('请输入资产编码')
              return
            }
            delete this.volumeAdd.attach
            delete this.volumeAdd.busiCode
            this.volumeAdd.assetCode = this.bondId
            this.volumeAdd.tab = '02'
            addOneTask(this.volumeAdd).then(res => {
              if (res.code) {
                // this.volumeAddDialog = false
                this.remaindDialog = true
                this.code = res.code
                this.message = res.msg
              } else {
                this.volumeAddDialog = false
                this.$message({
                  message: '添加成功',
                  type: 'success'
                })
                this.loadTable()
              }
            })
          }
        }
      })
    },
    handleExceed() {
      this.$message.warning('当前限制选择1个文件,请删除后继续上传')
    },
    memSuccess(item) {
      this.$message.success(`文件: ${item.file.name} 上传成功`)
      this.volumeAdd.attach = item.file
      console.log('file', item.file)
    },
    memSuccess1(item) {
      this.$message.success(`文件: ${item.file.name} 上传成功`)
      this.upLoadValution.excelFile = item.file
    },
    handleExceed1() {
      this.$message.warning('当前限制选择1个文件,请删除后继续上传')
    },
    saveName() {

    },
    claimTask: function() {

    },
    batchAddTask() {
      this.isBatch = true
      this.volumeAddDialog = true
      this.taskTitle = '批量添加任务'
      this.resetTaskDialog()
    },
    uploadScheme() {
      this.resetBondDialog()
      this.uploadMethodDialog = true
    },
    downloadScheme: function() {

    },
    schemeAdjust: function() {

    },
    batchesAdjust(command) {
      console.log('this.taskLists', this.taskLists)
      this.valuationScheme = {}
      this.radio = '1'
      this.batchAdjustDialog[command] = true
      if (command === 'a') {
        getCurveList().then(response => {
          const { dataList } = response
          this.curveList = dataList
        })
      }
    },
    taskBack: function() {

    },
    taskCommit: function() {

    }
  }
}
</script>
<style lang="scss" scoped>
//  .scroll-box {
//      white-space: nowrap;
//      overflow-x: scroll;
//      height: 60px;
//  }
 .assset {
     font-weight: 700;
     font-size: 16px;
 }
 .moveLeft {
   margin-left: 110px;
 }
 .card {
     height: 100%;
 }
 .icon-box {
   font-size: 25px;
   display: inline-block;
   padding-left: 10px;
 }
  .content {
   font-size: 18px;
   margin-top: -15px;
 }

 .bot-box {
   display: flex;
  //  justify-content: space-between;
   height: 30px;
   align-items: center;
   margin: 10px 0;
   .left-box {
     flex-wrap: nowrap;
     flex: 2;
   }
   .input-box {
     flex: 1;
     margin: 0 5px;
   }
 }
 .downLoad {
   margin-left: 70px;
   color: #09f;
  //  margin-top: -10px;
    &:hover {
     cursor: pointer;
   }
 }
</style>
