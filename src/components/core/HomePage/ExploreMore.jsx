import { useState } from "react";
import {HomePageExplore} from "../../../data/homepage-explore"
import HighLightText from "./HighLightText";
import CourseCard from "./CourseCard";


const ExploreMore=()=>{

    const [currentTab,setCurrentTab]=useState(HomePageExplore[0].tag)
    const[courses,setCourses]=useState(HomePageExplore[0].courses)
    const[currentCard,setCurrentCard]=useState(HomePageExplore[0].courses[0].heading)

    const setMyCard=(value)=>{
        console.log(value)
        setCurrentTab(value)
        const result=HomePageExplore.filter((course)=>course.tag===value)
        if (result) {
            setCourses(result[0].courses);
            setCurrentCard(result[0].courses[0].heading);
        }
    }
    
    return(
        <div className="w-full">
            <div className="space-y-2">
                <div className="text-4xl font-semibold text-center">
                    Unlock the{" "}
                    <HighLightText text={" Power of Code"}/>
                </div>
                <p className="text-richblue-300 text-center text-sm text-[16px]">
                    Learn to Build Anything You Can Imagine
                </p>
            </div>

            <div className="flex items-center gap-2 bg-richblack-800 rounded-xl px-3 py-2
             my-5 border-richblack-100 shadow-[0px_0.5px] shadow-[#FCE2E2] max-w-fit mx-auto">
                {
                    HomePageExplore.map((Element,index)=>{
                        return(
                            <div
                            className={`text-[16px] flex items-center gap-2
                            ${currentTab===Element.tag
                                ?"bg-richblack-900 text-richblue-5 font-medium"
                            :"bg-richblack-800"} rounded-full transition-all duration-200 cursor-pointer
                             hover:bg-richblack-900 hover:text-richblack-5 px-7 py-2`}
                             key={index}
                             onClick={()=>setMyCard(Element.tag)}
                            >
                                {Element.tag}
                            </div>
                        )
                    })
                }
            </div>

            <div className="hidden lg:block lg:h-[200px]"></div>

                {/* course card group */}
                <div className="lg:absolute gap-10 justify-center lg:gap-10 flex lg:justify-between w-full
                 lg:bottom-[0] lg:left-[50%] lg:translate-x-[-50%] lg:translate-y-[50%] text-black
                 mb-7 lg:px-0 px-3">
                    {
                        courses.map((element,index)=>{
                            return(
                                <CourseCard
                                key={index}
                                cardData={element}
                                currentCard={currentCard}
                                setCurrentCard={setCurrentCard}
                                />
                            )
                        })
                    }
                </div>
        </div>
    )
    }
export default ExploreMore;