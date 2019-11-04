/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const mytaskRouter = {
  path: '/mytask',
  component: Layout,
  redirect: 'noRedirect',
  name: 'Mytask',
  meta: {
    title: '我的',
    icon: 'component',
    roles: ['Mytask']
  },
  children: [
    {
      path: 'audit-approve',
      component: () => import('@/views/common/myAudit/audit-index.vue'),
      name: 'auditApprove',
      meta: { title: '我的审核', noCache: true, roles: ['auditApprove'] }
    },
    {
      path: 'audit-all',
      component: () => import('@/views/common/myAudit/audit-index.vue'),
      name: 'auditAll',
      hidden: true,
      meta: { title: '审核和复核', noCache: true, roles: ['auditApprove'] }
    },
    {
      path: 'audit-review',
      component: () => import('@/views/common/myAudit/audit-index.vue'),
      name: 'auditReview',
      meta: { title: '我的复核', noCache: true, roles: ['auditReview'] }
    }
  ]
}

export default mytaskRouter
