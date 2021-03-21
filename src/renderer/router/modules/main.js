import Layout from '@/Layout/index'

export default [{
  path: '/main',
  name: 'Main',
  redirect: '/main/close',
  component: Layout,
  meta: {
    title: '主线程',
    icon: 'PartitionOutlined'
  },
  children: [{
    path: '/main/close',
    name: 'mainClose',
    component: () => import('@/views/main/close'),
    meta: {
      title: '窗口关闭',
      icon: 'CloseCircleOutlined'
    }
  }, {
    path: '/main/tary',
    name: 'mainTary',
    component: () => import('@/views/main/tary'),
    meta: {
      title: '托盘',
      icon: 'ProfileOutlined'
    }
  }]
}, {
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
  }]
}]