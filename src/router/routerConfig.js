import loadable from '@loadable/component';
const Home = loadable(() => import('../pages/Home/index'));
const videoSrt = loadable(() => import('../pages/Srt/videoSrt'));
const audioSrt = loadable(() => import('../pages/Srt/audioSrt.js'));
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
    path: '/videoSrt',
    exact: true,
    element: videoSrt,
    routes: []
  },
  {
    path: '/audioSrt',
    exact: true,
    element: audioSrt,
    routes: []
  }
]