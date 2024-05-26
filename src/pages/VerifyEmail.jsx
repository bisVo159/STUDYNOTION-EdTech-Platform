import { useDispatch, useSelector } from "react-redux";
import OtpInput from "react-otp-input";
import { useState } from "react";
import Button from "../components/core/HomePage/Button";
import { sendOtp, signUp } from "../services/operations/authAPI";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

function VerifyEmail() {
  const {loading,signupData}=useSelector(state=>state.auth)
  const [otp,setOtp]=useState("")
  const dispatch=useDispatch()
  const navigate=useNavigate()

  useEffect(()=>{
    if(!signupData) navigate("/login")
  },[])

  const handleOnSubmit=(e)=>{
    e.preventDefault()
    const {
      accountType,
      firstName,
      lastName,
      email,
      password,
      confirmPassword
    }=signupData

    dispatch(signUp(
      accountType,firstName,lastName,email,password,confirmPassword,otp,navigate
    ))

  }

  return (
    <div className="text-white flex justify-center">
        {
                loading?(
                  <div className="spinner"></div>
                ):(
                  <div>
                    <h1>Verify Email</h1>
                    <p>A verification email has been sent to you. Enter the code below.</p>
                    <form onSubmit={handleOnSubmit}>
                    <OtpInput
                        value={otp}
                        onChange={setOtp}
                        numInputs={6}
                        renderSeparator={<span>-</span>}
                        renderInput={(props) => (<input {...props}
                        className="bg-richblue-600 text-richblack-5" 
                         />)}
                      />
          
                      <button type="submit">
                        Verify Email
                      </button>
                    </form>
          
                    <div>
                      <div>
                          <Link to={"/login"}>
                                <p>Back to Login</p>
                          </Link>
                      </div>
          
                      <button
                      onClick={()=>dispatch(sendOtp(signupData.email,navigate))}
                      >
                        Resend it
                      </button>
                    </div>
                  </div>
                )
        }
    </div>
  );
}

export default VerifyEmail;