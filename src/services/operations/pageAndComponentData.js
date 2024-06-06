import React from 'react'
import toast from 'react-hot-toast'
import { apiConnector } from '../apiconnector'
import { catalogData} from "../apis"

export const   getCatalogPageDetails=async(categoryId)=> {
    const toastId=toast.loading("Loading...")
    let result=[]
    try {
        const response=await apiConnector("POST",catalogData.CATALOGPAGEDATA_API,{categoryId})
        if(!response?.data?.success){
            throw new Error("Could not fetch Catagory page data")
        }
    
        result=response?.data?.data
    } catch (error) {
        console.log("CATALOGPAGEDATA_API ERROR.... ",error)
        toast.error(error.message);
    }
    toast.dismiss(toastId)
    return result
}
