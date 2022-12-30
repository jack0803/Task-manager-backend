import mongoose from 'mongoose';
//verify data ex : email , cardnumber etc.
import validator from 'validator';

const taskSchema = new mongoose.Schema({
    //setup fields
    description:{
        type: String,
        tirm: true,
        require: true
    },
    status:{
        type: Boolean,
        default: false
    },
    //who created this task
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        //it take the reference of User model
        ref: "User"
    }

}, {
    timestamps: true
})

const Task = mongoose.model('Task', taskSchema)

export default Task