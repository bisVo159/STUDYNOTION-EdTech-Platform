import { Link, matchPath } from "react-router-dom";
import logo from "../../assets/Logo/Logo-Full-Light.png"
import {NavbarLinks} from "../../data/navbar-links"
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { ACCOUNT_TYPE } from "../../utils/constants";
import { AiOutlineShoppingCart } from "react-icons/ai";
import ProfileDropDown from "../core/Auth/ProfileDropDown";
import { useState,useEffect } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { fetchCourseCategories } from "../../services/operations/courseDetailsAPI";

const Navbar=()=>{

    const {token}=useSelector((state)=>state.auth)
    const {user}=useSelector((state)=>state.profile)
    const {totalItems}=useSelector((state)=>state.cart)

    const location=useLocation()

    const [subLinks,setSubLinks]=useState([])
    const [loading,setLoading]=useState(false)

    const fetchSubLinks=async ()=>{
       setLoading(true)
       const result=await fetchCourseCategories();
       console.log("result ",result)
        setSubLinks(result.filter((category)=>category?.courses?.length>0))
        setLoading(false)
    }

    useEffect(()=>{
        fetchSubLinks();
    },[])
    
    const matchRoute=(route)=>{
        return matchPath({path:route},location.pathname)
    }
    return(
        <div className="flex h-14 items-center justify-center border-b border-richblack-700">
            <div className="flex w-11/12 max-w-maxContent items-center justify-between">
                <Link to={"/"}>
                    <img src={logo} width={160} height={42} loading="lazy" alt=""/>
                </Link>

                {/* NavLink */}
                <nav>
                    <ul className="flex gap-x-6 text-richblack-25">
                        {
                            NavbarLinks.map((link,index)=>{
                                return  <li key={index}>
                                    {
                                        link.title==="Catalog"?(
                                        <div className={`group relative flex cursor-pointer items-center gap-1 ${
                                            matchRoute("/catalog/:catalogName")
                                              ? "text-yellow-25"
                                              : "text-richblack-25"
                                          }`}>
                                            <p>{link.title}</p>
                                            <IoIosArrowDown />

                                            <div className="iinvisible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[3em]
                                             flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible
                                              group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px]">
                                            <div className="absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5"></div>
                                                 {
                                                    subLinks.length?
                                                    (
                                                        subLinks.map((subLink)=>(
                                                            <Link
                                                             key={subLink._id}
                                                             to={`/catalog/${subLink.name
                                                                .split(" ")
                                                                .join("-")
                                                                .toLowerCase()}`}
                                                            className="rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50"
                                                             >
                                                                <p>{subLink.name}</p>
                                                            </Link>
                                                        ))
                                                    )
                                                    :(<div></div>)
                                                 }
                                             </div>
                                        </div>
                                    ):(
                                        <Link to={link.path}>
                                            <p className={`${matchRoute(link?.path)? 'text-yellow-25':'text-richblack-25'}`}>
                                                {link?.title}
                                            </p>
                                        </Link>)
                                    }
                                </li>
                            })
                        }
                    </ul>
                </nav>

                {/* login/signup/dashboard */}
                
                 <div className="flex gap-x-4 items-center">
                        {
                            user&&user.accountType!==ACCOUNT_TYPE.INSTRUCTOR&&(
                                <Link to="/dashboard/cart" className="relative">
                                    <AiOutlineShoppingCart className="text-2xl text-richblack-100" />
                                    {
                                        totalItems>0&&<span className="absolute -bottom-2 -right-2 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-richblack-600 text-center text-xs font-bold text-yellow-100">{totalItems}</span>
                                    }
                                </Link>
                            )
                        }
                        {
                            !token&&(
                                <div className="flex gap-x-4 items-center">
                                <Link to="/login">
                                    <button className={`${matchRoute('/login')?'text-yellow-100':'text-richblack-100'} border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] rounded-md`}>
                                        Log In</button>
                                </Link>

                                <Link to="/signup">
                                <button className={`${matchRoute('/signup')?'text-yellow-100':'text-richblack-100'}  border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] rounded-md`}>
                                    Sign Up</button>

                                </Link>
                                </div>
                            )
                            
                        }
                        {
                            token!==null && (<ProfileDropDown/>)
                        }

                 </div>
            </div>
            
        </div>
    )
}
export default Navbar;