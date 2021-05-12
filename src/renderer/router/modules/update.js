import Layout from '@/Layout/index'

export default [{
  path: '/update',
  name: 'Update',
  component: Layout,
  meta: {
    title: '更新',
    icon: 'CloudDownloadOutlined'
  },
  children: [{
    path: '/update/full',
    name: 'updateFull',
    component: () => import('@/views/update/full'),
    meta: {
      title: '全量更新',
      icon: 'CloudDownloadOutlined'
    }
  }, {
    path: '/update/increment',
    name: 'updateIncrement',
    component: () => import('@/views/update/increment'),
    meta: {
      title: '增量更新',
      icon: 'CloudDownloadOutlined'
    }
  }]
}]