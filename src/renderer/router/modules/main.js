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
    path: '/main/subScreen',
    name: 'mainSubScreen',
    component: () => import('@/views/main/subScreen'),
    meta: {
      title: '窗口通信与拓展屏',
      icon: 'BlockOutlined'
    }
  }]
}]