/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const valuationRouter = {
  path: '/valuation',
  component: Layout,
  redirect: 'noRedirect',
  name: 'Valuation',
  meta: {
    title: '估值',
    icon: 'common'
  },
  children: [
    {
      path: 'prod-list',
      component: () => import('@/views/valuation/prod/prod-list.vue'),
      name: 'ValuationProdList',
      meta: { title: '估值产品列表', noCache: true }
    },
    {
      path: 'prod-form',
      component: () => import('@/views/valuation/prod/prod-form.vue'),
      name: 'ValuationProdForm',
      meta: { title: '估值产品新增', noCache: true }
    },
    {
      path: 'prod-detail',
      component: () => import('@/views/valuation/prod/prod-detail.vue'),
      name: 'ValuationProdDetail',
      meta: { title: '估值产品详情', noCache: true }
    },
    {
      path: 'rec-curve',
      component: () => import('@/views/valuation/rec-cure/rec-curve-list.vue'),
      name: 'BondFilter',
      meta: { title: '设置曲线推荐规则', noCache: true }
    },
    {
      path: 'rec-curve-form',
      component: () => import('@/views/valuation/rec-cure/rec-curve-form.vue'),
      name: 'BondFilter'
    }, {
      path: '/curveList',
      component: () => import('@/views/valuation/curve-relation/curve-relation-list.vue'),
      name: 'Table',
      meta: { title: '估值相对曲线设置' }
    }
  ]
}

export default valuationRouter
