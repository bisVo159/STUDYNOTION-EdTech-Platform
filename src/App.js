import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home"
import Navbar from "./components/common/Navbar"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import ForgotPassword from "./pages/ForgotPassword";
import OpenRoute from "./components/core/Auth/OpenRoute";
import UpdatePassword from "./pages/UpdatePassword";
import VerifyEmail from "./pages/VerifyEmail";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/core/Auth/PrivateRoute";
import Error from "./pages/Error"
import MyProfile from "./components/core/Dashboard/MyProfile"
import Contact from "./pages/Contact"
import EnrolledCourses from "./components/core/Dashboard/EnrolledCourses";
import Cart from "./components/core/Dashboard/Cart";
import { ACCOUNT_TYPE } from "./utils/constants";
import { useSelector } from "react-redux";

function App() {
  const {user}=useSelector(state=>state.profile)
  return (
    <div className="w-screen min-h-screen bg-richblue-900 flex flex-col font-inter">
      <Navbar/>
      <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="login"
              element={
                <OpenRoute>
                  <Login />
                </OpenRoute>
              }
             />
            <Route path="signup" 
            element={
            <OpenRoute>
              <Signup/>
            </OpenRoute>
            }/>

            <Route path="forgot-password" 
            element={
            <OpenRoute>
              <ForgotPassword/>
            </OpenRoute>
            }/>

            <Route path="update-password/:id" 
            element={
            <OpenRoute>
              <UpdatePassword/>
            </OpenRoute>
            }/>

            <Route path="verify-email" 
            element={
            <OpenRoute>
              <VerifyEmail/>
            </OpenRoute>
            }/>

            <Route path="about" 
            element={
              <About/>
            }/>
            <Route path="/contact" element={<Contact />} />
            <Route path="dashboard"
             element={
              <PrivateRoute>
                   <Dashboard/>
              </PrivateRoute>
              }>
                <Route path="my-profile" element={<MyProfile/>}/>
                {
                  user?.accountType===ACCOUNT_TYPE.STUDENT&&(
                    <>
                      <Route path="enrolled-courses" element={<EnrolledCourses/>}/>
                      <Route path="cart" element={<Cart/>}/>
                    </>
                  )
                }
              <Route path="*"  element={<Error/>}/>
              </Route>

              <Route
              path="*"
              element={<Error/>}
              />
      </Routes>
    </div>
  );
}

export default App;
