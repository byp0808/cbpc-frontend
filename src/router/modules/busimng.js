/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'
import MenuCtl from '@/views/menuctl'

const busimngRouter = {
  path: '/busimng',
  component: Layout,
  redirect: 'noRedirect',
  name: 'Busimng',
  meta: {
    title: '业务管理',
    icon: 'component',
    roles: ['Busimng']
  },
  children: [
    {
      path: 'temp-mng',
      component: MenuCtl,
      name: 'TempMng',
      meta: { title: '模板管理', noCache: true, roles: ['TempMng'] },
      children: [
        {
          path: 'tmpl-filter',
          component: () => import('@/views/common/bond-filter/templates.vue'),
          name: 'TmplFilter',
          meta: { title: '债券筛选模板管理', noCache: true, roles: ['TmplFilter'] }
        },
        {
          path: 'curve-kdtemp-list',
          component: () => import('@/views/curve/timetemp/curve-kdtemp-list.vue'),
          name: 'CurveKdTempList',
          meta: { title: '关键期限模板管理', noCache: true, roles: ['CurveKdTempList'] }
        },
        {
          path: 'curve-nktemp-list',
          component: () => import('@/views/curve/timetemp/curve-nktemp-list.vue'),
          name: 'CurveNkTempList',
          meta: { title: '远期期限模板管理', noCache: true, roles: ['CurveNkTempList'] }
        }
      ]
    }
  ]
}

export default busimngRouter
