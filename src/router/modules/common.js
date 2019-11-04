/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const commonsRouter = {
  path: '/commons',
  component: Layout,
  redirect: 'noRedirect',
  name: 'Commons',
  meta: {
    title: '公共',
    icon: 'component'
  },
  children: [
    {
      path: 'order-info-list',
      component: () => import('@/views/common/order-info/order-info-list.vue'),
      name: 'OrderInfoList',
      meta: { title: '编制批次', noCache: true, roles: ['OrderInfoList'] }
    },
    {
      path: 'order-info-form',
      component: () => import('@/views/common/order-info/order-info-form.vue'),
      name: 'OrderInfoForm'
    },
    {
      path: 'prod-view',
      component: () => import('@/views/common/product/prod-view.vue'),
      name: 'ProdView',
      meta: { title: '查询产品', noCache: true }
    },
    {
      path: 'audit-index',
      component: () => import('@/views/common/myAudit/audit-index.vue'),
      name: 'audit',
      meta: { title: '审核与复核', noCache: true }
    }
  ]
}

export default commonsRouter
