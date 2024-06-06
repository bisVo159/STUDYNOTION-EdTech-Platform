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

    useEffect(()=>{
        const getCatetories=async()=>{
         try {
            setLoading(true)
            const res=await apiConnector("GET",categories.CATEGORIES_API)

            const category_id=res?.data?.data.filter((ct)=>ct.name.split(" ").join("-")
                                                                .toLowerCase()===catalogName)[0]._id
            console.log("ID ",category_id)

            setCategoryId(category_id)
            setLoading(false)
         } catch (error) {
            console.log(error.message);
         }
        }
        getCatetories();
    },[catalogName])

    useEffect(()=>{
        const getCategoryDetails=async()=>{
            setLoading(true)
            const result=await getCatalogPageDetails(categoryId);
            setCatalogPageData(result)
            console.log("categories ",result)
            setLoading(false)
        }
        categoryId&&getCategoryDetails();
    },[categoryId])

  return (
    <div className='text-white'>
        {
            loading?<div className='grid w-full h-full place-items-center'><p className='spinner'></p></div>:
            <>
            <div>
                <p>{`Home/Catalog/${catalogPageData?.selectedCategory?.name}`}</p>
                <p>{catalogPageData?.selectedCategory?.name}</p>
                <p>{catalogPageData?.selectedCategory?.description}</p>
            </div>

            <div>
                {/* Section 1 */}
                <div>
                    <div>Courses to get you started</div>
                    <div className='flex gap-x-3'>
                        <p>Most Popular</p>
                        <p>New</p>
                    </div>

                    <div>
                        <CourseSlider courses={catalogPageData?.selectedCategory?.courses}/>
                    </div>
                </div>

                {/* Section 2 */}
                <div>
                    <p>Top Courses in {catalogPageData?.differentCategory?.name}</p>
                    <div>
                    <CourseSlider courses={catalogPageData?.differentCategory?.courses}/>
                    </div>
                </div>

                {/* Section 3 */}
                <div>
                    <div>Frequently Bought</div>

                    <div className='py-8'>
                        <div className='grid grid-cols-1 lg:grid-cols-2'>
                            {
                                catalogPageData?.mostSellingCourses?.map((course)=>(
                                    <CourseCard course={course} key={course._id} Height={"h-[400px]"}/>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
            </>
        }
 

        <Footer/>
    </div>
  )
}
