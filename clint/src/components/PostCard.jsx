import React, { useState } from 'react'
import { NoProfile } from '../assets';
import { Link } from 'react-router-dom'
import moment from 'moment';
import { BiComment, BiLike, BiSolidLike } from 'react-icons/bi';
import { MdOutlineDeleteOutline } from "react-icons/md"
import { useForm } from 'react-hook-form';
import TextInput from './TextInput';
import Loading from './Loading';
import CustomButton from './CustomButton';
import { deletePost } from '../utils';

const CommentForm = ({ user, id, replyAt, getComments }) => {
    const [loading, setLoading] = useState(false)
    const [errMsg, setErrMsg] = useState("")
    const {
        register,
        handleSubmit,
        reset,
        formState:{errors},
    } = useForm({
        mode:"onChange"
    })
    const onSubmit=async(data)=>{}
    
    return (
        <form onSubmit={handleSubmit(onSubmit)}
            className='w-full border-b border-[#66666645]'>
            <div className='w-full flex items-center gap-2 py-4'>
                <img
                    src={user?.profileUrl ?? NoProfile}
                    alt='User Image'
                    className='w-10 h-10 rounded-full object-cover' />
                <TextInput
                    name="comment"
                    styles='w-full rounded-full py-3'
                    placeholder={replyAt ? `Reply @${replyAt}` : "Comment this post"}
                    register={register("comment",{
                    required:"Comment can not be empty",
                    })}
                error={errors.comment ? errors.comment.message:""}/>
            </div>
            {errMsg?.message && (
                <span
                    role="alert"
                    className={`text-sm ${
                    errMsg?.status==="failed"
                            ? "text-[#f64949fe]" : "text-[#2ba150fe]"} mt-0.5`}>
                   { errMsg?.message}

                    </span>

            )}
            <div className='flex items-end justify-end pb-2'>
                {loading ? (<Loading />) : (
                    <CustomButton
                        title='Submit'
                        type='Submit'
                    containerStyles="bg-[#0444a4] text-white py-1 px-3 rounded-full font-semibold text-sm"/>
                )}
            </div>
        </form>
        
    )
}
function PostCard({ post, user, deletePost, likePost }) {
    
    const [showall, setShowAll] = useState(0)
    const [showReply, setShowReply] = useState(0);
    const [comment, setComments] = useState([])
    const [loading, setLoading] = useState(false)
    const [replyComments, setReplyComments] = useState(0)
    const [showComments, setShowComments] = useState(0)
    const getComments=async()=>{}
  return (
      <div className='mb-2 bg-primary p-4 rounded-xl'>
          <div className='flex gap-3 items-center mb-2'>
              <Link to={"/profile/" + post?.userId?._id}>
                  <img 
                      src={post?.userId?.profileUrl ?? NoProfile}
                      alt={post?.userId?.firstName}
                  className='w-14 h-14 object-cover rounded-full'/>
                  
              </Link>
              <div className='w-full flex justify-between'>
                  <div className=''>
                      <Link to={"/profile/" + post?.userId?._id}>
                          <p className='font-medium text-lg text-ascent-1'>
                              {post?.userId?.firstName} {post?.userId?.lastName}
                          </p>
                      </Link>
                      <span className='text-ascent-2'>{post?.userId?.location}</span>
                  </div>
                  <span className='text-ascent-2'>
                      {moment(post?.createdAt ?? "2023-10-23").fromNow()}
                  </span>


              </div>
              

          </div>
          <div>
              <p className='text-ascent-2'>
                  {
                      showall === post?._id
                       ? post?.description
                       : post?.description?.slice(0, 300)
                  }
                  {
                      post?.description?.length > 301 && (
                          showall=== post?._id ?( <span className='text-blue ml-2 font-medium cursor-pointer' onClick={()=>setShowAll(0)}>Show less</span> ):( <span className='text-blue ml-2 font-medium cursor-pointer' onClick={()=>setShowAll(post?._id)}>show more</span>)
                      )
                  }
              </p>
              {
                  post?.image && (
                      <img src={post?.image}
                          alt='post image'
                      className='w-full mt-2 rounded-lg'/>
                  )
              }
              
          </div>
          <div className='mt-4 flex justify-between items-center px-3 py-2 text-ascent text-base border-t border-[#66666645]'>
              
              <p
              className='flex gap-2 items-center text-base cursor-pointer'>
                  {post?.likes?.includes(user?._id) ? (
                      <BiSolidLike size={20} color='blue'/>
                  ) : (<BiLike size={20} />)}
                  {post?.likes?.length} Likes
              </p>
              <p
                  className='flex gap-2 items-center text-base cursor-pointer'
                  onClick={() => {
                      setShowComments(showComments === post._id ? null : post._id);

                  getComments(post?._id)}} >
                  <BiComment size={20} />
                  {post?.comments?.length} Comments
              </p>
              {user?._id === post?.userId?._id && (
                  <div className='flex gap-1 items-center text-base text-ascent-1 cursor-pointer' onClick={()=>deletePost(post?._id)}>
                      <MdOutlineDeleteOutline size={20} />
                      <span>Delete</span>
                  </div>
              )}
          </div>

          {/* comments */}
          {showComments === post?._id && <div className='w-full mt-4 border-t border-[#66666645] pt-4'>
          
              <CommentForm
                  user={user}
                  id={post?._id}
              getComments={()=>getComments(post?._id)}/>
          </div>}
        
    </div>
  )
}

export default PostCard
