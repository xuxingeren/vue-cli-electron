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
  }, {
    path: '/main/update',
    name: 'mainuUpdate',
    component: () => import('@/views/main/update'),
    meta: {
      title: '更新',
      icon: 'CloudDownloadOutlined'
    }
  }]
}]