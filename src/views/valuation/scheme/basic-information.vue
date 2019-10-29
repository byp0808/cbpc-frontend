<template>
  <div>
    <el-table
      :data="haveSelectList"
      style="width: 100%"
      max-height="300"
      :header-cell-style="{background:'#f4f7fc'}"
      border
      fit
      highlight-current-row
    >
      <el-table-column label="资产编码" align="center" width="150px">
        <template slot-scope="scope">
          <span>{{ scope.row.bondId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="资产简称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.bondShort }}</span>
        </template>
      </el-table-column>
      <el-table-column label="流通场所" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.maketId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="含权说明" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.filterId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否推荐" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column label="估值方法" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.filterId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="市场隐含评级" align="center" width="120px">
        <template slot-scope="scope">
          <span>{{ $dft('MARKET_GRADE', scope.row.marketGrade) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="目标曲线" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.curveId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="目标信用点差" align="center" width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.filterId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="目标流动性点差" align="center" width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.flAdjValue }}</span>
        </template>
      </el-table-column>
      <el-table-column label="目标其他点差" align="center" width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.otAdjValue }}</span>
        </template>
      </el-table-column>
      <el-table-column label="总点差" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.filterId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="估值收益率" align="center" width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.filterId }}</span>
        </template>
      </el-table-column>
    </el-table>
    <h3>基本条款</h3>
    <div v-loading="basicLoading">
      <el-row>
        <el-col :span="6">
          <div class="grid-content bg-purple-light">债券代码</div>
        </el-col>
        <el-col :span="6" class="grid-content">
          <div>{{ basicInfo.valAssetCode }}</div>
        </el-col>
        <el-col :span="6" class="grid-content bg-purple-light">
          <div>债券简称</div>
        </el-col>
        <el-col :span="6" class="grid-content">
          <div>{{ basicInfo.valAssetShortName }}</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <div class="grid-content bg-purple-light">当前余额(亿元)</div>
        </el-col>
        <el-col :span="6" class="grid-content">
          <div>{{ basicInfo.currBal }}</div>
        </el-col>
        <el-col :span="6" class="grid-content bg-purple-light">
          <div>债券类型</div>
        </el-col>
        <el-col :span="6" class="grid-content">
          <div>--</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <div class="grid-content bg-purple-light">质押券代码</div>
        </el-col>
        <el-col :span="6" class="grid-content">
          <div>--</div>
        </el-col>
        <el-col :span="6" class="grid-content bg-purple-light">
          <div>折合标准券(元)</div>
        </el-col>
        <el-col :span="6" class="grid-content">
          <div>--</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <div class="grid-content bg-purple-light">上市日期</div>
        </el-col>
        <el-col :span="6" class="grid-content">
          <div v-if="basicInfo.lstdDate">{{ $moment(basicInfo.lstdDate ).format('YYYY-MM-DD') }}</div>
        </el-col>
        <el-col :span="6" class="grid-content bg-purple-light">
          <div>摘牌日期</div>
        </el-col>
        <el-col :span="6" class="grid-content">
          <div>--</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <div class="grid-content bg-purple-light">交易市场</div>
        </el-col>
        <el-col :span="6" class="grid-content">
          <div>{{ basicInfo.exchng }}</div>
        </el-col>
        <el-col :span="6" class="grid-content bg-purple-light">
          <div>海外评级</div>
        </el-col>
        <el-col :span="6" class="grid-content">
          <div>--</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <div class="grid-content bg-purple-light">最新债项评级</div>
        </el-col>
        <el-col :span="6" class="grid-content">
          <div>{{ basicInfo.ltstDebtCrdtRtng }}</div>
        </el-col>
        <el-col :span="6" class="grid-content bg-purple-light">
          <div>评级机构</div>
        </el-col>
        <el-col :span="6" class="grid-content">
          <div>--</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <div class="grid-content bg-purple-light">票面利率(当期)</div>
        </el-col>
        <el-col :span="6" class="grid-content">
          <div>{{ basicInfo.ltstCupnRate }}</div>
        </el-col>
        <el-col :span="6" class="grid-content bg-purple-light">
          <div>发行价格(元)/最新面值(元)</div>
        </el-col>
        <el-col :span="6" class="grid-content">
          <div>--</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <div class="grid-content bg-purple-light">利率类型</div>
        </el-col>
        <el-col :span="6" class="grid-content">
          <div>--</div>
        </el-col>
        <el-col :span="6" class="grid-content bg-purple-light">
          <div>票息品种</div>
        </el-col>
        <el-col :span="6" class="grid-content">
          <div>--</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <div class="grid-content bg-purple-light">付息频率</div>
        </el-col>
        <el-col :span="6" class="grid-content">
          <div>{{ basicInfo.intPymntPeriod }}</div>
        </el-col>
        <el-col :span="6" class="grid-content bg-purple-light">
          <div>下一付息日</div>
        </el-col>
        <el-col :span="6" class="grid-content">
          <div>--</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <div class="grid-content bg-purple-light">利率说明</div>
        </el-col>
        <el-col :span="6" class="grid-content">
          <div>--</div>
        </el-col>
        <el-col :span="6" class="grid-content bg-purple-light">
          <div>距下一付息日(天)</div>
        </el-col>
        <el-col :span="6" class="grid-content">
          <div>--</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <div class="grid-content bg-purple-light">计息基准</div>
        </el-col>
        <el-col :span="6" class="grid-content">
          <div>{{ basicInfo.bnchmrkIntRateClassCode }}</div>
        </el-col>
        <el-col :span="6" class="grid-content bg-purple-light">
          <div>票息类型</div>
        </el-col>
        <el-col :span="6" class="grid-content">
          <div>--</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <div class="grid-content bg-purple-light">剩余期限(年)</div>
        </el-col>
        <el-col :span="6" class="grid-content">
          <div>{{ basicInfo.mtrtyDate }}</div>
        </el-col>
        <el-col :span="6" class="grid-content bg-purple-light">
          <div>期限(年)</div>
        </el-col>
        <el-col :span="6" class="grid-content">
          <div>--</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <div class="grid-content bg-purple-light">起息日期</div>
        </el-col>
        <el-col :span="6" class="grid-content">
          <div v-if="basicInfo.intStartDate">{{ $moment(basicInfo.intStartDate ).format('YYYY-MM-DD') }}</div>
        </el-col>
        <el-col :span="6" class="grid-content bg-purple-light">
          <div>到期日期</div>
        </el-col>
        <el-col :span="6" class="grid-content">
          <div>--</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <div class="grid-content bg-purple-light">发行规模(亿元)</div>
        </el-col>
        <el-col :span="6" class="grid-content">
          <div>--</div>
        </el-col>
        <el-col :span="6" class="grid-content bg-purple-light">
          <div>发行方式</div>
        </el-col>
        <el-col :span="6" class="grid-content">
          <div>{{ basicInfo.issueMthdCode }}</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <div class="grid-content bg-purple-light">债券全称</div>
        </el-col>
        <el-col :span="6" class="grid-content">
          <div>{{ basicInfo.bondFullName }}</div>
        </el-col>
        <el-col :span="6" class="grid-content bg-purple-light">
          <div>是否城投债曲线样本券</div>
        </el-col>
        <el-col :span="6" class="grid-content">
          <div>{{ basicInfo.mncplBdFlag }}</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <div class="grid-content bg-purple-light">发行人</div>
        </el-col>
        <el-col :span="6" class="grid-content">
          <div>{{ basicInfo.issuerName }}</div>
        </el-col>
        <el-col :span="6" class="grid-content bg-purple-light">
          <div>发行人企业性质</div>
        </el-col>
        <el-col :span="6" class="grid-content">
          <div>--</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <div class="grid-content bg-purple-light">发行人注册地址</div>
        </el-col>
        <el-col :span="18" class="grid-content">
          <div>--</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <div class="grid-content bg-purple-light">托管机构</div>
        </el-col>
        <el-col :span="6" class="grid-content">
          <div>--</div>
        </el-col>
        <el-col :span="6" class="grid-content bg-purple-light">
          <div>担保人</div>
        </el-col>
        <el-col :span="6" class="grid-content">
          <div>--</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <div class="grid-content bg-purple-light">增信方式</div>
        </el-col>
        <el-col :span="6" class="grid-content">
          <div>--</div>
        </el-col>
        <el-col :span="6" class="grid-content bg-purple-light">
          <div>增信情况</div>
        </el-col>
        <el-col :span="6" class="grid-content">
          <div>--</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <div class="grid-content bg-purple-light">缴款日期</div>
        </el-col>
        <el-col :span="6" class="grid-content">
          <div v-if="basicInfo.issuePymntDate">{{ $moment(basicInfo.issuePymntDate).format('YYYY-MM-DD') }}</div>
        </el-col>
        <el-col :span="6" class="grid-content bg-purple-light">
          <div>主承销商</div>
        </el-col>
        <el-col :span="6" class="grid-content">
          <div>--</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <div class="grid-content bg-purple-light">内含特殊条款</div>
        </el-col>
        <el-col :span="6" class="grid-content">
          <div>--</div>
        </el-col>
        <el-col :span="6" class="grid-content bg-purple-light">
          <div>下一行权日</div>
        </el-col>
        <el-col :span="6" class="grid-content">
          <div>--</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <div class="grid-content bg-purple-light">条款说明</div>
        </el-col>
        <el-col :span="18" class="grid-content">
          <div>--</div>
        </el-col>
      </el-row>
    </div>
    <h3>信用等级</h3>
    <el-table
      v-loading="creditLoading"
      :data="creditList"
      style="width: 100%"
      max-height="300"
      :header-cell-style="{background:'#f4f7fc'}"
      border
      fit
      highlight-current-row
    >
      <el-table-column label="评级标准" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.cause }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发布日期" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column label="信用评级" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.filterId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="评级展望" align="center">
        <template slot-scope="scope">
          <span>{{ causeFilter(scope.row.cause) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="变动方向" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column label="评级机构" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.filterId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="评级类型" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.filterId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="历史评级变动" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="look(scope.row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="margin-top:20px"
      align="center"
      :current-page="page.pageNumber"
      :page-sizes="[10, 20, 30, 40, 50]"
      :page-size="page.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="page.totalRecord"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <h3>募集发行</h3>
    <div v-loading="publishLoading">
      <el-row>
        <el-col :span="6">
          <div class="grid-content bg-purple-light">发行起始日期</div>
        </el-col>
        <el-col :span="6" class="grid-content">
          <div v-if="basicInfo.issueStartDate">{{ $moment(basicInfo.issueStartDate).format('YYYY-MM-DD') }}</div>
        </el-col>
        <el-col :span="6" class="grid-content bg-purple-light">
          <div>发行截至日期</div>
        </el-col>
        <el-col :span="6" class="grid-content">
          <div v-if="basicInfo.issueEndDate">{{ $moment(basicInfo.issueEndDate ).format('YYYY-MM-DD') }}</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <div class="grid-content bg-purple-light">缴款日期</div>
        </el-col>
        <el-col :span="6" class="grid-content">
          <div v-if="basicInfo.issuePymntDate">{{ $moment(basicInfo.issuePymntDate ).format('YYYY-MM-DD') }}</div>
        </el-col>
        <el-col :span="6" class="grid-content bg-purple-light">
          <div>发行方式</div>
        </el-col>
        <el-col :span="6" class="grid-content">
          <div>--</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <div class="grid-content bg-purple-light">上市日期</div>
        </el-col>
        <el-col :span="6" class="grid-content">
          <div>--</div>
        </el-col>
        <el-col :span="6" class="grid-content bg-purple-light">
          <div>发行公告日期</div>
        </el-col>
        <el-col :span="6" class="grid-content">
          <div>--</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <div class="grid-content bg-purple-light">计划发行量(亿)</div>
        </el-col>
        <el-col :span="6" class="grid-content">
          <div>--</div>
        </el-col>
        <el-col :span="6" class="grid-content bg-purple-light">
          <div>实际发行量(亿)</div>
        </el-col>
        <el-col :span="6" class="grid-content">
          <div>{{ basicInfo.actualIssueAmt }}</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <div class="grid-content bg-purple-light">薄记管理人</div>
        </el-col>
        <el-col :span="6" class="grid-content">
          <div>--</div>
        </el-col>
        <el-col :span="6" class="grid-content bg-purple-light">
          <div>承销方式</div>
        </el-col>
        <el-col :span="6" class="grid-content">
          <div>--</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <div class="grid-content bg-purple-light">主承销商</div>
        </el-col>
        <el-col :span="18" class="grid-content">
          <div>--</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <div class="grid-content bg-purple-light">副主承销商</div>
        </el-col>
        <el-col :span="18" class="grid-content">
          <div>--</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <div class="grid-content bg-purple-light">主承金额分摊</div>
        </el-col>
        <el-col :span="18" class="grid-content">
          <div>--</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <div class="grid-content bg-purple-light">承销团</div>
        </el-col>
        <el-col :span="6" class="grid-content">
          <div>--</div>
        </el-col>
        <el-col :span="6" class="grid-content bg-purple-light">
          <div>注册文件号</div>
        </el-col>
        <el-col :span="6" class="grid-content">
          <div>--</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <div class="grid-content bg-purple-light">招投标日期</div>
        </el-col>
        <el-col :span="6" class="grid-content">
          <div>--</div>
        </el-col>
        <el-col :span="6" class="grid-content bg-purple-light">
          <div>发行价收益率(%)</div>
        </el-col>
        <el-col :span="6" class="grid-content">
          <div>{{ basicInfo.issueRefYieldRate }}</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <div class="grid-content bg-purple-light">招标标的</div>
        </el-col>
        <el-col :span="6" class="grid-content">
          <div>{{ basicInfo.bidObjectTypeCode }}</div>
        </el-col>
        <el-col :span="6" class="grid-content bg-purple-light">
          <div>招标方式</div>
        </el-col>
        <el-col :span="6" class="grid-content">
          <div>--</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <div class="grid-content bg-purple-light">中标价位</div>
        </el-col>
        <el-col :span="6" class="grid-content">
          <div>{{ basicInfo.mrgnWinBidAmt }}</div>
        </el-col>
        <el-col :span="6" class="grid-content bg-purple-light">
          <div>中标区间</div>
        </el-col>
        <el-col :span="6" class="grid-content">
          <div>--</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <div class="grid-content bg-purple-light">认购倍数</div>
        </el-col>
        <el-col :span="6" class="grid-content">
          <div>{{ basicInfo.sbscptnMult }}</div>
        </el-col>
        <el-col :span="6" class="grid-content bg-purple-light">
          <div>发行费率(%)</div>
        </el-col>
        <el-col :span="6" class="grid-content">
          <div>{{ basicInfo.issueCommRate }}</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <div class="grid-content bg-purple-light">上网认购代码</div>
        </el-col>
        <el-col :span="6" class="grid-content">
          <div>--</div>
        </el-col>
        <el-col :span="6" class="grid-content bg-purple-light">
          <div>上网发行日期</div>
        </el-col>
        <el-col :span="6" class="grid-content">
          <div>--</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <div class="grid-content bg-purple-light">上网发行数量</div>
        </el-col>
        <el-col :span="6" class="grid-content">
          <div>--</div>
        </el-col>
        <el-col :span="6" class="grid-content bg-purple-light">
          <div>同期债</div>
        </el-col>
        <el-col :span="6" class="grid-content">
          <div>--</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <div class="grid-content bg-purple-light">发现时债项评级</div>
        </el-col>
        <el-col :span="6" class="grid-content">
          <div>--</div>
        </el-col>
        <el-col :span="6" class="grid-content bg-purple-light">
          <div>发行时主体评级</div>
        </el-col>
        <el-col :span="6" class="grid-content">
          <div>--</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <div class="grid-content bg-purple-light">发行人委托评级机构</div>
        </el-col>
        <el-col :span="6" class="grid-content">
          <div>--</div>
        </el-col>
        <el-col :span="6" class="grid-content bg-purple-light">
          <div>法律顾问</div>
        </el-col>
        <el-col :span="6" class="grid-content">
          <div>--</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <div class="grid-content bg-purple-light">募集资金用途</div>
        </el-col>
        <el-col :span="18" class="grid-content">
          <div>--</div>
        </el-col>
      </el-row>
    </div>
    <h3>现金流</h3>
    <el-table
      v-loading="crushLoading"
      :data="moneyList"
      style="width: 100%"
      max-height="200"
      :header-cell-style="{background:'#f4f7fc'}"
      border
      fit
      highlight-current-row
    >
      <el-table-column label="现金流发行日" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.cause }}</span>
        </template>
      </el-table-column>
      <el-table-column label="期末每百元面额应付利息" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column label="期末每百元面额应付本金" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.filterId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="期末每百元面额现金流" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.cause }}</span>
        </template>
      </el-table-column>
      <el-table-column label="现金流类型" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column label="票券利率(%)" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.filterId }}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="margin-top:20px"
      align="center"
      :current-page="curshPage.pageNumber"
      :page-sizes="[10, 20, 30, 40, 50]"
      :page-size="curshPage.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="curshPage.totalRecord"
      @size-change="sizeChange"
      @current-change="currentChange"
    />
    <!-- <el-dialog title="历史评级变动" :visible.sync="historyDialog">

    </el-dialog> -->
  </div>
</template>

<script>
import { searchBond } from '@/api/valuation/influence.js'
export default {
  name: 'BasicInformation',
  components: {

  },
  data() {
    return {
      creditList: [],
      haveSelectList: [],
      moneyList: [],
      basicInfo: {},
      basicLoading: false,
      creditLoading: false,
      publishLoading: false,
      crushLoading: false,
      historyDialog: false,
      id: '',
      page: {
        pageNumber: 1,
        pageSize: 10,
        totalRecord: 0
      },
      curshPage: {
        pageNumber: 1,
        pageSize: 10,
        totalRecord: 0
      }
    }
  },
  created() {
    if (this.$route.params) {
      this.haveSelectList.push(this.$route.params)
      this.id = this.$route.params.id
    }
    console.log('22', this.id)
    this.searchBond()
  },
  methods: {
    look() {

    },
    searchBond() {
      this.basicLoading = true
      const params = {
        page: {
          pageNumber: 1,
          pageSize: 10
        },
        search_csin_EQ: this.id
        // search_csin_EQ: '402e50f218894a5fb86288b868cf8320'
      }
      searchBond(params).then(res => {
        this.basicLoading = false
        if (res.dataList[0] && this.id) {
          this.basicInfo = res.dataList[0]
        }
      }).catch(err => {
        console.log(err)
        this.basicLoading = false
      })
    },
    handleSizeChange(pageSize) {
      this.page.pageSize = pageSize
    },
    handleCurrentChange(currentPage) {
      this.page.pageNumber = currentPage
    },
    sizeChange(pageSize) {
      this.curshPage.pageSize = pageSize
    },
    currentChange(currentPage) {
      this.curshPage.pageNumber = currentPage
    }
  }
}
</script>
<style lang="scss" scoped>
 .grid-content {
    height: 36px;
    line-height: 36px;
    padding-left: 8px;
    border: 1px solid #eee;
  }
  .bg-purple-light {
    background: #f4f7fc;
  }

</style>

