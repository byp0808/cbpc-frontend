/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const taskRouter = {
  path: '/task',
  component: Layout,
  redirect: 'noRedirect',
  name: 'Task',
  children: [
    {
      path: 'rec-curve-task',
      component: () => import('@/views/valuation/rec-cure/rec-curve-task.vue'),
      name: 'RecCurveTask'
    }, {
      path: 'curve-sample-task',
      component: () => import('@/views/curve/sample/curve-sample-task.vue'),
      name: 'CurveSampleTask'
    }, {
      path: 'curve-relaion-task',
      component: () => import('@/views/valuation/curve-relation/curve-relation-task.vue'),
      name: 'curveRelaionTask'
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
      name: 'c'
    }, {
      path: 'personnel-set-task',
      component: () => import('@/views/valuation/task-allocation/personnel-set-task.vue'),
      name: 'PersonnelSetTask'
    }
  ]
}

export default taskRouter
