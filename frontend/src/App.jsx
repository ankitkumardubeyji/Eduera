import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Layout from './Layout/Layout'

import { Route,createBrowserRouter,createRoutesFromElements,RouterProvider,Navigate } from 'react-router-dom'
import Login from './Pages/User/Login'
import Register from './Pages/User/Register'

import Home from './Pages/User/Home'
import About from './Pages/User/About'
import Contact from './Pages/User/Contact'
import Courses from './Pages/Courses/CourseList'
import CourseDescription from './Pages/Courses/CourseDescription'
import DisplayLectures from './Pages/Dashboard/DisplayLecture'
import AddLectures from './Pages/Dashboard/AddLecture'

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
         <Route path='about' element ={<About/>} /> 
         <Route path='contact' element ={<Contact/>} /> 
         <Route path='courses'>
            <Route path='' element = {<Courses/>}/>
          </Route> 
          <Route path='course/description' element = {<CourseDescription/>}/>
          <Route path='course/displaylectures' element = {<DisplayLectures/>}/>
          <Route path='course/addlecture' element = {<AddLectures/>}/>
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
