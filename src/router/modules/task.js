/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const taskRouter = {
  path: '/task',
  component: Layout,
  redirect: 'noRedirect',
  name: 'Task',
  hidden: true,
  children: [
    {
      path: 'order-info-task',
      component: () => import('@/views/common/order-info/order-info-task.vue'),
      name: 'OrderInfoTask'
    }, {
      path: 'rec-curve-task',
      component: () => import('@/views/valuation/rec-cure/rec-curve-task.vue'),
      name: 'RecCurveTask'
    }, {
      path: 'curve-sample-task',
      component: () => import('@/views/curve/sample/curve-sample-task.vue'),
      name: 'CurveSampleTask'
    }, {
      path: 'curve-relation-task',
      component: () => import('@/views/valuation/curve-relation/curve-relation-task.vue'),
      name: 'CurveRelationTask'
    }, {
      path: 'valuation-prod-task',
      component: () => import('@/views/valuation/prod/prod-task.vue'),
      name: 'ValuationProdTask'
    }, {
      path: 'recForce-task',
      component: () => import('@/views/valuation/rec-mandatory/rec-mandatory-task.vue'),
      name: 'recForceTask'
    }, {
      path: 'curve-product-def-task',
      component: () => import('@/views/curve/product/curve-product-def-task.vue'),
      name: 'CurveProductDefTask'
    }, {
      path: 'date-set-task',
      component: () => import('@/views/valuation/date-set/date-set-task.vue'),
      name: 'DateSetTask'
    }, {
      path: 'bonds-nonp-task',
      component: () => import('@/views/valuation/bonds-nonp/bonds-nonp-task.vue'),
      name: 'BondsNonpTask'
    }, {
      path: 'rule-set-task',
      component: () => import('@/views/valuation/task-allocation/rule-set-task.vue'),
      name: 'RuleSetTask'
    }, {
      path: 'flow-task',
      component: () => import('@/views/valuation/flow-difference/flow-task.vue'),
      name: 'FlowTask'
    },
    {
      path: 'personnel-set-task',
      component: () => import('@/views/valuation/task-allocation/personnel-set-task.vue'),
      name: 'PersonnelSetTask'
    }, {
      path: 'curve-set-homology-task',
      component: () => import('@/views/curve/set/curve-set-homology-task.vue'),
      name: 'CurveSetHomologyTask'
    }, {
      path: 'curve-set-refer-task',
      component: () => import('@/views/curve/set/curve-set-refer-task.vue'),
      name: 'CurveSetReferTask'
    }, {
      path: 'curve-kdtemp-task',
      component: () => import('@/views/curve/timetemp/curve-kdtemp-task.vue'),
      name: 'KdTempTask'
    }, {
      path: 'curve-nktemp-task',
      component: () => import('@/views/curve/timetemp/curve-nktemp-task.vue'),
      name: 'NkTempTask'
    }
  ]
}

export default taskRouter
