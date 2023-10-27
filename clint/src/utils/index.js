import axios from "axios";

import { dispatch } from "../redux/store";
import { SetPosts } from "../redux/postSlice";


const API_URL = "http://localhost:8800"


export const API = axios.create({
    baseURL: API_URL,
    responseType:"json"
})

export const apiRequest = async ({ url, token, data, method }) => {
    try {
        const result = await API(url, {
            method: method || "GET",
            data: data,
            headers: {
                "content-type": "application/json",
                Authorization:token ? `Bearer ${token}`:"",
            }
        })
        return result?.data
        
    }
    catch (error)
    {
        const err = error.response.data;
        console.log(err)
        return {status:err.success,message:err.message}
    }
}

export const handleFileUpload = async (uploadFile) => {
    const formData = new FormData()
    formData.append("file", uploadFile)
    formData.append("upload_preset", "socialmedia")
    try {
        const response = await axios.post(
            `http://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_ID}/image/upload/`,formData
        ) 

        return response.data.secure_url
        
    } catch (error)
    {

    }
}

export const fetchPosts = async (token, dispatch, uri, data) => {
    
    try {

        const res = await apiRequest({
            url: uri || "/posts",
            token: token,
            method: "POST",
            data:data || {},
        })
        dispatch(SetPosts(res?.data))
        return
    }
    catch (error)
    {
        console.log(error)

    }
}

export const deletePost = async (id, token) => {
    try {
        const res = await apiRequest({
            url: "/posts/" + id,
            token: token,
            method:"DELETE",
        })
        return
    }
    catch (error)
    {
        console.log(error)

    }
}

export const likePost = async ({ uri, token }) => {
    try {
        const res = await apiRequest({
            
            url: uri,
            token: token,
            method:"POST"
        })
        return res
         

       
    }
    catch (error)
    {
        console.log(error)

    }
    
}

// admin side
export const getUsersList = async () => {
    try {
        const users = await apiRequest({
            url: '/admin/userslist',
           method: "GET",
            
        })
        return users
        
    }
    catch (error)
    {
        console.error(error.message)

    }
}

export const blockUser = async (userId,  action) => {
    try {
        const res = await apiRequest({
             url: `/admin/users/${userId}/block`,
          
            method: "POST",
            data: { action: action },
        });
        return res;
    } catch (error) {
        console.error(error);
    }
}
