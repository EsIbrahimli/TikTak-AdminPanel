
import { Routes,Route } from 'react-router-dom'
import { ROUTES } from './common/constant/router'
import { Suspense,lazy } from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './App.css'

// lazy-loaded page components
const Login = lazy(() => import('./pages/Login/Login'))
const Orders = lazy(() => import('./pages/Orders/Orders'))
const Campaigns = lazy(() => import('./pages/Campaigns/Campaigns'))
const Categories = lazy(() => import('./pages/Categories/Categories'))
const Products = lazy(() => import('./pages/Products/Products'))
const Users = lazy(() => import('./pages/Users/Users'))
const Logout = lazy(() => import('./pages/Logout/Logout'))


function App() {

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path={ROUTES.LOGIN} element={<Login />} />
          <Route path={ROUTES.ORDERS} element={<Orders />} />
          <Route path={ROUTES.CAMPAIGNS} element={<Campaigns />} />
          <Route path={ROUTES.CATEGORIES} element={<Categories />} />
          <Route path={ROUTES.PRODUCTS} element={<Products />} />
          <Route path={ROUTES.USERS} element={<Users />} />
          <Route path={ROUTES.LOGOUT} element={<Logout />} />
        </Routes>
      </Suspense>

      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  )
}

export default App
