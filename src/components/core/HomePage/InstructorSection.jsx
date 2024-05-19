import instructor from "../../../assets/Images/Instructor.png"
import HighLightText from "./HighLightText";
import CTAButton from "./Button"
import {FaArrowRight} from "react-icons/fa"

const InstructorSection=({text})=>{
    return(
        <div className="flex gap-20 items-center my-16">
            <div className="w-[50%]">
                <img
                src={instructor}
                alt=""
                className="shadow-[-15px_-15px] shadow-white"
                />
            </div>

            <div className="w-50% flex flex-col items-start gap-16">
                <div className="flex flex-col gap-5">
                    <div className="text-4xl font-semibold w-[50%]">Become an {" "}
                                <HighLightText text={"instructor"}/>
                    </div>
                    <p className="font-medium text-[16px] w-[80%] text-richblue-300">Instructors from around the world teach millions of students on StudyNotion. 
                        We provide the tools and skills to teach what you love.
                    </p>
                </div>
                <CTAButton active={true} linkto={"/signup"}>
                    <div className="flex gap-2 items-center">
                        Start Teaching Today
                        <FaArrowRight/>
                    </div>
                </CTAButton>
            </div>
        </div>
    )
}

export default InstructorSection;