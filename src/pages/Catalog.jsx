import React, { useEffect, useState } from 'react'
import Footer from "../components/common/Footer"
import { useParams } from 'react-router-dom'
import { apiConnector } from '../services/apiconnector'
import { categories } from '../services/apis'
import { getCatalogPageDetails } from '../services/operations/pageAndComponentData'
import CourseSlider from '../components/core/Catalog/CourseSlider'
import CourseCard from '../components/core/Catalog/CourseCard'

export default function Catalog() {
    const {catalogName}=useParams()
    const [catalogPageData,setCatalogPageData]=useState(null)
    const [categoryId,setCategoryId]=useState(null)
    const [loading,setLoading]=useState(false)
    const [active, setActive] = useState(1)

    useEffect(()=>{
        const getCatetories=async()=>{
         try {
            setLoading(true)
            const res=await apiConnector("GET",categories.CATEGORIES_API)

            const category_id=res?.data?.data.filter((ct)=>ct.name.split(" ").join("-")
                                                                .toLowerCase()===catalogName)[0]._id
            console.log("ID ",category_id)

            setCategoryId(category_id)
         } catch (error) {
            console.log(error.message);
         }
        }
        getCatetories();
    },[catalogName])

    useEffect(()=>{
        const getCategoryDetails=async()=>{
            const result=await getCatalogPageDetails(categoryId);
            setCatalogPageData(result)
            console.log("categories ",result)
            setLoading(false)
        }
        categoryId&&getCategoryDetails();
    },[categoryId])

    if (loading || !catalogPageData) {
        return (
          <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
            <div className="spinner"></div>
          </div>
        )
      }

  return (
    <div>
        <div className='box-content bg-richblack-800 px-4'>
            <div className='mx-auto flex min-h-[260px] max-w-maxContentTab flex-col justify-center gap-4 lg:max-w-maxContent '>
                <p className='text-sm text-richblack-300'>{`Home/Catalog/`}
                    <span className='text-yellow-25'>{catalogPageData?.selectedCategory?.name}</span>
                </p>
                <p className='text-3xl text-richblack-5'>{catalogPageData?.selectedCategory?.name}</p>
                <p className='max-w-[870px] text-richblack-200'>{catalogPageData?.selectedCategory?.description}</p>
            </div>
        </div>

        {/* Section 1 */}
        <div className='mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent'>
            <div className='text-2xl text-richblack-5'>Courses to get you started</div>
            <div className='my-4 flex border-b border-b-richblack-600 text-sm'>
                <p
                    className={`px-4 py-2 ${
                    active === 1
                        ? "border-b border-b-yellow-25 text-yellow-25"
                        : "text-richblack-50"
                    } cursor-pointer`}
                    onClick={() => setActive(1)}
                >Most Popular</p>
                <p
                    className={`px-4 py-2 ${
                    active === 2
                        ? "border-b border-b-yellow-25 text-yellow-25"
                        : "text-richblack-50"
                    } cursor-pointer`}
                    onClick={() => setActive(2)}
                >New</p>
            </div>

            <div>
                <CourseSlider courses={catalogPageData?.selectedCategory?.courses}/>
            </div>
        </div>

        {/* Section 2 */}
        <div className='mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent'>
            <p className='text-2xl text-richblack-5'>Top Courses in {catalogPageData?.differentCategory?.name}</p>
            <div className='py-8'>
            <CourseSlider courses={catalogPageData?.differentCategory?.courses}/>
            </div>
        </div>

        {/* Section 3 */}
        <div className='mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent'>
            <div className='text-2xl text-richblack-5'>Frequently Bought</div>

            <div className='py-8'>
                <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
                    {
                        catalogPageData?.mostSellingCourses?.map((course)=>(
                            <CourseCard course={course} key={course._id} Height={"h-[400px]"}/>
                        ))
                    }
                </div>
            </div>
        </div>

        <Footer/>
    </div>
  )
}
