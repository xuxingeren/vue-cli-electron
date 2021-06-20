import Layout from '@/Layout/index'

export default [{
	path: '/file',
	name: 'File',
	component: Layout,
	redirect: '/file/localFile',
	meta: {
		title: '文件处理',
		icon: 'FileOutlined'
	},
	children: [{
		path: '/file/localFile',
		name: 'LocalFile',
		component: () => import('@/views/file/localFile'),
		meta: {
			title: '本地文件',
			icon: 'FileImageOutlined'
		}
	}, {
		path: '/file/extensions',
		name: 'Extensions',
		component: () => import('@/views/file/extensions'),
		meta: {
			title: '拓展展示',
			icon: 'PartitionOutlined'
		}
	}]
}]