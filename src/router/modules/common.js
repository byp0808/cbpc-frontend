/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const commonsRouter = {
  path: '/commons',
  component: Layout,
  redirect: 'noRedirect',
  name: 'Commons',
  meta: {
    title: '公共',
    icon: 'common'
  },
  children: [
    {
      path: 'bond-filter',
      component: () => import('@/views/common/bond-filter/filter.vue'),
      name: 'BondFilter',
      meta: { title: '债券筛选器', noCache: true }
    }
  ]
}

export default commonsRouter
