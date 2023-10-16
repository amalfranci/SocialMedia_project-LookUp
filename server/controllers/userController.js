import mongoose from "mongoose";
import Verification from "../models/emailVerification.js";
import Users from "../models/userModel.js";
import { compareString, createJWT, hashString } from "../utils/index.js";
import passwordReset from "../models/passwordReset.js";
import { resetPasswordLink } from "../utils/sendEmail.js";

export const verifyEmail = async (req, res) => {

    const { userId, token } = req.params
    
    try {
        const result = await Verification.findOne({ userId })
        
        if (result) {
            const { expiresAt, token: hashedToken } = result
            // token has expire
            if (expiresAt < Date.now()) {

                await Verification.findOneAndDelete({ userId })
                    .then(() => {
                        Users.findByIdAndDelete({ userId })
                            .then(() => {
                                const message = "Verification token has expired"
                                res.redirect(`/users/verified?status=error&message=${message}`)
                            }).catch((err) => {
                            res.redirect(`/users/verified?status=error&message=`)
                        })
                    })
                    .catch((error) => {
                        console.log(error)
                        res.redirect(`/users/verified?message=`)
                })

            }
              else {
            // token valid

            compareString(token, hashedToken).then((isMatch) => {
                if (isMatch)
                {
                    Users.findOneAndUpdate({ _id: userId }, { verified: true })
                        .then(() => {
                            Verification.findOneAndDelete({ userId }).then(() => {
                                const message = "Email verified successfull"
                                res.redirect(`/users/verified?status=success&message=${message}`)
                        })
                        }).catch((err) => {
                            console.log(err)
                            const message = "verification failed or link is invalied"
                            res.redirect(`/users/verified?status=error&message=${message}`)
                        })
                    
                    }
                else {
                        const message = "verification failed or link is invalied"
                            res.redirect(`/users/verified?status=error&message=${message}`)


                    
                    }
                 
             })
                .catch((err) => { 
                     console.log(err)
                        res.redirect(`/users/verified?message=`)

                })

            
        }
        }
        else {
            const message = "invalid verification link.try again later"
             res.redirect(`/users/verified?status=error&message=${message}`)
        }
      
      
    } catch (err)
    {
        console.log(err)
    res.redirect(`/users/verified?message=`)

    }
    

    
}


export const requestPasswordReset = async (req, res) => {
    
    try {

        const { email } = req.body
        const user = await Users.findOne({ email })

        if (!user) {
            return res.status(404).json({
                status: "Failed"
                , message: "Email adress not found"
            })
        }
        const existingRequest = await passwordReset.findOne({ email })
        
        if (existingRequest)
        {
            if (existingRequest.expiresAt>Date.now())
        {
            return res.status(201).json({
                status: "PENDING",
                message:"Reset password link has already been sent your email.",
            })
            
            }
            await passwordReset.findByIdAndDelete({email})
        }
        await resetPasswordLink(user,res)
            
        
        
    } catch (error) {
        
        console.log(error)
        res.status(404).json({message:error.message})
        


    }
    
   
}

export const resetPassword = async (req, res) => {
  const { userId, token } = req.params;

  try {
    // find record
    const user = await Users.findById(userId);

    if (!user) {
      const message = "Invalid password reset link. Try again";
      res.redirect(`/users/resetpassword?status=error&message=${message}`);
    }

    const resetPassword = await passwordReset.findOne({ userId });

    if (!resetPassword) {
      const message = "Invalid password reset link. Try again";
      return res.redirect(
        `/users/resetpassword?status=error&message=${message}`
      );
    }

    const { expiresAt, token: resetToken } = resetPassword;

    if (expiresAt < Date.now()) {
      const message = "Reset Password link has expired. Please try again";
      res.redirect(`/users/resetpassword?status=error&message=${message}`);
    } else {
      const isMatch = await compareString(token, resetToken);

      if (!isMatch) {
        const message = "Invalid reset password link. Please try again";
        res.redirect(`/users/resetpassword?status=error&message=${message}`);
      } else {
        res.redirect(`/users/resetpassword?type=reset&id=${userId}`);
      }
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};
export const changePassword = async (req, res, next) => {
  try {
    const { userId, password } = req.body;

    const hashedpassword = await hashString(password);

    const user = await Users.findByIdAndUpdate(
      { _id: userId },
      { password: hashedpassword }
    );

    if (user) {
      await passwordReset.findOneAndDelete({ userId });

      res.status(200).json({
        ok: true,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const getUser = async (req, res, next) => {
  

  try {
    const { userId } = req.body.user
    const { id } = req.params
    const user = await Users.findById(id ?? userId).populate({
      path: "friends",
      select:"-password",
    })
    if (!user)
    {
      return res.status(200).send({
        message: "User Not Found",
        success:false,
      })
    }
    
    user.password=undefined
    


    
  } catch (error)
  {
    console.log(error)
    res.status(500).json({
      message: "auth error",
      success: false,
      error:error.message
    })
  }

}

export const updateUser = async (req, res, next) => {
  
  try {
    const { firstName, lastName, location, profileUrl, profession } = req.body
    
    if (!(firstName || lastName || profession || location || profileUrl)) {
      next("please provide all required fields")
      return
    }
    const { userId } = req.body.user
    const updateUser = {
      firstName,
      lastName,
      location,
      profileUrl,
      profession,
      _id:userId


    }

    const user = await Users.findByIdAndUpdate(userId, updateUser, {
      new:true
    })

    await user.populate({ path: "friends", select: "-password" })
    const token = createJWT(user?._id)
    
    user.password = undefined;
    res.status(200).json({
      success: true,
      message: "user updated successfully",
      user,
      token
    })

  }

  catch (error)
  {
    console.log(error)
    res.status(404).json({
      message:error.message
    })

  }
}