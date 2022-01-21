import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { routeConfig } from './routerConfig'

export const MyRouter = function () {
  return (
    <BrowserRouter>
      <Routes>
        {
          routeConfig.map((route, index) => {
            return (
              <Route path={route.path} key={index} element={<route.element></route.element>}></Route>
            )
          })
        }

      </Routes>
    </BrowserRouter>
  )
}