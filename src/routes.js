import Util from './common/js/util'


let routes = [{
        path: '/404',
        component: () => import('./views/404'),
        name: '',
        hidden: true
    },
    {
        path: '/',
        component: () => import('./views/Login'),
        name: '',
        hidden: true,
    },
    {
        path: '/login',
        component: () => import('./views/Login'),
        name: '',
        hidden: true
    },
]

if (sessionStorage.getItem('userPermission')) {
    let userPermissionList = JSON.parse(sessionStorage.getItem('userPermission'))
    let dyRoutes = [{
        path: '',
        component: () => import('@/views/Main'),
        name: '',
        children: []
    }]
    dyRoutes[0].children = Util.createRouter(userPermissionList)
    dyRoutes.push({
        path: '*',
        hidden: true,
        redirect: {
            path: '/404'
        }
    }, )

    routes = routes.concat(dyRoutes)
}
console.dir(routes)
export default routes