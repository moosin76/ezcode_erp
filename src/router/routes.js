const routes = [
	{
		path: '/',
		name: 'Home',
		component: () => import(/* webpackChunkName: "home" */ '../views/Home.vue')
	},
	{
		path: '/about',
		name: 'About',
		component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
	},
	{
		path: '/board',
		name: 'Board',
		component: () => import(/* webpackChunkName: "board" */ '../views/board/list.vue')
	},
	{
		path: '/storage',
		name: 'Storage',
		component: () => import(/* webpackChunkName: "storage" */ '../views/storage.vue')
	},
	{
		path: '/editor',
		name: 'Editor',
		component: () => import(/* webpackChunkName: "editor" */ '../views/editor.vue')
	},
	{
		path: '/:collection/:document',
		name: 'CollectionDocument',
		component: () => import(/* webpackChunkName: "collection_document" */ '../views/renderer.vue')
	},
	{
		path: '/:collection/:document/:action',
		name: 'CollectionDocumentAction',
		component: () => import(/* webpackChunkName: "collection_document_action " */ '../views/renderer.vue')
	},
	{
		path: '*',
		name: 'error',
		component: () => import(/* webpackChunkName: "error" */ '../views/error.vue')
	},
]

export default routes;