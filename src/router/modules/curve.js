/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'
import MenuCtl from '@/views/menuctl'

const curveRouter = {
  path: '/curve',
  component: Layout,
  redirect: 'noRedirect',
  name: 'Curve',
  meta: {
    title: '曲线',
    icon: 'chart',
    roles: ['Curve']
  },
  children: [
    {
      path: '/curveQuery',
      name: 'CurveQuery',
      component: MenuCtl,
      redirect: 'noRedirect',
      meta: { title: '曲线查询', icon: 'chart', roles: ['CurveQuery'] },
      children: [
        {
          path: 'curve-search-solutions',
          component: () => import('@/views/curve/report/curve-search-solutions.vue'),
          name: 'CurveSearchCase',
          meta: { title: '曲线数据', noCache: true, roles: ['CurveSearchCase'] }
        },
        {
          path: 'curve-sampleticket-list',
          component: () => import('@/views/curve/report/curve-sampleticket-list.vue'),
          name: 'CurveSampleTicketList',
          meta: { title: '曲线样本券', noCache: true, roles: ['CurveSampleTicketList'] }
        }
      ]
    },
    {
      path: '/setcurvefactor',
      name: 'SetCurvefactor',
      component: MenuCtl,
      meta: { title: '设置曲线编制条件', icon: 'chart', roles: ['SetCurvefactor'] },
      children: [
        {
          path: 'curve-set-refer',
          component: () => import('@/views/curve/set/curve-set-refer.vue'),
          name: 'CurveSetRefer',
          meta: { title: '参考曲线', noCache: true, roles: ['CurveSetRefer'] }
        }, {
          path: 'curve-set-homology',
          component: () => import('@/views/curve/set/curve-set-homology.vue'),
          name: 'CurveSetHomology',
          meta: { title: '同调曲线', noCache: true, roles: ['CurveSetHomology'] }
        }, {
          path: 'curve-set-rela',
          component: () => import('@/views/curve/set/curve-set-rela.vue'),
          name: 'CurveSetRela',
          meta: { title: '曲线间关系模板', noCache: true, roles: ['CurveSetRela'] }
        }, {
          path: 'curve-set-init',
          component: () => import('@/views/curve/set/curve-set-init.vue'),
          name: 'CurveSetInit',
          meta: { title: '信用债初始化方案', noCache: true, roles: ['CurveSetInit'] }
        }, {
          path: 'curve-set-hisindex',
          component: () => import('@/views/curve/set/curve-set-hisindex.vue'),
          name: 'CurveSetHisIndex',
          meta: { title: '历史分位点计算', noCache: true, roles: ['CurveSetHisIndex'] }
        }, {
          path: 'curve-task-rules',
          component: () => import('@/views/curve-task/task-rules'),
          name: 'CurveTaskRules',
          meta: { title: '曲线任务分配规则', noCache: true, roles: ['CurveTaskRules'] }
        }
      ]
    },
    {
      path: '/setcurvescheme',
      name: 'SetCurvescheme',
      component: MenuCtl,
      meta: { title: '曲线方案编制', icon: 'chart', roles: ['SetCurvescheme'] },
      children: [
        {
          path: 'curve-all-task',
          component: () => import('@/views/curve-task/all-task-list'),
          name: 'CurveAllTask',
          meta: { title: '所有任务', noCache: true, roles: ['CurveAllTask'] }
        }, {
          path: 'curve-my-task',
          component: () => import('@/views/curve-task/my-task-list'),
          name: 'CurveMyTask',
          meta: { title: '我的任务', noCache: true, roles: ['CurveMyTask'] }
        }, {
          path: 'curve-compute-index',
          component: () => import('@/views/curve/compute/curve-compute-index.vue'),
          name: 'CurveComputeIndex',
          meta: { title: '计算发布', noCache: true, roles: ['CurveComputeIndex'] }
        }, {
          path: 'curve-order-check-index',
          component: () => import('@/views/curve/check/curve-order-check-index.vue'),
          name: 'CurveOrderCheckIndex',
          meta: { title: '质检报告', noCache: true, roles: ['CurveQuality'] }
        }, {
          path: 'report-manage',
          component: () => import('@/views/valuation/report/report-manage.vue'),
          name: 'CurveReportManage',
          meta: { title: '日评报告', noCache: true, roles: ['CurveReportManage'] }
        }
      ]
    }
    /*    {
      path: 'curve-product',
      component: () => import('@/views/curve/product/curve-product-list.vue'),
      name: 'CurveProduct',
      meta: { title: '曲线产品', noCache: true, roles: ['CurveProduct'] }
    }, {
      path: 'curve-influence-factor',
      component: () => import('@/views/curve/influencefactor/curve-influence-factor-index.vue'),
      name: 'CurveInfluenceFactor',
      meta: { title: '曲线影响因子', noCache: true }
    }, {
      path: 'curve-set-rela-form',
      component: () => import('@/views/curve/set/curve-set-rela-form.vue'),
      name: 'CurveSetRelaForm',
      hidden: true,
      meta: { title: '曲线关系模板', noCache: true, breadcrumb: false }
    }*/
    // 20191104 废除
    // {
    //   path: 'curve-timecmp-index',
    //   component: () => import('@/views/curve/compute/curve-timecmp-index.vue'),
    //   name: 'CurveTimecmpIndex',
    //   meta: { title: '估值曲线协同计算', noCache: true }
    // }
  ]
}

export default curveRouter
