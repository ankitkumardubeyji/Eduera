import React, { useState } from "react";
import { FiMenu } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { AiFillCloseCircle } from "react-icons/ai";
import Footer from "../Components/Footer";
import { useDispatch, useSelector } from "react-redux";


import { Outlet } from 'react-router-dom'  // outlet will only change other than that everything will stay same in the layout.



// beause of the outlet automatic by react-router-dom there will be nesting
function Layout(){

  const navigate = useNavigate()
 
 // function to hide the drawer on close button click
 const hideDrawer = () => {
    const element = document.getElementsByClassName("drawer-toggle");
    element[0].checked = false;

    // collapsing the drawer-side width to zero
    const drawerSide = document.getElementsByClassName("drawer-side");
    drawerSide[0].style.width = 0;
  };

  // function for changing the drawer width on menu button click
  const changeWidth = () => {
    const drawerSide = document.getElementsByClassName("drawer-side");
    drawerSide[0].style.width = "auto"; // will work as the fit content
  };


    return(
        <>
         <div className="min-h-[90vh] bg-black ">
      {/* adding the daisy ui drawer */}
      <div className="drawer absolute z-50 left-0 w-fit h-100vh" style={{flexBasis:"60"}}>
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          <label htmlFor="my-drawer" className="cursor-pointer relative">
            <FiMenu
              onClick={changeWidth}
              size={"32px"}
              className="font-bold text-white m-4"
            />
          </label>
        </div>

        <div className="drawer-side  w-auto">
          <label htmlFor="my-drawer" className="drawer-overlay"></label>
          <ul className="menu p-4 w-48 sm:w-80 bg-base-100 text-base-content relative h-screen" style={{backgroundColor:"#4C4E52",color:"white"}}>
    {/* list items here */}

            {/* close button for drawer */}
            <li className="w-fit absolute right-2 z-50">
              <button onClick={hideDrawer}>
                <AiFillCloseCircle size={24} />
              </button>
            </li>

            <li>
              <Link to={"/"}>Home</Link>
            </li>

           

            <li>
              <Link to={"/courses"}>All Courses</Link>
            </li>

            <li>
              <Link to={"/contact"}>Contact Us</Link>
            </li>

            <li>
              <Link to={"/about"}>About Us</Link>
            </li>

            {!true && (
              <li className="absolute bottom-4 w-[90%]">
                <div className="w-full flex items-center justify-center">
                  <button className="btn-primary px-4 py-1 font-semibold rounded-md w-full">
                    <Link to={"/login"}>Login</Link>
                  </button>
                  <button className="btn-secondary px-4 py-1 font-semibold rounded-md w-full">
                    <Link to={"/signup"}>Signup</Link>
                  </button>
                </div>
              </li>
            )}

            {/* if user is logged in */}
            {true&& (
              <li className="absolute bottom-4 w-[90%]">
                <div className="w-full flex items-center justify-center">
                  <button className="btn-primary px-4 py-1 font-semibold rounded-md w-full">
                    <Link to={"/user/profile"} style={{backgroundColor:"red", padding:"5px 5px"}}>Profile</Link>
                  </button>
                  <button className="btn-secondary px-4 py-1 font-semibold rounded-md w-full blue-background" onClick={()=>navigate("/login")}>

                    <Link  style={{backgroundColor:"blue", padding:"5px 5px"}} onClick={()=>navigate("/login")}>Logout</Link>
                  </button>
                </div>
              </li>
            )}

            </ul>
            </div>
            
            </div>
            <Outlet/>   
          
            </div>
            <Footer/> 
           
           
        </>
    )
}

export default Layout;