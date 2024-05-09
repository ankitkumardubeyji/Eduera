import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Layout from './Layout/Layout'

import { Route,createBrowserRouter,createRoutesFromElements,RouterProvider,Navigate } from 'react-router-dom'
import Login from './Pages/User/Login'
import Register from './Pages/User/Register'

import Home from './Pages/User/Home'

const RequireAuth = ({ children }) => {
  const data = JSON.parse(localStorage.getItem("data"))
  console.log(data)
  if(data===null || data === undefined || Object.keys(data).length === 0){
   
    return  <Navigate to="/login" />;
  }
  
  return children
};
function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<Layout />}> {/* at the top level of nesting giving the layout hence the below oulets are able to come automatically */}
        <Route path='' element={<RequireAuth><Home /></RequireAuth>} />
        <Route path='login' element={<Login />} />
        <Route path='register' element={<Register />} /> {/* when comes the /about Abou component passed as outlet */} 

        
      </Route>
    )
  )
 
  return (
    <>
    
      <RouterProvider router = {router}/>
  
    </>
  )
}

export default App
