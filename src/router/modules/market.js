/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'
import MenuCtl from '@/views/menuctl'

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
      meta: { title: '一级市场', noCache: true, roles: ['primaryMarket'] }
    }, {
      path: 'secondary-market',
      component: MenuCtl,
      name: 'SecondaryMarket',
      meta: { title: '二级市场', noCache: true, roles: ['secondaryMarket'] },
      children: [
        {
          path: 'secondary-market-list',
          component: () => import('@/views/market/secondary/secondary-market-list.vue'),
          name: 'SecondaryMarketList',
          meta: { title: '概览', noCache: true, roles: ['SecondaryMarketList'] }
        },
        {
          path: 'para-info',
          component: () => import('@/views/market/para/para-info.vue'),
          name: 'ParaInfo',
          meta: { title: '资产行情参数', noCache: true, roles: ['ParaInfo'] }
        }
      ]
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
