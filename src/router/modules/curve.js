/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const curveRouter = {
  path: '/curve',
  component: Layout,
  redirect: 'noRedirect',
  name: 'Curve',
  meta: {
    title: '曲线',
    icon: 'chart',
    roles: ['Curve']
  },
  children: [
    {
      path: 'curve-product',
      component: () => import('@/views/curve/product/curve-product-list.vue'),
      name: 'CurveProduct',
      meta: { title: '曲线产品', noCache: true, roles: ['CurveProduct'] }
    }, {
      path: 'curve-set-hisindex',
      component: () => import('@/views/curve/set/curve-set-hisindex.vue'),
      name: 'CurveSetHisIndex',
      meta: { title: '计算历史分位点', noCache: true, roles: ['CurveSetHisIndex'] }
    }, {
      path: 'curve-compute-index',
      component: () => import('@/views/curve/compute/curve-compute-index.vue'),
      name: 'CurveComputeIndex',
      meta: { title: '产品收益率计算', noCache: true }
    }, {
      path: 'curve-order-check-index',
      component: () => import('@/views/curve/check/curve-order-check-index.vue'),
      name: 'CurveOrderCheckIndex',
      meta: { title: '质检报告', noCache: true }
    }, {
      path: 'curve-set-homology',
      component: () => import('@/views/curve/set/curve-set-homology.vue'),
      name: 'CurveSetHomology',
      meta: { title: '设置同调曲线', noCache: true }
    }, {
      path: 'curve-set-refer',
      component: () => import('@/views/curve/set/curve-set-refer.vue'),
      name: 'CurveSetHomology',
      meta: { title: '设置参考曲线', noCache: true }
    }, {
      path: 'curve-task-rules',
      component: () => import('@/views/curve-task/task-rules'),
      name: 'CurveTaskRules',
      meta: { title: '分配曲线规则', noCache: true }
    }, {
      path: 'curve-all-task',
      component: () => import('@/views/curve-task/all-task-list'),
      name: 'CurveAllTask',
      meta: { title: '曲线任务列表', noCache: true }
    }, {
      path: 'curve-my-task',
      component: () => import('@/views/curve-task/my-task-list'),
      name: 'CurveMyTask',
      meta: { title: '我的曲线任务', noCache: true }
    }, {
      path: 'curve-kdtemp-list',
      component: () => import('@/views/curve/timetemp/curve-kdtemp-list.vue'),
      name: 'CurveKdTempList',
      meta: { title: '关键期限模板', noCache: true }
    }, {
      path: 'curve-nktemp-list',
      component: () => import('@/views/curve/timetemp/curve-nktemp-list.vue'),
      name: 'CurveNkTempList',
      meta: { title: '远期期限模板', noCache: true }
    }, {
      path: 'curve-search-case',
      component: () => import('@/views/curve/report/curve-search-solutions.vue'),
      name: 'CurveSearchCase',
      meta: { title: '查询曲线方案', noCache: true }
    }, {
      path: 'curve-timecmp-index',
      component: () => import('@/views/curve/compute/curve-timecmp-index.vue'),
      name: 'CurveTimecmpIndex',
      meta: { title: '估值曲线协同计算', noCache: true }
    }, {
      path: 'curve-sampleticket-list',
      component: () => import('@/views/curve/report/curve-sampleticket-list.vue'),
      name: 'CurveSampleTicketList',
      meta: { title: '查询曲线样本券', noCache: true }
    }, {
      path: 'curve-set-creditdebt',
      component: () => import('@/views/curve/creditdebt/curve-set-creditdebt.vue'),
      name: 'CurveSetCreditdebt',
      meta: { title: '设置信用债初始化方案', noCache: true }
    }
  ]
}

export default curveRouter
