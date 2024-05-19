import logo1 from "../../../assets/TimeLineLogo/Logo1.svg"
import logo2 from "../../../assets/TimeLineLogo/Logo2.svg"
import logo3 from "../../../assets/TimeLineLogo/Logo3.svg"
import logo4 from "../../../assets/TimeLineLogo/Logo4.svg"
import timelineImage from "../../../assets/Images/TimelineImage.png"

const timline=[
    {
        logo:logo1,
        heading:"Leadership",
        Description:"Fully committed to the success company"
    },
    {
        logo:logo2,
        heading:"Responsibility",
        Description:"Students will always be our top priority"
    },
    {
        logo:logo3,
        heading:"Flexibility",
        Description:"The ability to switch is an important skills"
    },
    {
        logo:logo4,
        heading:"Solve the problem",
        Description:"Code your way to a solution"
    }
]

const TimelineSection=({text})=>{
    return(
        <div>
            <div className="flex gap-12 items-center">
                <div className="w-[45%] flex flex-col gap-5">
                        {
                            timline.map((element,index)=>{
                                return (
                                    <div key={index}>
                                        <div className="flex gap-6" key={index}>
                                            <div className="w-[50px] h-[50px] flex items-center justify-center bg-[#FFFFFF] shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-full">
                                                    <img src={element.logo} alt="img"/>
                                            </div>
                                            <div className="">
                                                    <h2 className="font-semibold text-[18px]">{element.heading}</h2>
                                                    <p className="text-base">{element.Description}</p>
                                             </div>
                                        </div>
                                        {(index<timline.length-1)&&<div className="h-[50px] mx-6 mt-3 border-l-2 border-dashed border-[#AFB2BF]"/>}       
                                    </div>
                                )
                            })
                        }
                </div>

                <div className="relative shadow-blue-200">
                    <img src={timelineImage}
                         alt="timelineImage"
                         className="object-cover h-full"
                    />

                    <div className="absolute bg-caribbeangreen-700 flex text-white uppercase py-7
                    left-[50%] -translate-x-[50%] -translate-y-[50%]">
                        <div className="flex gap-5 items-center border-r border-caribbeangreen-300 px-7">
                            <p className="text-3xl font-bold">10</p>
                            <p className="text-caribbeangreen-300 text-sm">YEAR EXPERIENCES</p>
                        </div>
                        <div className="flex gap-5 items-center px-7">
                            <p className="text-3xl font-bold">255</p>
                            <p className="text-caribbeangreen-300 text-sm">TYPES OF COURSES</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default TimelineSection;