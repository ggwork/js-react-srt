import loadable from '@loadable/component';
const Home = loadable(() => import('../pages/Home/index'));
const Srt = loadable(() => import('../pages/Srt/index'));
const Me = loadable(() => import('../pages/Me/index'));
export const routeConfig = [
  {
    path: '/',
    exact: true,
    element: Home,
    routes: []
  },
  {
    path: '/me',
    exact: true,
    element: Me,
    routes: []
  },
  {
    path: '/srt',
    exact: true,
    element: Srt,
    routes: []
  }
]