import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate,Link } from "react-router-dom";
import { validateAccount } from "../../Redux/authSlice";
function Login(){


    const dispatch = useDispatch()
    const navigate = useNavigate() 

    const [loginData,setLoginData] = useState({
        email:"",
        password:"" 
    })

   
    function handleUserInput(e){
        const { name, value } = e.target;
        setLoginData({
            ...loginData,
            [name]: value 
        });
    }

    function handleLogin(e){
        e.preventDefault()
        if(!loginData.email || !loginData.password){
          toast.error("Please fill all fields");
          return; 
        }

        dispatch(validateAccount(loginData)).then(()=>navigate("/"))

        setLoginData({
            email:"",
            password:"", 
        })
    }


    return(
        <>
             <div className="flex items-center justify-center h-[100vh] m-auto">
        <form
          onSubmit={handleLogin}
          className="flex flex-col justify-center gap-4 rounded-lg p-4 text-white w-80 h-[26rem] shadow-[0_0_10px_black]"
        >
          <h1 className="text-center text-2xl font-bold">Login Page</h1>
          <div className="flex flex-col gap-1">
            <label className="text-lg font-semibold" htmlFor="email">
              Email
            </label>
            <input
              required
              type="email"
              name="email"
              id="email"
              placeholder="Enter your email"
              className="bg-transparent px-2 py-1 border"
             value={loginData.email}
              onChange={handleUserInput}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-lg font-semibold" htmlFor="password">
              Password
            </label>
            <input
              required
              type="password"
              name="password"
              id="password"
              placeholder="Enter your password"
              className="bg-transparent px-2 py-1 border"
              value={loginData.password}
              onChange={handleUserInput}
            />
          </div>

          {/* guest account access */}
          <div
            onClick={() =>
              setLoginData({ email: "test@gmail.com", password: "Test@123" })
            }
            className="text-center link text-accent cursor-pointer"
          >
            Guest Login
          </div>

          <button
            className="w-full bg-yellow-600 hover:bg-yellow-500 transition-all ease-in-out duration-300 rounded-sm py-2 font-semibold text-lg cursor-pointer"
            type="submit"
          >
            Login
          </button>

          <Link to={"/forgetpassword"}>
            <p className="text-center link text-accent cursor-pointer">
              Forget Password
            </p>
          </Link>

          <p className="text-center">
            Don't have an account ?{" "}
            <Link to={"/register"} className="link text-accent cursor-pointer">
              Create Account
            </Link>
          </p>
        </form>
      </div>
        </>
    )
}


export default Login;