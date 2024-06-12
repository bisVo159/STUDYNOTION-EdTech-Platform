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
import AddCourse from "./components/core/Dashboard/AddCourse";
import Settings from "./components/core/Dashboard/Settings";
import MyCourses from "./components/core/Dashboard/MyCourses";
import EditCourse from "./components/core/Dashboard/EditCourse";
import Catalog from "./pages/Catalog";
import CourseDetails from "./pages/CourseDetails";
import ViewCourse from "./pages/ViewCourse";
import VideoDetails from "./components/core/ViewCourse/VideoDetails";

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
                <Route path="settings" element={<Settings/>}/>
                {
                  user?.accountType===ACCOUNT_TYPE.STUDENT&&(
                    <>
                      <Route path="enrolled-courses" element={<EnrolledCourses/>}/>
                      <Route path="purchase-history" element={<Cart/>}/>
                    </>
                  )
                }
                {
                  user?.accountType===ACCOUNT_TYPE.INSTRUCTOR&&(
                    <>
                      <Route path="add-course" element={<AddCourse/>}/>
                      <Route path="my-courses" element={<MyCourses/>}/>
                      <Route path="edit-course/:courseId" element={<EditCourse/>}/>
                    </>
                  )
                }
              <Route path="*"  element={<Error/>}/>
              </Route>

              <Route path='catalog/:catalogName' element={<Catalog/>}/>
              <Route path='courses/:courseId' element={<CourseDetails/>}/>

            <Route
              element={
                <PrivateRoute>
                  <ViewCourse/>
                </PrivateRoute>
              }
              >
                {
                  user?.accountType===ACCOUNT_TYPE.STUDENT&&
                  <>
                    <Route path="/view-course/:courseId/section/:sectionId/sub-section/:subSectionId"
                    element={<VideoDetails/>}
                    />
                  </>
                }
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
