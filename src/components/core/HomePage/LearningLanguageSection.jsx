import HighLightText from "./HighLightText";
import know_your_progress from "../../../assets/Images/Know_your_progress.png"
import compare_with_others from "../../../assets/Images/Compare_with_others.png"
import plan_with_lessons from "../../../assets/Images/Plan_your_lessons.png"
import CTAButton from "./Button"

const LearningLanguageSection=({text})=>{
    return(
        <div className=" mt-[130px]">
            <div className="flex flex-col gap-5 items-center">
                <div className="text-4xl font-semibold text-center">
                    Your swiss knife for{" "} <HighLightText text={"learning any language"}/>
                </div>
                <div className="text-center  text-richblue-600 mx-auto text-base font-medium w-[70%] tracking-wide">
                    Using spin making learning multiple languages easy. with 20+ languages realistic voice-over,
                    progress tracking, custom schedule and more.
                </div>

                <div className="flex items-center justify-center mt-3 ">
                    <img
                        src={know_your_progress}
                        alt="know_your_progress"
                        className="object-contain translate-x-40 -translate-y-7 z-10"
                    />
                    <img
                        src={compare_with_others}
                        alt="compare_with_others"
                        className="object-contain translate-x-12 z-20"
                    />
                    <img
                        src={plan_with_lessons}
                        alt="plan_with_lessons"
                        className="object-contain -translate-x-24 -translate-y-5 z-30"
                    />
                </div>

                <div>
                    <CTAButton active={true} linkto={"signin"} children={"Learn More"}/>
                </div>
            </div>
        </div>
    )
}

export default LearningLanguageSection;