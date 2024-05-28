import { Link, matchPath } from "react-router-dom";
import logo from "../../assets/Logo/Logo-Full-Light.png"
import {NavbarLinks} from "../../data/navbar-links"
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { ACCOUNT_TYPE } from "../../utils/constants";
import { CiShoppingCart } from "react-icons/ci";
import ProfileDropDown from "../core/Auth/ProfileDropDown";
// import { useState } from "react";
// import { apiConnector } from "../../services/apiconnector";
// import { categories } from "../../services/apis";
import { IoIosArrowDown } from "react-icons/io";

const subLinks=[
    {
        id:1,
        title:"Python",
        link:"catalog/python"
    },
    {
        id:2,
        title:"Web Dev",
        link:"catalog/web-developement"
    },
]
const Navbar=()=>{

    const {token}=useSelector((state)=>state.auth)
    const {user}=useSelector((state)=>state.profile)
    const {totalItems}=useSelector((state)=>state.cart)

    const location=useLocation()

    // const [subLinks,setSubLinks]=useState([])

    // const fetchSubLinks=async ()=>{
    //     try {
    //        const result=await apiConnector("GET",categories.CATEGORIES_API)
    //        console.log(result);
    //        setSubLinks("Printing sublink result ",result);
    //     } catch (error) {
    //         console.log("Can't fetch category list ",error);
    //     }
    // }

    // useEffect(()=>{
    //     fetchSubLinks();
    // },[])
    
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
                                        <div className="relative flex items-center gap-2 group">
                                            <p>{link.title}</p>
                                            <IoIosArrowDown />

                                            <div className="invisible absolute left-[50%] -translate-x-[50%] translate-y-[25%] top-[50%] flex flex-col rounded-md 
                                            bg-richblack-5 p-4 text-richblack-300 opacity-0 transition-all duration-200
                                             group-hover:visible group-hover:opacity-100 lg:w-[300px] z-10">
                                                    <div className="absolute left-[50%] top-1 translate-x-[80%] translate-y-[-45%]
                                                    h-6 w-6 rotate-45 rounded bg-richblack-5 "></div>
                                                 {
                                                    subLinks.length?
                                                    (
                                                        subLinks.map((subLink)=>(
                                                            <Link key={subLink.id} to={subLink.link}>
                                                                <p>{subLink.title}</p>
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
                                    <CiShoppingCart />
                                    {
                                        totalItems>0&&<span>{totalItems}</span>
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
                        {/* {
                            !token&&(
                                <Link to="/signup">
                                    <button className={`${matchRoute('/signup')?'text-yellow-100':'text-richblack-100'}  border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] rounded-md`}>
                                        Sign Up</button>

                                </Link>
                            )
                        } */}
                        {
                            token!==null && (<ProfileDropDown/>)
                        }

                 </div>
            </div>
            
        </div>
    )
}
export default Navbar;