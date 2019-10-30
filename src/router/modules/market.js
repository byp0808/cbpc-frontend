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
      path: 'primary-market-list',
      component: () => import('@/views/market/primary/primary-market-list.vue'),
      name: 'PrimaryMarketList',
      meta: { title: '一级发行', noCache: true, roles: ['primaryMarket'] }
    }, {
      path: 'secondary-market-list',
      component: () => import('@/views/market/secondary/secondary-market-list.vue'),
      name: 'SecondaryMarketList',
      meta: { title: '二级市场', noCache: true, roles: ['secondaryMarket'] }
    },
    {
      path: 'para-info',
      component: () => import('@/views/market/para/para-info.vue'),
      name: 'ParaInfo',
      meta: { title: '参数设置', noCache: true, roles: ['ParaInfo'] }
    },
    {
      path: 'query-temp',
      component: () => import('@/views/market/temp/query-temp-list.vue'),
      name: 'QueryTempList',
      meta: { title: '筛选模板设置', noCache: true, roles: ['queryTemp'] }
    }
  ]
}

export default marketRouter
