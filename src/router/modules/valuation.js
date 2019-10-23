/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const valuationRouter = {
  path: '/valuation',
  component: Layout,
  redirect: 'noRedirect',
  name: 'Valuation',
  meta: {
    title: '估值',
    icon: 'evaluation',
    roles: ['Valuation']
  },
  children: [
    {
      path: 'prod-list',
      component: () => import('@/views/valuation/prod/prod-list.vue'),
      name: 'ValuationProdList',
      meta: { title: '估值产品列表', noCache: true, roles: ['ValuationProdList'] }
    },
    {
      path: 'prod-form',
      component: () => import('@/views/valuation/prod/prod-form.vue'),
      name: 'ValuationProdForm',
      hidden: true,
      meta: { title: '估值产品新增', noCache: true, breadcrumb: false }
    },
    {
      path: 'prod-detail',
      component: () => import('@/views/valuation/prod/prod-detail.vue'),
      name: 'ValuationProdDetail',
      hidden: true,
      meta: { title: '估值产品详情', noCache: true }
    },
    {
      path: 'rec-curve',
      component: () => import('@/views/valuation/rec-cure/rec-curve-list.vue'),
      name: 'ValuationRecCurve',
      meta: { title: '设置曲线推荐规则', noCache: true, roles: ['ValuationRecCurve'] }
    },
    {
      path: 'rec-curve-form',
      component: () => import('@/views/valuation/rec-cure/rec-curve-form.vue'),
      name: 'RecCurveForm'
    }, {
      path: 'curveList',
      component: () => import('@/views/valuation/curve-relation/curve-relation-list.vue'),
      name: 'ValuationCurveRelationList',
      meta: { title: '估值相对曲线设置', noCache: true, roles: ['ValuationCurveRelationList'] }
    }, {
      path: 'rec-mandatory-list',
      component: () => import('@/views/valuation/rec-mandatory/rec-mandatory-list.vue'),
      name: 'ValuationMandatoryList',
      meta: { title: '设置估值强制推荐规则', noCache: true, roles: ['ValuationMandatoryList'] }
    }, {
      path: '/rec-mandatory-form',
      component: () => import('@/views/valuation/rec-mandatory/rec-mandatory-form.vue'),
      name: 'mandatoryForm'
    }, {
      path: 'bonds-nonp-list',
      component: () => import('@/views/valuation/bonds-nonp/bonds-nonp-list.vue'),
      name: 'ValuationBondsNonpList',
      meta: { title: '设置不参与估值资产列表', noCache: true, roles: ['ValuationBondsNonpList'] }
    }, {
      path: 'bonds-nonp-form',
      component: () => import('@/views/valuation/bonds-nonp/bonds-nonp-form.vue'),
      name: 'BondsNonpForm'
    }, {
      path: 'date-set-list',
      component: () => import('@/views/valuation/date-set/date-set-list.vue'),
      name: 'ValuationDateSetList',
      meta: { title: '设置首次估值日列表', noCache: true, roles: ['ValuationDateSetList'] }
    }, {
      path: 'date-set-form',
      component: () => import('@/views/valuation/date-set/date-set-form.vue'),
      name: 'DateSetForm'
    }, {
      path: 'taskAllocation-list',
      component: () => import('@/views/valuation/task-allocation/task-allocation-tab.vue'),
      name: 'TaskAllocation',
      meta: { title: '设置任务分配规则', noCache: true, roles: ['ValuationTaskAllocationList'] }
    }, {
      path: '/scheme-form',
      component: () => import('@/views/valuation/scheme/scheme-method.vue'),
      name: 'ValuationSchemeMethod',
      meta: { title: '估值方案', noCache: true }
    }, {
      path: '/flow-recommend',
      component: () => import('@/views/valuation/flow-difference/flow-recommend.vue'),
      name: 'FlowDifference',
      meta: { title: '调整流动性点差', noCache: true, roles: ['FlowDifference'] }
    }, {
      path: 'scheme-task-allot',
      component: () => import('@/views/valuation/scheme/scheme-task-allot.vue'),
      name: 'SchemeTaskAllotList',
      meta: { title: '估值任务分配', noCache: true, roles: ['SchemeTaskAllotList'] }
    }, {
      path: 'query-valuation',
      component: () => import('@/views/valuation/query/query-valuation.vue'),
      name: 'QueryValuation',
      meta: { title: '查询估值', noCache: true, roles: ['QueryValuation'] }
    }, {
      path: 'query-countValuation',
      component: () => import('@/views/valuation/query/query-countValuation.vue'),
      name: 'QueryValuation',
      meta: { title: '查询估值方案', noCache: true, roles: ['QueryCountValuation'] }
    }, {
      path: 'report-manage',
      component: () => import('@/views/valuation/report/report-manage.vue'),
      name: 'ReportManage',
      meta: { title: '生成报告', noCache: true, roles: ['ReportManage'] }
    }, {
      path: 'report-form',
      component: () => import('@/views/valuation/report/report-form.vue'),
      name: 'ReportForm'
    }, {
      path: 'val-quality-index',
      component: () => import('@/views/valuation/quality/val-quality-index.vue'),
      name: 'ValQualityIndex',
      meta: { title: '质检报告', noCache: true }
    }, {
      path: 'scheme-construct',
      component: () => import('@/views/valuation/scheme/scheme-construct.vue'),
      name: 'SchemeConstruct',
      meta: { title: '分析影响因子', noCache: true }
    }, {
      path: 'publish-list',
      component: () => import('@/views/valuation/publish-bond/publish-list.vue'),
      name: 'PublishList',
      meta: { title: '计算并发布估值产品', noCache: true }
    }
  ]
}

export default valuationRouter
