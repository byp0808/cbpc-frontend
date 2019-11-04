/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const productRouter = {
  path: '/product',
  component: Layout,
  redirect: 'noRedirect',
  name: 'Product',
  meta: {
    title: '产品',
    icon: 'component',
    roles: ['Product']
  },
  children: [
    {
      path: 'prod-view',
      component: () => import('@/views/common/product/prod-view.vue'),
      name: 'ProdView',
      meta: { title: '产品管理', noCache: true, roles: ['ProdView'] }
    },
    {
      path: 'order-info-list',
      component: () => import('@/views/common/order-info/order-info-list.vue'),
      name: 'OrderInfoList',
      meta: { title: '批次管理', noCache: true, roles: ['OrderInfoList'] }
    }
  ]
}

export default productRouter
