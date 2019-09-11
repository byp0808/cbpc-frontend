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
    }
  ]
}

export default taskRouter
