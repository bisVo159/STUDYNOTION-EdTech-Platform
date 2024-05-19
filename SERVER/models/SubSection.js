const mongoose=require('mongoose')

const subSectionSchma=new mongoose.Schema({
    title:{
        type:String,
    },
    timeDuration:{
        type:Number, 
    },
    description:{
        type: String
    },
    videoUrl:{
        type: String
    }
})

module.exports=mongoose.model("SubSection",subSectionSchma)