/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const marketRouter = {
  path: '/market',
  component: Layout,
  redirect: 'noRedirect',
  name: 'Market',
  meta: {
    title: '行情',
    icon: 'component',
    roles: ['Market']
  },
  children: [
    {
      path: 'para-info',
      component: () => import('@/views/market/para/para-info.vue'),
      name: 'ParaInfo',
      meta: { title: '参数设置', noCache: true, roles: ['ParaInfo'] }
    }
    // },
    // {
    //   path: 'query-temp',
    //   component: () => import('@/views/market/temp/query-temp-list.vue'),
    //   name: 'QueryTempList',
    //   meta: { title: '模板设置', noCache: true }
    // }
  ]
}

export default marketRouter
