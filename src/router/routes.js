
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') }
    ]
  },
  {
    path: '/play/:id',
    name: 'play',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/play.vue') }
    ]
  },
  {
    path: '/join/:id?',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/game.vue') }
    ]
  },
  {
    path: '/new',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/game.vue') }
    ]
  },
  {
    path: '/expired',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/expired.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
