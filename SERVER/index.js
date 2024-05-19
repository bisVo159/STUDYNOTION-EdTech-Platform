const express=require('express')
const app=express()

const userRoutes=require('./routes/User')
const profuleRoutes=require('./routes/Profile')
const paymentRoutes=require('./routes/Payments')
const courseRoutes=require('./routes/Course')

const database=require('./config/database')
const cookieParser = require('cookie-parser')
const cors=require('cors')
const {cloudinaryConnect}=require('./config/cloudinary')
const fileUpload=require('express-fileupload')
const dotenv=require('dotenv')

dotenv.config()
const PORT=process.env.PORT||4000

// database connect
database.conect()

// middleware add
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: 'http://localhost:3000',
    credentials:true
}))
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));
// cloudinary connection
cloudinaryConnect();

// routes
app.use("/api/vi/auth",userRoutes)
app.use("/api/vi/profile",profuleRoutes)
app.use("/api/vi/course",courseRoutes)
app.use("/api/vi/payment",paymentRoutes)

// default route
app.get("/",(req,res)=>{
   return res.json({
    success:true,
    message:"Your server is up and running..."
   })
})

app.listen(PORT,()=>{
    console.log(`App is running at ${PORT}`)
})