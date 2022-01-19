import loadable from '@loadable/component';
const Srt = loadable(() => import('../pages/Srt/index'));
export const routeConfig = [
  {
    path: '/',
    exact: true,
    element: Srt,
    routes: []
  }
]