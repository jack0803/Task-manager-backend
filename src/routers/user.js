import express from 'express'
import '../db/mongoose.js'
import User from '../models/user.js';
import auth  from '../middleware/authantication.js'
import multer from 'multer'
// import {sendWelcomeEmail } from '../emails/account.js

const router = new express.Router()

//converting in async await
router.post('/users',async (req , res) => {
    const user = await User(req.body)
    try {
        await user.save()
        sendWelcomeEmail(user.email , user.name)
        //when user signup we have to create token also
        const token = await user.generateAuthToken()
        res.status(201).send({user , token})
        
    } catch (error) {
        res.status(500).send(error)
    }
})

router.post('/users/login' , async (req , res) => {
    try {
        const user = await User.findByCredentials(req.body.email , req.body.password )
        //here we provide email and password to the function
        const token = await user.generateAuthToken()
        // manualway
        // res.send({user: user.getPublicProfile() , token})
        //automatic : no need to call a function
        res.send({user , token})
    }catch (error) {
        res.status(400).send(error)
    }
})

//converting in async await
//here auth runs before async function
router.get('/users/me', auth ,async (req ,res) => {
    try {
        
        res.status(200).send(req.user)
    } catch (error) {
        res.status(500).send(error);
    }
   
})

//after authentication user can't read data by simpaly providing an id
// router.get('/users/:id', async (req, res) => {
//     const _id = req.params.id

//     try {
//         const user = await User.findById(_id)

//         if (!user) {
//             return res.status(404).send()
//         }

//         res.send(user)
//     } catch (e) {
//         res.status(500).send()
//     }
// })

//using second method 
router.patch('/users/me' , auth , async (req, res) => {
    //giving error to application user who want to change the property that doesn't exist
    const update = Object.keys(req.body) // keys convert object property into stings
    const allowupdates = ['name' , 'age' , 'password' , 'email']
    const isUpdateAllowed = update.every((update) => {
        return allowupdates.includes(update)//include chech that update is subset of allowupdates or not
    })

    if(!isUpdateAllowed)
    {
        res.status(400).send({error: 'property does not exist that you want to update'})
    }
    //finding the user
    // const user = await User.findById(req.user._id)
    //update is arry of sting 
    update.forEach((update) => req.user[update] = req.body[update])
    await req.user.save()
    //ew have to use above method instead of this absolute method because if we use this method then userSchema.pre() will call only one time
    //but in patch we may update multiple things so we have to call pre() for each property
    // const user = await User.updateOne({ _id: req.params.id},req.body, { new: true , runValidators: true })

    try {
        // if(!user){
        //     res.status(404).send()
        // }
        res.status(200).send(req.user)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.delete('/users/me', auth ,async (req , res) => {
    try {
        //old method
        // const user = await User.deleteOne({ _id: req.user._id})
        //no need to check is user exist or not because user is already logged in
        // if(!user){
        //      res.status(404).send()
        // }
        //new method
        await req.user.remove()
        sendCancelationEmail(req.user.email , req.user.name)
        res.status(200).send(req.user)
    } catch (error) {
        res.send(error)
    }
}) 

router.post('/users/logout' , auth , async (req , res) => {
    //here we target specific token which is generate from the device in which user logged in because we dont want to log out user from all their devices.
    try {
        // console.log(req);
        
        //from req we can't get the user login token directly so we have to fetch it from header 
        const logintoken = {
            token: req.header('Authorization').replace('Bearer ', '')
        }
        console.log(logintoken);
        // if(req.user.tokens[2] === req.user.tokens[req.user.tokens.length-1]){
        //     console.log('match found!');
        //     console.log(req.user.tokens[req.user.tokens.length-1]);
        // }else{
        //     console.log('no match found!');
        //     console.log(req.token);
        // }
        // here token (tokens) is an object which contains token property inside it
        req.user.tokens = req.user.tokens.filter((tokens) => {
            return tokens.token !== logintoken.token
        })
        console.log(req.user.tokens);
        await req.user.save()
        
        res.send()  
    } catch (error) {
        res.status(500).send(error)
    } 

})

//log out from all devices
router.post('/users/logoutAll' , auth , async (req , res) => {
    //here we target specific token which is generate from the device in which user logged in because we dont want to log out user from all their devices.
    req.user.tokens = []
    console.log(req.user.tokens);
    try {

        // await req.user.save()
           res.send()  
    } catch (error) {
        res.status(500).send(error)
    }
})

const upload = multer({
   
    limits: {
        // 1mb
        fileSize: 4000000
    },
    fileFilter(req, file, callback) {
        // using reguler expression 
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return callback(new Error('Please upload a JPG or JPEG or PNG files'))
        }

        callback(undefined, true)
    } 
})

//multer send us or store an binary data of file we have to convert them into original form
router.post('/users/me/avatar', auth ,upload.single('avatars'), async (req , res) => {
    req.user.avatar = req.file.buffer
    await req.user.save()
    res.send()
}, (error , req , res, next) => {
    //this callback is for error handling in 500 error we got big htlm code in the from of error but we need only error massage
    res.status(400).send({error: error.message})
})

router.delete('/users/me/avatar', auth ,async (req , res) => {
    try {
        req.user.avatar = undefined
        await req.user.save()
        res.status(200).send(req.user)
    } catch (error) {
        res.send(error)
    }
}) 

router.get('users/:id/avatar' , async (req , res) => {
    try {
        const user = await User.findById({_id : req.params.id})
        
        if(!user || !user.avatar){
            throw new Error()
        }
        //here we have to provide image type because for convert the binary data to image we have to provide image type to frontend
        res.set('Content-Type' , 'image/png')
        res.send(user)
    } catch (error) {
        res.send(error)
    }
})

export default router