/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const curveRouter = {
  path: '/curve',
  component: Layout,
  redirect: 'noRedirect',
  name: 'Curve',
  meta: {
    title: '曲线',
    icon: 'chart'
  },
  children: [
    {
      path: 'curve-product',
      component: () => import('@/views/curve/product/curve-product-list.vue'),
      name: 'CurveProduct',
      meta: { title: '曲线产品', noCache: true }
    }, {
      path: 'curve-product-def',
      component: () => import('@/views/curve/product/curve-product-def-form.vue'),
      name: 'CurveProductDef',
      meta: { title: '曲线产品定义', noCache: true }
    }, {
      path: 'curve-set-hisindex',
      component: () => import('@/views/curve/set/curve-set-hisindex.vue'),
      name: 'CurveSetHisIndex',
      meta: { title: '计算历史分位点', noCache: true }
    }
  ]
}

export default curveRouter
