import Layout from '@/Layout/index'

export default [{
	path: '/shortcon',
	name: 'Shortcon',
	component: Layout,
	redirect: '/shortcon/index',
	meta: {
		title: '快捷键',
		icon: 'AppstoreAddOutlined'
	},
	children: [{
		path: '/shortcon/index',
		name: 'ShortconIndex',
		component: () => import('@/views/shortcon'),
		meta: {
			title: '菜单与快捷键',
			icon: 'AppstoreAddOutlined'
		}
	}]
}]