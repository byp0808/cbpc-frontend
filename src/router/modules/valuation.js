/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'
import MenuCtl from '@/views/menuctl'

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
      path: '/valuationQuery',
      name: 'ValuationQuery',
      component: MenuCtl,
      redirect: 'noRedirect',
      meta: { title: '估值查询', icon: 'chart', roles: ['ValuationQuery'] },
      children: [
        {
          path: 'query-valuation',
          component: () => import('@/views/valuation/query/query-valuation.vue'),
          name: 'QueryValuation',
          meta: { title: '估值数据', noCache: true, roles: ['QueryValuation'] }
        },
        {
          path: 'query-countValuation',
          component: () => import('@/views/valuation/query/query-countValuation.vue'),
          name: 'QueryCountValuation',
          meta: { title: '估值方案', noCache: true, roles: ['QueryCountValuation'] }
        }
      ]
    },
    {
      path: '/setvaluationfactor',
      name: 'Setvaluationfactor',
      component: MenuCtl,
      // component: Layout,
      redirect: 'noRedirect',
      meta: { title: '设置估值编制条件', icon: 'chart', roles: ['Setvaluationfactor'] },
      children: [
        {
          path: 'rec-curve',
          component: () => import('@/views/valuation/rec-cure/rec-curve-list.vue'),
          name: 'ValuationRecCurve',
          meta: { title: '曲线推荐规则', noCache: true, roles: ['ValuationRecCurve'] }
        },
        {
          path: 'curveList',
          component: () => import('@/views/valuation/curve-relation/curve-relation-list.vue'),
          name: 'ValuationCurveRelationList',
          meta: { title: '目标曲线和相对曲线关系', noCache: true, roles: ['ValuationCurveRelationList'] }
        },
        {
          path: 'rec-mandatory-list',
          component: () => import('@/views/valuation/rec-mandatory/rec-mandatory-list.vue'),
          name: 'ValuationMandatoryList',
          meta: { title: '估值强制推荐规则', noCache: true, roles: ['ValuationMandatoryList'] }
        },
        {
          path: 'date-set-list',
          component: () => import('@/views/valuation/date-set/date-set-list.vue'),
          name: 'ValuationDateSetList',
          meta: { title: '首次估值日规则', noCache: true, roles: ['ValuationDateSetList'] }
        },
        {
          path: 'bonds-nonp-list',
          component: () => import('@/views/valuation/bonds-nonp/bonds-nonp-list.vue'),
          name: 'ValuationBondsNonpList',
          meta: { title: '不参与估值资产规则', noCache: true, roles: ['ValuationBondsNonpList'] }
        },
        {
          path: 'taskAllocation-list',
          component: () => import('@/views/valuation/task-allocation/task-allocation-tab.vue'),
          name: 'TaskAllocation',
          meta: { title: '任务分配规则', noCache: true, roles: ['ValuationTaskAllocationList'] }
        },
        {
          path: '/flow-recommend',
          component: () => import('@/views/valuation/flow-difference/flow-recommend.vue'),
          name: 'FlowDifference',
          meta: { title: '流动性点差调整', noCache: true, roles: ['FlowDifference'] }
        }
      ]
    },
    {
      path: '/setvaluationscheme',
      name: 'SetValuationScheme',
      component: MenuCtl,
      redirect: 'noRedirect',
      meta: { title: '估值方案编制', icon: 'chart', roles: ['SetValuationScheme'] },
      children: [
        {
          path: 'scheme-alltask-allot',
          component: () => import('@/views/valuation/scheme/scheme-task-allot.vue'),
          name: 'SchemeTaskAllotList',
          meta: { title: '所有任务', noCache: true, roles: ['SchemeTaskAllotList'] }
        },
        {
          path: 'scheme-mytask-allot',
          component: () => import('@/views/valuation/scheme/scheme-task-allot.vue'),
          name: 'SchemeMyTaskAllotList',
          meta: { title: '我的任务', noCache: true, roles: ['SchemeMyTaskAllotList'] }
        },
        {
          path: 'scheme-construct',
          component: () => import('@/views/valuation/scheme/scheme-construct.vue'),
          hidden: true,
          name: 'SchemeConstruct',
          meta: { title: '分析影响因子', noCache: true, breadcrumb: false }
        },
        {
          path: 'publish-list',
          component: () => import('@/views/valuation/publish-bond/publish-list.vue'),
          name: 'PublishList',
          meta: { title: '计算发布', noCache: true, roles: ['PublishList'] }
        },
        {
          path: 'val-quality-index',
          component: () => import('@/views/valuation/quality/val-quality-index.vue'),
          name: 'ValQualityIndex',
          meta: { title: '质检报告', noCache: true, roles: ['ValQualityIndex'] }
        },
        {
          path: 'report-manage',
          component: () => import('@/views/valuation/report/report-manage.vue'),
          name: 'ValReportManage',
          meta: { title: '日评报告', noCache: true, roles: ['ValReportManage'] }
        }
      ]
    }
    /*   {
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
      path: 'rec-curve-form',
      component: () => import('@/views/valuation/rec-cure/rec-curve-form.vue'),
      name: 'RecCurveForm'
    }, {
      path: '/rec-mandatory-form',
      component: () => import('@/views/valuation/rec-mandatory/rec-mandatory-form.vue'),
      name: 'mandatoryForm'
    }, {
      path: 'bonds-nonp-form',
      component: () => import('@/views/valuation/bonds-nonp/bonds-nonp-form.vue'),
      name: 'BondsNonpForm'
    }, {
      path: 'date-set-form',
      component: () => import('@/views/valuation/date-set/date-set-form.vue'),
      name: 'DateSetForm'
    },
    {
      path: '/scheme-form',
      component: () => import('@/views/valuation/scheme/scheme-method.vue'),
      name: 'ValuationSchemeMethod',
      meta: { title: '估值方案', noCache: true }
    }, {
      path: 'report-form',
      component: () => import('@/views/valuation/report/report-form.vue'),
      name: 'ReportForm'
    }, {
      path: 'scheme-construct',
      component: () => import('@/views/valuation/scheme/scheme-construct.vue'),
      hidden: true,
      name: 'SchemeConstruct',
      meta: { title: '分析影响因子', noCache: true, breadcrumb: false }
    }*/
  ]
}

export default valuationRouter
