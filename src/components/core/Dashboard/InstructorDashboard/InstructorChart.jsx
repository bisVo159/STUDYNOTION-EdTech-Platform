import React, { useState } from 'react'
// import { Chart,registerables } from 'chart.js'
import { Pie } from 'react-chartjs-2'
// Chart.register(...registerables)

function InstructorChart({courses}) {
    const[currChart,setCurrChart]=useState("students")
    // function to generate random colour
    const getRandomColors=(numColors)=>{
        const colors=[]

        for(let i=0;i<numColors;i++){
          const color=`rgb(${Math.floor(Math.random()*256)},${Math.floor(Math.random()*256)},${Math.floor(Math.random()*256)})`
          colors.push(color)
        }

        return colors;
    }

    // create data for displaying chart for student info
    const CharDataForStudents={
      labels: courses?.map((course)=>course.courseName),
      datasets: [
        {
          data: courses?.map((course)=>course.totalStudentsEnrolled),
          backgroundColor:getRandomColors(courses.length),
        }
      ]
    }
    // create data for displaying chart for income info
    const CharDataForIncome={
      labels: courses?.map((course)=>course.courseName),
      datasets: [
        {
          data: courses?.map((course)=>course.totalAmountGenerated),
          backgroundColor:getRandomColors(courses.length),
        }
      ]
    }
  return (
    <div>
      <p>Visualise</p>
      <div className='flex gap-x-3'>
        <button onClick={()=>setCurrChart("students")}
        className={`${currChart==="students"&&"bg-richblack-300 text-black"} p-1 rounded-sm`}
          >
          Students</button>
        <button onClick={()=>setCurrChart("income")}
        className={`${currChart==="income"&&"bg-richblack-300 text-black"} p-1 rounded-sm`}
          >
          Income</button>
      </div>
      <div className='h-96'>
          <Pie 
          data={currChart==="students"?CharDataForStudents:CharDataForIncome}/>
      </div>
    </div>
  )
}

export default InstructorChart