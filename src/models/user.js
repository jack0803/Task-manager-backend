import mongoose from 'mongoose';
//verify data ex : email , cardnumber etc.
import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Task from './task.js'
const userSchema = new mongoose.Schema(
{
    //setup fields
    name:{
        type: String
    },
    email:{
        type: String,
        require: true,
        lowercase: true,
        //it means there is no two same email address exist in database
        unique: true,
        trim: true,//it removed space
        //we can also create custom validation fuction also
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Invalid Email Address!')
            }
        }
    },
    age:{
        type: Number,
        default: 0//if value not provide then take it as 0
    },
    password:{
        type: String,
        require: true,
        minlength: 8,
        trim: true,
        validate(value){
            if(value.toLowerCase().includes('password'))
            {
                throw new Error('password not Acceptable!')
            }
        }
    },
    avatar:{
        //we cant store profile in file system because any one can use it 
        // we store an binary data of an image then we convert this into actual image
        type: Buffer
    },
    //it is an array of objects(users)
    tokens:[{
        token: {
            //it catians it's own id
            type: String,
            require: true
        }
    }]
}, {
    timestamps:true
})

//virtual property : this data actually not store in to the user data it is an realationship between two entity
userSchema.virtual('user_task', {
    ref: 'Task',
    //usermodel  user id
    localField:'_id',
    //owner id of task
    foreignField:'owner'
})

userSchema.statics.findByCredentials = async (email , password) => {
    const user = await User.findOne({ email: email })

    if (!user) {
         throw new Error({error:'incorrect email or passsword'   })
    }
    //first we have to convert the password that user input because database have the password in hashedform
    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('invalid Password!')
    }
    //if password is correct 
    return user
}

//token generator
userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() },'signature')

    //here we user concate because is single string
    user.tokens = user.tokens.concat({ token: token})
    await user.save()

    return token
}

// //we made this function because there is no need to show the password and token (encrypted values) to user 
// userSchema.methods.getPublicProfile = function () {
//     const user = this
//     //make a copy of user then delete password and token to show only necessary info to authenticated user
//     const userObject = user.toObject()
    
//     delete userObject.password
//     delete userObject.tokens

//     return userObject
// }

//automatic and better way to remove token and password
userSchema.methods.toJSON = function () {
    const user = this
    //make a copy of user then delete password and token to show only necessary info to authenticated user
    const userObject = user.toObject()
    
    delete userObject.password
    delete userObject.tokens

    return userObject
}
//here we can't use arrow function because arrow function doesn't bound this
userSchema.pre('save', async function (next) {
    const user = this

    // convert password in hashcode
    //if password will change then and then it will convert in to new hash conde    
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

//delete the tasks when user delete their account
userSchema.pre('remove' , async function (next){
    const user = this
    await Task.deleteMany({owner : user._id})
})

const User = mongoose.model('User', userSchema)
    
export default User
// //creating modle
// const User = mongoose.model('User',{
//     //setup fields
//     name:{
//         type: String
//     },
//     email:{
//         type: String,
//         require: true,
//         lowercase: true,
//         trim: true,//it removed space
//         //we can also create custom validation fuction also
//         validate(value){
//             if(!validator.isEmail(value)){
//                 throw new Error('Invalid Email Address!')
//             }
//         }
//     },
//     age:{
//         type: Number,
//         default: 0//if value not provide then take it as 0
//     },
//     password:{
//         type: String,
//         require: true,
//         minlength: 8,
//         trim: true,
//         validate(value){
//             if(value.toLowerCase().includes('password'))
//             {
//                 throw new Error('password not Acceptable!')
//             }
//         }
//     }

// })
