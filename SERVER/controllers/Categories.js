const Category=require('../models/Category')
function getRandomInt(max) {
    return Math.floor(Math.random() * max)
  }

// handler function of create tag
exports.createCategory=async(req,res)=>{
    try {
        // fetch data
        const {name,description}=req.body

        // validation
        if(!name||!description){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }

        // create entry in db
        const categoryDetails=await Category.create({
            name:name,
            description:description
        })
        console.log(categoryDetails)

        return res.status(200).json({
            success:true,
            message:"Category created successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}


// getAlltags handler function
exports.showAllcategories=async(req,res)=>{
    try {
        const allCategories=await Category.find({},{name:true,description:true,courses:true})

        res.status(200).json({
            success:true,
            message:"all categories returned successfully",
            data:allCategories
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

exports.categoryPageDetails = async (req, res) => {
    try {
      const { categoryId } = req.body
      console.log("PRINTING CATEGORY ID: ", categoryId);
      // Get courses for the specified category
      const selectedCategory = await Category.findById(categoryId)
        .populate({
          path: "courses",
          // match: { status: "Published" },
          populate: "ratingAndReviews",
        })
        .exec()

      if (!selectedCategory) {
        console.log("Category not found.")
        return res
          .status(404)
          .json({ success: false, message: "Category not found" })
      }
      // Handle the case when there are no courses
      console.log("selectedCategory ",selectedCategory.courses)
      if (selectedCategory.courses.length === 0) {
        console.log("No courses found for the selected category.")
        return res.status(404).json({
          success: false,
          message: "No courses found for the selected category.",
        })
      }
  
      // Get courses for other categories
      const categoriesExceptSelected = await Category.find({
        _id: { $ne: categoryId },
      })
      let differentCategory = await Category.findOne(
        categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]
          ._id
      )
        .populate({
          path: "courses",
          // match: { status: "Published" },
        })
        .exec()
      // Get top-selling courses across all categories
      const allCategories = await Category.find()
        .populate({
          path: "courses",
          match: { status: "Published" },
          populate: {
            path: "Instructor",
        },
        })
        .exec()
      const allCourses = allCategories.flatMap((category) => category.courses)
      const mostSellingCourses = allCourses
        .sort((a, b) => b.sold - a.sold)
        .slice(0, 10)
      res.status(200).json({
        success: true,
        data: {
          selectedCategory,
          differentCategory,
          mostSellingCourses,
        },
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      })
    }
  }