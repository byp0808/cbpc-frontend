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
      path: 'curve-all-task',
      component: () => import('@/views/curve-task/AllTaskList'),
      name: 'CurveAllTask',
      meta: { title: '曲线任务列表', noCache: true }
    }, {
      path: 'curve-my-task',
      component: () => import('@/views/curve-task/MyTaskList'),
      name: 'CurveMyTask',
      meta: { title: '我的曲线任务', noCache: true }
    }
  ]
}

export default curveRouter
