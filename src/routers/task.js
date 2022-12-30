import express from 'express'
import '../db/mongoose.js'
import Task from '../models/task.js';
import auth from '../middleware/authantication.js'

const router = new express.Router()


//converting in async await

router.post('/tasks', auth, async (req, res) => {
    // const task = new Task(req.body)
    //providing owner to the task
    const task = new Task({
        ...req.body,
        owner: req.user._id 
    })

    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})


//second method
//express doesn't care about what async return promise because we return response inside the async function
//filtering tasks by completed or not by useing query
//Get/?completed=true or falser
router.get('/tasks', auth , async (req ,res) => {
    const match = {}
    
    //here we chek weather the query is provided or not
    if(req.query.status){
        match.status = req.query.status === 'true'
    }

    try {
        const task = await Task.find({ owner: req.user._id , status: match.status })
        // await req.user.populate("user_task").exec()
        // res.send(req.user.user_task)
        res.status(200).send(task)
    } catch (error) {
        res.status(500).send(error);
    }
    
})

//converting in async await

router.get('/tasks/:id',auth,async (req ,res) => {
    try {
        // const task = await Task.findOne({ _id: req.body._id })
        const task = await Task.findOne({ _id: req.params.id , owner: req.user._id })
        res.status(200).send(task)
    } catch (error) {
        res.status(500).send(error);
    }
    
})

router.patch('/tasks/:id' , auth , async (req, res) => {
    //giving error to application user who want to change the property that doesn't exist
    const update = Object.keys(req.body) // keys convert object property into stings
    const allowupdates = ['description' , 'status']
    const isUpdateAllowed = update.every((update) => {
        return allowupdates.includes(update)//include chech that update is subset of allowupdates or not
    })

    if(!isUpdateAllowed)
    {
        res.status(400).send({error: 'property does not exist that you want to update'})
    }
    //finding the user
    const task = await Task.findById({_id: req.params.id , owner: req.user._id})
    // const task = await Task.updateOne({ _id: req.params.id},req.body, { new: true , runValidators: true })
    
    try {
        if(!task){
            res.status(404).send({error: 'no such task exist! '})
        }
    //update is arry of sting 
    update.forEach((update) => task[update] = req.body[update])
    await task.save()
        res.send(task)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.delete('/tasks/:id', auth, async (req , res) => {
    try {
        const task = await Task.deleteOne({ _id: req.params.id , owner: req.user._id})
        if(!task){
            res.status(404).send({error: 'no such task exist! '})
        }
        res.status(200).send(task)
    } catch (error) {
        res.status(500).send()
    }
}) 

export default router