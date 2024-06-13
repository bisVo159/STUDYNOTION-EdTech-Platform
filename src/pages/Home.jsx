import {FaArrowRight, FaRandom} from "react-icons/fa"
import { Link } from "react-router-dom";
import HighLightText from "../components/core/HomePage/HighLightText";
import CTAButton from "../components/core/HomePage/Button";
import Banner from "../assets/Images/banner.mp4"
import CodeBlocks from "../components/core/HomePage/CodeBlocks";
import TimelineSection from "../components/core/HomePage/TimelineSection";
import LearningLanguageSection from "../components/core/HomePage/LearningLanguageSection";
import InstructorSection from "../components/core/HomePage/InstructorSection";
import ExploreMore from "../components/core/HomePage/ExploreMore";
import Footer from "../components/common/Footer";
import ReviewSlider from "../components/common/ReviewSlider";


const Home=()=> {
    return (
        <div className="h-fit">
            {/* Section 1 */}
            <div  className="relative mx-auto flex flex-col w-11/12 items-center text-white
            justify-between max-w-maxContent gap-9">
                <Link to={"/signup"}>
                    <div className="group mt-16 p-1 mx-auto rounded-full bg-richblue-800 font-bold text-richblue-200
                    transition-all duration-200 hover:scale-95 w-fit">
                        <div className="flex items-center gap-2 rounded-full px-10 py-[5px] group-hover:bg-richblue-900">
                            <p>Become an Instructor</p>
                            <FaArrowRight/>
                        </div>
                    </div>
                </Link>

                <div className="text-center text-4xl font-semibold">
                        Empower Your Future with{" "} 
                        <HighLightText text={"Coding Skills"}/>
                </div>

                <div className="w-[90%] text-center text-lg font-bold text-richblack-300">
                    With our online coding courses, you can learn at your own pace, from anywhere
                    in the world, and get access to a wealth of resources, including hands-on projects,
                    quizzes, and personalized feedback from instructors. 
                </div>

                <div className="flex gap-7">
                    <CTAButton active={true} linkto={"/signup"}>Learn More</CTAButton>
                    <CTAButton active={false} linkto={"/login"}>Book a Demo</CTAButton>
                </div>

                <div className="mx-3 my-7 shadow-[20px_20px] shadow-white">
                    <video
                    muted
                    loop
                    autoPlay>
                        <source src={Banner} type="video/mp4"/>
                    </video>
                </div>

                {/* code section 1 */}
                <div>
                    <CodeBlocks
                    position={"lg:flex-row"}
                    heading={
                        <div className="text-4xl font-semibold">
                                Unlock your {" "}
                                <HighLightText text={"coding potential"}/>
                                {" "}with our online courses.
                        </div>
                        }
                    subheading={"Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."}
                    ctabtn1={
                        {
                            btnText:"Try it Yourself",
                            linkto:"/signup",
                            active:true
                        }
                    }
                    ctabtn2={
                        {
                            btnText:"Learn More",
                            linkto:"/login",
                            active:false
                        }
                    }
                    codeblock={`<!DOCTYPE html>\n<head><title>Example</title>\n<linkrel="stylesheet"href="styles.css">
                    </head>\n<body>\n<h1><ahref="/">Header</a>\n</h1>\n<nav><ahref="one/">One</a>\n<ahref="two/">Two</a>
                    <a>href="three/">Three</a>\n</nav>`}
                    codeColor={"text-yellow-25"}
                    />
                </div>
                {/* code section 2 */}
                <div className="py-14">
                    <CodeBlocks
                    position={"lg:flex-row-reverse"}
                    heading={
                        <div className="text-4xl font-semibold">
                                Start{" "}
                                <HighLightText text={"coding in seconds."}/>
                        </div>
                        }
                    subheading={"Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."}
                    ctabtn1={
                        {
                            btnText:"Continue Lesson",
                            linkto:"/signup",
                            active:true
                        }
                    }
                    ctabtn2={
                        {
                            btnText:"Learn More",
                            linkto:"/login",
                            active:false
                        }
                    }
                    codeblock={`<!DOCTYPE html>\n<head><title>Example</title>\n<linkrel="stylesheet"href="styles.css">
                    </head>\n<body>\n<h1><ahref="/">Header</a>\n</h1>\n<nav><ahref="one/">One</a>\n<ahref="two/">Two</a>
                    <a>href="three/">Three</a>\n</nav>`}
                    codeColor={"text-yellow-25"}
                    />
                </div>

                <ExploreMore/>
            </div>
            {/* Section 2 */}
            <div className="bg-pure-greys-5 text-richblack-700 ">
                <div className="homepage_bg h-[333px] flex  items-center justify-center">
                    <div className="flex  gap-7 text-white">
                                <CTAButton active={true} linkto={"/signup"}>
                                    <div>Explore Full Catalog</div>
                                    <FaArrowRight/>
                                </CTAButton>
                                <CTAButton active={false} linkto={"/signup"}>
                                    <div>Learn More</div>
                                </CTAButton>
                    </div>
                </div>
                <div className="w-11/12 max-w-maxContent flex flex-col items-center justify-between gap-7 mx-auto py-20 px-5">
                    <div className="flex gap-5 pb-10">
                        <div className="text-4xl font-semibold w-[45%]">
                            Get the skills you need for
                            <HighLightText text={" a job that is in demand."}/>
                        </div>

                        <div className="flex flex-col gap-10 w-[40%] items-start">
                                <p className="text-[16px]">The modern StudyNotion is the dictates its own terms. 
                                        Today, to be a competitive specialist requires more than professional skills.
                                </p>
                                <CTAButton active={true} linkto={"/signup"}>Learn More</CTAButton>
                        </div>
                    </div>

                    <TimelineSection/>
                    <LearningLanguageSection/>
                </div>
            </div>
            {/* Section 3 */}
            <div className="w-11/12 mx-auto max-w-maxContent flex flex-col items-center justify-between
            gap-8 bg-richblue-900 text-white py-10">
                <InstructorSection/>

                <h2 className="text-center text-4xl font-semibold mt-10">Reviews from other learners</h2>

                {/* Review slider */}
                <ReviewSlider/>
            </div>

            {/* Footer */}
            <Footer/>
        </div>
    )
}
export default Home;
