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
    }, {
      path: 'order-info-form',
      component: () => import('@/views/common/order-info/order-info-form.vue'),
      name: 'OrderInfoForm'
    }
  ]
}

export default commonsRouter
